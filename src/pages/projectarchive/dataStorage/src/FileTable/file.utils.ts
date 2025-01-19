// 文件上传工具

import MyWorker from './file.worker.ts?worker';
import { initFileApi } from '@/api/projectarchive/fileUpload';

export const getConcurrency = () => navigator.hardwareConcurrency || 4;

/**
 * 获取文件切片
 * @param file
 * @returns
 */
export function sliceFile(file: File) {
  return new Promise((resolve, reject) => {
    const chunkSize = 3 * 1024 ** 2; // 3MB
    const chunkNum = Math.ceil(file.size / chunkSize); // 切片总数量

    const thread = chunkNum > 10 ? getConcurrency() : 1; // 线程数
    const chunks = [] as any[];

    const workerChunkCount = Math.ceil(chunkNum / thread); // 每个线程需要处理的切片数量
    let finishCount = 0;

    for (let i = 0; i < thread; i++) {
      console.time(String(i));
      const worker = new MyWorker(); ;

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
        endIndex
      });

      // 接收到 worker 线程返回的消息
      worker.onmessage = (e: any) => {
        console.log('data', e);
        console.timeEnd(String(i));
        if (e.data.error) {
          worker.terminate();
          reject(e.data.error);
        }

        // 合并线程切片
        for (let i = startIndex; i < endIndex; i++) {
          chunks[i] = {
            ...e.data.chunks[i - startIndex],
            chunkNum,
            filename: file.name
          };
        }

        worker.terminate(); // 关闭线程

        finishCount++;
        if (finishCount === thread) {
          console.log({
            chunks,
            chunkNum,
            md5: e.data.MD5
          });
          resolve({
            chunks,
            chunkNum,
            md5: e.data.MD5
          });
        }
      };
    }
  });
}

export async function createUploadTask(data: object) {
  initFileApi(data)
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}

// export function uploadFile(chunks) {
//   chunks = chunks || [];

//   let schedule = 0; // 进度

//   const { dispatch } = handleEvent();

//   const requestQueue = (concurrency) => {
//     concurrency = concurrency || 6;
//     const queue = [] as any[]; // 线程池
//     let current = 0;

//     const dequeue = () => {
//       while (current < concurrency && queue.length) {
//         current++;
//         const requestPromiseFactory = queue.shift();
//         requestPromiseFactory()
//           .then((result) => { // 上传成功处理
//             console.log(result);

//             schedule++; // 收集上传切片成功的数量

//             dispatch(window, schedule); // 事件派发，通知进度
//           })
//           .catch((error) => { // 失败
//             console.log(error);
//           })
//           .finally(() => {
//             current--;
//             dequeue();
//           });
//       }
//     };

//     return (requestPromiseFactory) => {
//       queue.push(requestPromiseFactory);
//       dequeue();
//     };
//   };

//   const handleFormData = (obj) => {
//     const formData = new FormData();

//     Object
//       .entries(obj)
//       .forEach(([key, val]) => {
//         formData.append(key, val);
//       });

//     return formData;
//   };

//   const enqueue = requestQueue(6);

//   for (let i = 0; i < chunks.length; i++) {
//     enqueue(() => axios.post(
//       '/api/upload',
//       handleFormData(chunks[i]),
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     ));
//   }

//   return schedule;
// }
