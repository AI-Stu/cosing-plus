export interface DataStandardsCatalogVO {
  /**
   * $column.columnComment
   */
  id: string | number

  /**
   * 父id
   */
  pid: string | number

  /**
   * 标准名称
   */
  name: string

  /**
   * 顺序
   */
  orderindex: number

  /**
   * $column.columnComment
   */
  dataStandardsPath: string

}

export interface DataStandardsCatalogForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * 父id
   */
  pid?: string | number

  /**
   * 标准名称
   */
  name?: string

  /**
   * 顺序
   */
  orderindex?: number

  /**
   * $column.columnComment
   */
  dataStandardsPath?: string

}

export interface DataStandardsCatalogQuery extends PageQuery {

  /**
   * 父id
   */
  pid?: string | number

  /**
   * 标准名称
   */
  name?: string

  /**
   * 顺序
   */
  orderindex?: number

  /**
   * $column.columnComment
   */
  dataStandardsPath?: string

  /**
   * 日期范围参数
   */
  params?: any
}
