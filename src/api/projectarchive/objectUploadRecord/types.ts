export interface ObjectUploadRecordVO {
  /**
   * $column.columnComment
   */
  id: string | number

  /**
   * $column.columnComment
   */
  bucket: string

  /**
   * $column.columnComment
   */
  etag: string

  /**
   * $column.columnComment
   */
  fileId: string | number

  /**
   * $column.columnComment
   */
  hash: string

  /**
   * $column.columnComment
   */
  name: string

  /**
   * $column.columnComment
   */
  partNumber: number

  /**
   * $column.columnComment
   */
  partSize: number

  /**
   * $column.columnComment
   */
  partTotal: number

  /**
   * $column.columnComment
   */
  path: string

  /**
   * $column.columnComment
   */
  status: number

  /**
   * $column.columnComment
   */
  type: number

  /**
   * $column.columnComment
   */
  uploadId: string | number

  /**
   * $column.columnComment
   */
  prefix: string

}

export interface ObjectUploadRecordForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * $column.columnComment
   */
  bucket?: string

  /**
   * $column.columnComment
   */
  etag?: string

  /**
   * $column.columnComment
   */
  fileId?: string | number

  /**
   * $column.columnComment
   */
  hash?: string

  /**
   * $column.columnComment
   */
  name?: string

  /**
   * $column.columnComment
   */
  partNumber?: number

  /**
   * $column.columnComment
   */
  partSize?: number

  /**
   * $column.columnComment
   */
  partTotal?: number

  /**
   * $column.columnComment
   */
  path?: string

  /**
   * $column.columnComment
   */
  status?: number

  /**
   * $column.columnComment
   */
  type?: number

  /**
   * $column.columnComment
   */
  uploadId?: string | number

  /**
   * $column.columnComment
   */
  prefix?: string

}

export interface ObjectUploadRecordQuery extends PageQuery {

  /**
   * $column.columnComment
   */
  bucket?: string

  /**
   * $column.columnComment
   */
  etag?: string

  /**
   * $column.columnComment
   */
  fileId?: string | number

  /**
   * $column.columnComment
   */
  hash?: string

  /**
   * $column.columnComment
   */
  name?: string

  /**
   * $column.columnComment
   */
  partNumber?: number

  /**
   * $column.columnComment
   */
  partSize?: number

  /**
   * $column.columnComment
   */
  partTotal?: number

  /**
   * $column.columnComment
   */
  path?: string

  /**
   * $column.columnComment
   */
  status?: number

  /**
   * $column.columnComment
   */
  type?: number

  /**
   * $column.columnComment
   */
  uploadId?: string | number

  /**
   * $column.columnComment
   */
  prefix?: string

  /**
   * 日期范围参数
   */
  params?: any
}
