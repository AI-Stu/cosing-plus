export interface FileUploadForm extends BaseEntity {
  /**
   * 文件ID
   */
  id?: string | number

  /**
   * 存储桶
   */
  bucket?: string

  /**
   * 文件名称
   */
  name?: string | number

  /**
   * 文件大小(字节数)
   */
  size?: number

  /**
   * 文件路径前缀
   */
  prefix?: string

  /**
   * 存储路径
   */
  path?: string

  /**
   * 文件摘要信息(MD5)
   */
  hash?: string

  /**
   * 文件切片数
   */
  partTotal?: number

}

export interface FileChunkFrom extends FormData {
  /**
   * 存储路径
   */
  path?: string

  /**
   * 存储文件
   */
  file?: File

  /**
   * 上传任务id
   */
  uploadId?: string

  /**
   * 存储桶
   */
  bucket?: string

  /**
   * 文件后缀
   */
  prefix?: string

  /**
   * 文件切片数
   */
  partTotal?: number

  /**
   * 当前切片索引
   */
  partNumber?: number

}
