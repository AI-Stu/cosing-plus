import SparkMD5 from 'spark-md5';
import type { FileType } from 'ant-design-vue/es/upload/interface';
import { assign, cloneDeep } from 'lodash-es';
import MyWorker from './file.worker.ts?worker';
import { completedFileApi, createUploadTaskApi, uploadFileApi } from '@/api/projectarchive/fileUpload';
import { listObjectBizDataDetailApi } from '@/api/projectarchive/objectBizDataDetail';
import type { FileChunkFrom, FileUploadForm } from '@/api/projectarchive/fileUpload/types';
import AssociativeArray from '@/utils/AssociativeArray';

/**
 * 文件上传状态
 * pending 待解析
 * analysis 解析中
 * completed 已解析
 * error 解析失败
 * wait 待上传
 * uploading 上传中
 * done 合并中
 * failed 上传失败
 * success 上传成功
 * stop 已暂停
 */
type FileChunkStatus = 'pending' | 'analysis' | 'error' | 'completed'
type FileUploadStatus = 'wait' | 'uploading' | 'failed' | 'done' | 'success' | 'stop'
export type FileStatus = FileChunkStatus | FileUploadStatus
export interface FileChunkResult {
  /**
   * 上传uid
   */
  uid: number | string

  /**
   * 切片
   */
  chunks: Blob[]
  /**
   * 切片总数
   */
  chunkNum: number

  /**
   * MD5
   */
  md5?: string
}

export interface FileUploadProps {
  /**
   * 上传任务id
   */
  uploadId?: number | string

  /**
   * 父文件夹id
   */
  pid?: number | string

  /**
   * 文件名
   */
  name: string

  /**
   * 文件Id(创建上传任务后才有)
   */
  fileId?: number | string

  /**
   * 待传文件 （前端自定义）
   */
  file: File | FileType

  /**
   * 文件大小
   */
  size: number

  /**
   * 上传状态
   */
  status: FileStatus

  /**
   * 上传uid
   */
  uid: number | string

  /**
   * 上传进度
   */
  percent?: number

  /**
   * 切片总数
   */
  chunkNum?: number

  /**
   * 存储路径
   */
  path?: string

  /**
   * 文件摘要信息(MD5)
   */
  hash?: string
}

export interface LoadChunkProps {

  /**
   * 是否切片中
   */
  status: boolean

  onChunk: (item: any) => void

  onChunkDone: (item: FileChunkResult) => void
}

export interface LoadUploadProps {

  /**
   * 是否上传中
   */
  status: boolean

  /**
   * 待上传切片
   */
  postChunkSet: Set<number>

  /**
   * 已上传切片
   */
  waitChunkList: number[]

  /**
   * 当前任务切片总数
   */
  totalChunks: number
}

export interface FileUploadOptions<D = FileUploadProps> {
  /**
   * 数据源
   */
  dataSource: D[]
  /**
   * 上传文件队列
   */
  uploadFileQueue: AssociativeArray

  /**
   * 切片文件队列
   */
  chunkFileQueue: AssociativeArray

  /**
   * 已处理的切片集合
   */
  chunks: Record<string | number, Blob[]>

  /**
   * 处理切片
   */
  loadChunk: LoadChunkProps

  /**
   * 处理上传
   */
  loadUpload: LoadUploadProps

  /**
   * 切片大小
   */
  chunkSize: number

  /**
   * 切片上传完成
   */
  onUpload: (item: any) => void

  /**
   * 文件上传完成
   */
  onUploadDone: (item: any) => void

  onError: (err: any) => void

}

// 获取硬件线程数
export function getConcurrency() {
  const _thread = navigator.hardwareConcurrency || 8;
  return Math.ceil(_thread / 2);
}

function formatNumber(num: number) {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return num.toFixed(2);
}

// 全部上传请求数目
export const totalRequest = 0;

export function useFileUpload(_options: Partial<FileUploadOptions>) {
  const state = reactive<FileUploadOptions>(assign({
    dataSource: [],
    uploadFileQueue: new AssociativeArray(),
    chunkFileQueue: new AssociativeArray(),
    chunkSize: 3 * 1024 ** 2, // 切片大小 默认3M
    chunks: {} as Record<string | number, Blob[]>,
    loadChunk: assign({
      status: false,
      onChunk() {},
      onChunkDone() {}
    } as LoadChunkProps, _options.loadChunk),

    loadUpload: {
      status: false,
      postChunkSet: new Set(), // 已上传的切片
      waitChunkList: [], // 全部待上传切片
      totalChunks: 0
    },
    onUpload() {},
    onUploadDone() {},
    onError(err: any) {
      console.error(err);
    }
  }, _options));

  /**
   * 开始上传
   * @param rows
   */
  function onStart(rows: FileUploadProps[]) {
    // 组装队列
    rows.forEach((e: FileUploadProps) => {
      if (['wait', 'uploading', 'done', 'failed'].includes(e.status)) {
        state.uploadFileQueue.set(e.uid, e);
      }
      if (['analysis', 'pending', 'error'].includes(e.status) && !state.chunks[e.uid]) {
        state.chunkFileQueue.set(e.uid, e);
      }
    });

    sliceFileQueue();
    uploadFileQueue();
  }

  /**
   * 暂停上传
   */
  function onStop(rows: FileUploadProps[]) {

  }

  /**
   * 上传完成移除
   * @param uid
   */
  function onRemove(uid: string | number) {
    const index = state.dataSource.findIndex(e => e.uid === uid);
    delete state.chunks[uid];
    state.dataSource?.splice(index, 1);
  }

  /**
   * 文件切片队列
   */
  function sliceFileQueue() {
    const row = cloneDeep(state.chunkFileQueue.values[0]) as FileUploadProps;
    // 切片队列为空，直接返回
    if (!row) {
      state.loadChunk.status = false;
      return;
    }

    // 切片队列中继续切片
    if (state.loadChunk.status)
      return;

    const uid = row.uid;

    state.loadChunk.status = true;
    if (state.chunks[uid]) {
      // 保持原状态
      const status = getValue(uid).status;
      getValue(uid).status = ['pending', 'analysis', 'error', 'completed'].includes(status) ? 'completed' : status;
      state.chunkFileQueue.remove(uid);
      state.loadChunk.status = false;
      sliceFileQueue();

      // 开启上传
      state.uploadFileQueue.set(uid, { ...getValue(uid) });
      uploadFileQueue();
      return;
    }

    getValue(uid).status = 'analysis';
    sliceFile(uid, row.file).then((res) => {
      state.loadChunk.onChunkDone({ ...res });
      state.chunks[uid] = res.chunks;
      getValue(uid).status = 'completed';
      getValue(uid).chunkNum = res.chunkNum;
      getValue(uid).hash = res.md5;

      // 开启上传
      state.uploadFileQueue.set(uid, { ...getValue(uid), status: 'wait' });
      uploadFileQueue();
    }).catch((error) => {
      getValue(uid).status = 'error';
      state.onError({ uid, error });
    }).finally(() => {
      state.chunkFileQueue.remove(uid);
      sliceFileQueue();
    });
  }

  /**
   * 文件上传队列
   */
  function uploadFileQueue() {
    const row = cloneDeep(state.uploadFileQueue.values[0]) as FileUploadProps;
    // 切片队列为空，直接返回
    if (!row) {
      state.loadUpload.status = false;
      return;
    }

    // 上传队列中继续上传
    if (state.loadUpload.status)
      return;

    const uid = row.uid;
    state.loadUpload.status = true;
    state.loadUpload.totalChunks = row.chunkNum || 0;

    // 切片集合不存在
    if (!state.chunks[uid]) {
      state.uploadFileQueue.remove(uid);
      getValue(uid).status = 'error';
      state.loadUpload.status = false;
      // 执行下一个
      uploadFileQueue();
      return;
    }

    getValue(uid).status = 'uploading';
    uploadFile(uid).catch((error) => {
      getValue(uid).status = 'failed';
      state.onError({ uid, error });
    });
  }

  /**
   * 上传文件
   * @param { string | number } uid
   */
  async function uploadFile(uid: string | number) {
    const resTask = await getUploadTaskState(uid);
    console.log(resTask);

    // 全部切片已上传
    if (state.loadUpload.waitChunkList.length === 0) {
      // 存在文件id 已合并
      await mergeChunk(uid);
      return;
    }

    // 上传切片
    uploadChunkConcurrently(uid, resTask.uploadId);
  }

  /**
   * 上传切片
   */
  function uploadChunkConcurrently(uid: string | number, uploadId: string | number) {
    const row = state.uploadFileQueue.get(uid);
    const queue = [] as any[]; // 线程池

    for (let i = 0; i < state.loadUpload.waitChunkList.length; i++) {
      const chunkIndex = state.loadUpload.waitChunkList[i];
      if (state.chunks[uid] && !Number.isNaN(chunkIndex)) {
        const chunk = state.chunks[uid][chunkIndex];
        queue.push({
          file: chunk,
          filename: row.name,
          path: row.path,
          uploadId,
          partNumber: chunkIndex,
          partTotal: row.chunkNum
        });
      }
    }

    const handleFormData = (obj: Record<string, any>): FileChunkFrom => {
      const formData = new FormData();

      Object
        .entries(obj)
        .forEach(([key, val]) => {
          formData.append(key, val);
        });

      return formData;
    };

    // 并行上传
    const concurrency = 3;
    let current = 0;

    for (let i = 0; i < concurrency; i++) {
      if (current < concurrency) {
        dequeue();
      }
    }

    async function dequeue() {
      if (queue.length > 0) {
        current++;
        const factory = queue.shift();
        if (factory) {
          const { data } = await uploadFileApi(handleFormData(factory))
            .catch((error: any) => { // 失败
              console.log(error);
              current--;
              dequeue();
            });

          state.loadUpload.postChunkSet.add(factory.partNumber);
          state.onUpload({ uid, factory });
          // 上传成功处理
          getValue(uid).percent = formatNumber(state.loadUpload.postChunkSet.size / state.loadUpload.totalChunks * 100);
          current--;

          if (queue.length === 0 && current === 0) {
            await mergeChunk(uid);
          }
          else {
            dequeue();
          }
        }
      }
    };
  }

  /**
   * 获取或创建文件切片任务
   * @param uid
   * @returns Promise 任务结果
   */
  async function getUploadTaskState(uid: string | number) {
    const row = state.uploadFileQueue.get(uid);
    const taskParams: FileUploadForm = {
      name: row.name,
      size: row.size,
      hash: row.hash,
      path: row.path,
      partTotal: row.chunkNum
    };
    // 创建上传任务
    const { data: resTask } = await createUploadTaskApi(taskParams).catch((error) => {
      return Promise.reject(error);
    });

    getValue(uid).uploadId = resTask.uploadId;
    getValue(uid).fileId = resTask.id;
    resTask.tobjectUploadRecordList = resTask.tobjectUploadRecordList || [];

    // 已传切片索引
    const allSet = new Set(Array.from({ length: row.chunkNum }, (_, i) => i));
    state.loadUpload.postChunkSet = new Set(resTask.tobjectUploadRecordList.map((e: any) => Number(e.partNumber)));
    getValue(uid).percent = formatNumber(state.loadUpload.postChunkSet.size / state.loadUpload.totalChunks * 100);
    state.loadUpload.waitChunkList = Array.from(new Set([...allSet].filter(e => !state.loadUpload.postChunkSet.has(e))));

    return Promise.resolve(resTask);
  }

  /**
   * 合并文件切片
   */
  async function mergeChunk(uid: string | number) {
    let max = 180; // 最大半小时 30 * 60 / 10
    const uploadId = getValue(uid).uploadId;
    // 10s 定时去刷合并状态是否完成
    const _interval = setInterval(async () => {
      max <= 0 && clearInterval(_interval);
      max--;

      const res = await listObjectBizDataDetailApi({
        uploadId,
        pageNum: 1,
        pageSize: 10
      }).catch(() => {

      });
      if (res?.rows?.length > 0) {
        _next(uid);
        clearInterval(_interval);
      }
    }, 10000);

    const { data: mergeRes } = await completedFileApi(uploadId).catch((err) => {
      if (err.msg) {
        clearInterval(_interval);
      }
    });

    if (mergeRes) {
      _next(uid);
      clearInterval(_interval);
    }

    function _next(uid: string | number) {
      getValue(uid).status = 'success';
      state.onUploadDone(uid);
      state.uploadFileQueue.remove(uid);
      uploadFileQueue();
    }
  }

  /**
   * 获取文件切片
   * @param uid
   * @param file
   * @param isMd5
   */
  async function sliceFile(uid: number | string, file: File, isMd5 = true): Promise<FileChunkResult> {
    const chunkSize = 3 * 1024 ** 2; // 3MB
    const chunkNum = Math.ceil(file.size / chunkSize); // 切片总数量

    const thread = chunkNum > 10 ? getConcurrency() : 1; // 线程数
    const chunks = [] as any[];
    const promises = [];

    const workerChunkCount = Math.ceil(chunkNum / thread); // 每个线程需要处理的切片数量
    let finishCount = 0;

    for (let i = 0; i < thread; i++) {
      const promise = new Promise((resolve, reject) => {
        const worker = new MyWorker();

        // 计算每个线程的开始索引和结束索引
        const startIndex = i * workerChunkCount;

        let endIndex = startIndex + workerChunkCount;

        // 防止最后一个线程结束索引大于文件的切片数量的总数量
        if (endIndex > chunkNum) {
          endIndex = chunkNum;
        }

        worker.postMessage({
          file,
          chunkSize,
          startIndex,
          endIndex,
          isMd5
        });

        // 接收到 worker 线程返回的消息
        worker.onmessage = (e: any) => {
          if (e.data.error) {
            worker.terminate();
            reject(e.data.error);
          }
          resolve(e.data);

          state.loadChunk.onChunk({ uid, data: e.data });
          worker.terminate(); // 关闭线程
        };
      });

      finishCount++;
      promises.push(promise);
    }
    const res = await Promise.all(promises).catch((e) => {
      return Promise.reject(e);
    });

    // 合并哈希值和切片
    let finalSpark: SparkMD5 | null = null;
    isMd5 && (finalSpark = new SparkMD5());
    res.forEach((e: any) => {
      chunks.push(...e.chunks);
      isMd5 && finalSpark?.append(e.MD5);
    });

    const md5 = finalSpark?.end() || ''; // 计算最终的 MD5 值
    return Promise.resolve({ uid, chunks, chunkNum, md5 });
  }

  /**
   * 根据 key 获取 value
   *
   * @param {string | number} key
   * @returns {*} value
   */
  function getValue(key: string | number): any {
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw console.error('键必须是字符串或数字！');
    }
    return state.dataSource.find(e => e.uid === key);
  }

  return { state, sliceFile, onStart, onStop, onRemove };
}
