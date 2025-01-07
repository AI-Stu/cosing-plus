export interface CatalogVO {
  /**
   * $column.columnComment
   */
  id: string | number

  /**
   * $column.columnComment
   */
  pid: string | number

  /**
   * 名称
   */
  catalogname: string

  /**
   * 别名
   */
  catalogalias: string

  /**
   * 目录编号
   */
  catalogcode: string

  /**
   * 是否显示
   */
  isshow: number

  /**
   * 顺序
   */
  orderindex: number

}

export interface CatalogForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * $column.columnComment
   */
  pid?: string | number

  /**
   * 名称
   */
  catalogname?: string

  /**
   * 别名
   */
  catalogalias?: string

  /**
   * 目录编号
   */
  catalogcode?: string

  /**
   * 是否显示
   */
  isshow?: number

  /**
   * 顺序
   */
  orderindex?: number

}

export interface CatalogQuery extends PageQuery {

  /**
   * $column.columnComment
   */
  pid?: string | number

  /**
   * 名称
   */
  catalogname?: string

  /**
   * 别名
   */
  catalogalias?: string

  /**
   * 目录编号
   */
  catalogcode?: string

  /**
   * 是否显示
   */
  isshow?: number

  /**
   * 顺序
   */
  orderindex?: number

  /**
   * 日期范围参数
   */
  params?: any
}
