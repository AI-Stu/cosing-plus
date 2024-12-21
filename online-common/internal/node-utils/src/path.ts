import { posix } from 'node:path';
import { type Stats, readdir, stat } from 'node:fs';
/**
 * 将给定的文件路径转换为 POSIX 风格。
 * @param {string} pathname - 原始文件路径。
 */
function toPosixPath(pathname: string) {
  return pathname.split(`\\`).join(posix.sep);
}

/**
 * 递归目录
 * @param folder 目录路径
 * @param callback
 */
function recursiveDirectory(folder: string, callback: (fileList: Stats[]) => void): void {
  const fileList: Stats[] = [];
  readdir(folder, (err, files: string[]) => {
    if (err)
      throw err;
    let count = 0;
    const checkEnd = () => {
      ++count === files.length && callback(fileList);
    };
    files.forEach((item: string) => {
      stat(`${folder}/${item}`, async (err, stats) => {
        if (err)
          throw err;
        if (stats.isFile()) {
          fileList.push(stats);
          checkEnd();
        }
        else if (stats.isDirectory()) {
          recursiveDirectory(`${folder}/${item}/`, checkEnd);
        }
      });
    });
    files.length === 0 && callback(fileList);
  });
}

export { toPosixPath, recursiveDirectory };
export type { Stats };
