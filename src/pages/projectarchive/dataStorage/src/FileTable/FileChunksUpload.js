/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable style/no-tabs */
/**
 * 单个文件切片上传
 * @author hgh
 */
import to from 'await-to-js';
import { epgis3dFileUpload } from '@/service/servData';

export default class FileChunksUpload {
  constructor(options) {
    this.file = options.file;
    this.fileType = '';
    // 切片大小 默认2M
    this.chunkSize = options.chunkSize || 1024 * 1024 * 2;
    this.chunkList = [];
    this.uploadId = null;
    this.Md5 = null;
    this.percent = 0.00; // 上传进度
    this.postChunkSet = new Set(); // 已上传的切片
    this.waitChunkList = []; // 全部待上传切片
    this.isStop = false; // 暂停上传
    this.limit = 3; // 并发 3
    this.checkNum = 0; // 失败切片验证轮次, 最大5次
    this.activeTasks = new Set();

    this.onInitCallback = null;
    this.onPregressCallback = null;
    this.onCompleteCallback = null;
    this.onErrorCallback = null;
    this._interval = null;
    this.isDestroy = false;
  }

  async init() {
    if (!this.file) {
      this.onErrorCallback && this.onErrorCallback({
        err: '传输文件为空！',
        stage: 'OnInit' // 阶段
      });

      return console.error('传输文件为空！');
    }
    this.fileType = this.file.name && (`.${this.file.name.split('.').pop()}`);
    this.Md5 = await this.getMD5(this.chunkFile());
    const { state, path } = await this.createUploadTask();
    if (state === undefined || state == null) {
      return;
    }

    // 已存在
    if (state === 1) {
      this.percent = 100;
      this.onCompleteCallback && this.onCompleteCallback({
        percent: 100,
        md5: this.Md5,
        size: this.file.size,
        path,
        success: true
      });
      return;
    }

    // #region  --- 未上传 ------
    const { waitChunk } = await this.getUploadTaskState();

    console.log('待上传切片', waitChunk);
    if (waitChunk.length === 0) {
      // 合并
      await this.mergeChunk();
      return;
    }

    // 并发上传
    this.uploadTasksConcurrently(this.waitChunkList);

    // #endregion
  }

  /**
   * 获取文件md5值，文件分块数，文件分块大小
   * @param { Array[Bolb] } chunkList
   */
  getMD5(chunkList) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      const spark = new SparkMD5.ArrayBuffer();
      function _read(i) {
        const fileReader = new FileReader();
        if (i >= chunkList.length) {
          const md5 = spark.end();
          console.log(md5);
          return resolve(md5);
        }

        fileReader.onload = (e) => {
          spark.append(e.target.result);
          _read(i + 1);
        };

        fileReader.onerror = function () {
          console.warn('读取文件错误');
          reject('读取文件错误');
        };

        fileReader.readAsArrayBuffer(chunkList[i]);
      }
      _read(0);
    });
  }

  /**
   * 计算文件切片列表
   * @param {File} file 文件
   * @param {number} chunkSize  切片大小
   * @returns
   */
  chunkFile() {
    const file = this.file;
    const chunkSize = this.chunkSize;
    const chunks = Math.ceil(file.size / chunkSize); // 总块数
    const _chunkList = [];

    let currentChunk = 0;
    while (currentChunk < chunks) {
      const start = currentChunk * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);
      _chunkList.push(chunk);
      currentChunk++;
    }
    this.chunkList = _chunkList;
    return _chunkList;
  }

  /**
   * 创建上传任务 - 获取上传任务ID
   * @param {*} params
   * @example {
   *	"chunkSize":1048576,
   *	"fileName": "a4cb59b263f5165e25fb9de13a348a71.zip",
   *	"md5":"a4cb59b263f5165e25fb9de13a348a71",
   *	"size":2667225,
   *	"state":"0",
   *	"uploadId":"1de1a7aa34d34892817439a699883667"
   * }
   * @returns
   */
  async createUploadTask() {
    const params = {
      fileName: this.file.name,
      md5: this.Md5,
      chunkSize: this.chunkSize,
      size: this.file.size
    };
    const [err, res] = await to(epgis3dFileUpload.createFile(params));
    if (err) {
      this.onErrorCallback && this.onErrorCallback({
        err,
        stage: 'CreateUploadTask' // 阶段
      });
      return {};
    }

    const data = res.data;
    this.uploadId = data.uploadId;

    if (data.chunkSize !== this.chunkSize) {
      // 不一致 重新切片
      this.chunkSize = data.chunkSize;
      this.chunkFile();
    }

    return data;
  }

  /**
   * 获取上传任务状态
   * @description 获取当前任务传输状态及切片信息
   * @example{
   *  uploadId: 上传任务Id
   * }
   * @return Array
   */
  async getUploadTaskState() {
    const [err, res] = await to(epgis3dFileUpload.getChunks({ uploadId: this.uploadId }));
    if (err) {
      this.onErrorCallback && this.onErrorCallback({
        err,
        stage: 'UploadTaskState' // 阶段
      });
      return;
    }
    const data = res.data;
    // 排序
    const chunks = data.sort((a, b) => Number(a.index) - Number(b.index)) || [];
    this.waitChunkList = chunks.filter(e => e.state === 0) || [];
    this.postChunkSet = new Set(chunks.filter(e => e.state === 1).map(e => e.index));
    this.percent = ((chunks.length - this.waitChunkList.length) / chunks.length * 100).toFixed(2);
    this.onInitCallback && this.onInitCallback({ percent: this.percent });
    return {
      chunks,
      waitChunk: this.waitChunkList
    };
  }

  /**
   * 控制上传并发
   * @params _waitChunkList 带上传的文件切片
   */
  async uploadTasksConcurrently(_waitChunkList) {
    const waitChunk = JSON.parse(JSON.stringify(_waitChunkList)) || [];
    for (let i = 0; i < this.limit; i++) {
      if (this.activeTasks.size < this.limit) {
        !this.isDestroy && _queue(this);
      }
    }

    function _queue(that) {
      if (that.isStop) {
        console.log('暂停');
        that.waitChunkList = waitChunk;
        return;
      }

      if (waitChunk.length === 0) {
        return;
      }

      const _chunk = waitChunk.shift();
      const _index = _chunk.index;
      that.uploadChunk(_index, waitChunk).then((code) => {
        if (code === 1) {
          return;
        }
        // 上传完成移除任务
        that.activeTasks.delete(_index);
        _queue(that);
      });

      that.activeTasks.add(_index);
    }
  }

  /**
   * 上传文件切片
   * @param {number} index
   *
   */
  async uploadChunk(index, waitChunk) {
    const formData = new FormData();
    formData.append('file', this.chunkList[index]);
    formData.append('uploadId', this.uploadId);
    formData.append('index', index);

    if (!this.chunkList[index]) {
      return Promise.resolve(0);
    }

    const [err, res] = await to(epgis3dFileUpload.uploadChunk(formData));
    if (err) {
      console.log(err);
      return Promise.resolve(0);
    }

    // 上传完成则记录
    if (res.code === 1) {
      this.postChunkSet.add(index);

      this.percent = (this.postChunkSet.size / this.chunkList.length * 100).toFixed(2);
      if (waitChunk.length === 0 && this.activeTasks.size === 1) {
        console.log(`开始合并${this.checkNum + 1}次`);
        // 切片全部传完后合并
        await this.mergeChunk();

        // 失败切片验证轮次
        if (this.checkNum >= 4) {
          this.onErrorCallback && this.onErrorCallback({
            err: '切片上传验证5轮失败',
            stage: 'UploadChunk' // 阶段
          });
          return Promise.resolve(1);
        }
        this.checkNum++;
      }
      else {
        this.onPregressCallback && this.onPregressCallback({
          percent: this.percent,
          index
          // chunks: this.chunks
        });
      }
    }

    return Promise.resolve(0);
  }

  /**
   * 合并文件切片
   */
  async mergeChunk() {
    this.checkNum = 0;
    this.waitChunkList = [];
    let max = 360000; // 最大一个小时 60 * 60 * 1000 / 10

    const { waitChunk } = await this.getUploadTaskState();

    console.log('待上传切片', waitChunk);
    if (waitChunk.length !== 0) {
      // 未传完
      this.uploadTasksConcurrently(this.waitChunkList);
      return;
    }

    // 10s 定时去刷合并状态是否完成
    this._interval = setInterval(async () => {
      max <= 0 && clearInterval(this._interval);
      max--;
      const [, _res] = await to(this.getTaskState());
      if (_res) {
        this.onCompleteCallback && this.onCompleteCallback({
          percent: 100,
          md5: this.Md5,
          size: this.file.size,
          path: _res.path,
          success: true
        });
        clearInterval(this._interval);
      }
    }, 10000);

    const [err] = await to(epgis3dFileUpload.complete({ uploadId: this.uploadId }));
    // 合并异常
    // TODO: 1.接口超时 res无返回
    //       2.合并出错 res有返回
    if (err) {
      if (err.msg) {
        this.onErrorCallback && this.onErrorCallback({
          err,
          stage: 'MergeChunk' // 阶段
        });
        clearInterval(this._interval);
      }
    }
  }

  /**
   * 查询文件状态是否上传完成
   * @return {object} res
   */
  async getTaskState() {
    const params = {
      fileName: this.file.name,
      md5: this.Md5,
      chunkSize: this.chunkSize,
      size: this.file.size
    };
    const [err, res] = await to(epgis3dFileUpload.createFile(params));
    if (err) {
      return Promise.reject();
    }
    const data = res.data;
    return data.state === 1 ? Promise.resolve(data) : Promise.reject();
  }

  /**
   * 初始化回调
   * @param {*} callback
   */
  onInit(callback) {
    this.onInitCallback = callback;
  }

  /**
   * 进行中回调
   * @param {*} callback
   */
  onPregress(callback) {
    this.onPregressCallback = callback;
  }

  /**
   * 完成回调
   * @param {*} callback
   */
  onComplete(callback) {
    this.onCompleteCallback = callback;
  }

  /**
   * 文件上传错误回调
   * @description 切片上传错误不抛
   * @param {*} callback
   */
  onError(callback) {
    this.onErrorCallback = callback;
  }

  /**
   * 暂停上传
   */
  stop() {
    this.isStop = true;
  }

  /**
   * 恢复上传
   */
  resume() {
    this.isStop = false;
    this.uploadTasksConcurrently(this.waitChunkList);
  }

  /**
   * 注销
   */
  destroy() {
    this.isDestroy = true;
    this.uploadTasksConcurrently([]);
    this._interval && clearInterval(this._interval);
    this._interval = null;
    this.chunkList = [];
    this.waitChunkList = [];
    this.postChunkSet = new Set();

    this.onInitCallback = null;
    this.onPregressCallback = null;
    this.onCompleteCallback = null;
    this.onErrorCallback = null;
    this.isStop = false;
  }
}
