export { default as colors } from 'picocolors'; // 终端输出字符样式
export * from './fs'; // json文件操作
export { generatorContentHash } from './hash'; // 生产基于内容的 hash，可自定义长度
export { type PackageJson, readPackageJSON, writePackageJSON } from 'pkg-types'; // 读写package.json
