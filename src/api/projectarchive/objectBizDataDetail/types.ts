export interface ObjectBizDataDetailVO {
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
  dataId: string | number

  /**
   * $column.columnComment
   */
  fileId: string | number

  /**
   * $column.columnComment
   */
  uploadId: string

  /**
   * $column.columnComment
   */
  hash: string

  /**
   * $column.columnComment
   */
  key: string

  /**
   * $column.columnComment
   */
  platform: string

  /**
   * $column.columnComment
   */
  size: number

  /**
   * $column.columnComment
   */
  path: string

  /**
   * $column.columnComment
   */
  prefix: string

}

export interface ObjectBizDataDetailForm extends BaseEntity {
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
  dataId?: string | number

  /**
   * $column.columnComment
   */
  fileId?: string | number

  /**
   * $column.columnComment
   */
  uploadId: string

  /**
   * $column.columnComment
   */
  hash?: string

  /**
   * $column.columnComment
   */
  key?: string

  /**
   * $column.columnComment
   */
  platform?: string

  /**
   * $column.columnComment
   */
  size?: number

  /**
   * $column.columnComment
   */
  path?: string

  /**
   * $column.columnComment
   */
  prefix?: string

}

export interface ObjectBizDataDetailQuery extends PageQuery {

  /**
   * $column.columnComment
   */
  bucket?: string

  /**
   * $column.columnComment
   */
  dataId?: string | number

  /**
   * $column.columnComment
   */
  fileId?: string | number

  /**
   * $column.columnComment
   */
  uploadId: string

  /**
   * $column.columnComment
   */
  hash?: string

  /**
   * $column.columnComment
   */
  key?: string

  /**
   * $column.columnComment
   */
  platform?: string

  /**
   * $column.columnComment
   */
  size?: number

  /**
   * $column.columnComment
   */
  path?: string

  /**
   * $column.columnComment
   */
  prefix?: string

  /**
   * 日期范围参数
   */
  params?: any
}
