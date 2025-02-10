import SparkMD5 from 'spark-md5';

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

/**
 * 接收主线程的通知
 * @param param0
 */
ctx.onmessage = async ({
  data: {
    file,
    chunkSize,
    startIndex,
    endIndex,
    isMd5
  }
}) => {
  chunkSize = chunkSize ?? 3 * 1024 ** 2;
  startIndex = startIndex ?? 0;
  endIndex = endIndex ?? Math.ceil(file.size / chunkSize); // 总块数

  let currentChunk = startIndex;
  const chunks = [];
  const spark = new SparkMD5.ArrayBuffer();
  const promises = [];

  while (currentChunk < endIndex) {
    const start = currentChunk * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunkFile = file.slice(start, end);
    chunks.push(chunkFile);

    if (isMd5) {
      const fileReader = new FileReader();
      const promise = new Promise<void>((resolve, reject) => {
        fileReader.onload = function (event: any) {
          spark.append(event.target.result);
          resolve();
        };
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(chunkFile);
      });
      promises.push(promise);
    }

    currentChunk++;
  }

  try {
    await Promise.all(promises);
    const MD5 = isMd5 ? spark.end() : '';
    ctx.postMessage({
      chunks,
      ...(isMd5 && { MD5 })
    });
  }
  catch (error) {
    ctx.postMessage({
      error
    });
  }
};

ctx.onerror = (e) => {
  ctx.postMessage({
    error: e.message
  });
};
