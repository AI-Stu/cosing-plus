export interface ServiceCatalogRelVO {
  /**
   * $column.columnComment
   */
  id: string | number

  /**
   * $column.columnComment
   */
  serviceid: string | number

  /**
   * 目录id
   */
  catalogid: string | number

  /**
   * 目录编号
   */
  catalogcode: string

}

export interface ServiceCatalogRelForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * $column.columnComment
   */
  serviceid?: string | number

  /**
   * 目录id
   */
  catalogid?: string | number

  /**
   * 目录编号
   */
  catalogcode?: string

}

export interface ServiceCatalogRelQuery extends PageQuery {

  /**
   * $column.columnComment
   */
  serviceid?: string | number

  /**
   * 目录id
   */
  catalogid?: string | number

  /**
   * 目录编号
   */
  catalogcode?: string

  /**
   * 日期范围参数
   */
  params?: any
}
