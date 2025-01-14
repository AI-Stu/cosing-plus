export interface DataStandardsVO {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * 数据标准目录id
   */
  dataStandardCatalogId?: string | number

  /**
   * 标准名称
   */
  name?: string

  /**
   * 数据类型
   */
  dataType?: string

  /**
   * 技术标准
   */
  skillStandards?: string

  /**
   * 资料类型
   */
  materialType?: string

  /**
   * 数据标准
   */
  dataStandards?: string

  /**
   * 数量
   */
  sl?: number

  /**
   * 状态
   */
  stauts?: number

  /**
   * 顺序
   */
  orderindex?: number

}

export interface DataStandardsForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * 数据标准目录id
   */
  dataStandardCatalogId?: string | number

  /**
   * 标准名称
   */
  name?: string

  /**
   * 数据类型
   */
  dataType?: string

  /**
   * 技术标准
   */
  skillStandards?: string

  /**
   * 资料类型
   */
  materialType?: string

  /**
   * 数据标准
   */
  dataStandards?: string

  /**
   * 数量
   */
  sl?: number

  /**
   * 状态
   */
  stauts?: number

  /**
   * 顺序
   */
  orderindex?: number

}

export interface DataStandardsQuery extends PageQuery {

  /**
   * 数据标准目录id
   */
  dataStandardCatalogId?: string | number

  /**
   * 标准名称
   */
  name?: string

  /**
   * 数据类型
   */
  dataType?: string

  /**
   * 技术标准
   */
  skillStandards?: string

  /**
   * 资料类型
   */
  materialType?: string

  /**
   * 数据标准
   */
  dataStandards?: string

  /**
   * 数量
   */
  sl?: number

  /**
   * 状态
   */
  stauts?: number

  /**
   * 顺序
   */
  orderindex?: number

  /**
   * 日期范围参数
   */
  params?: any
}
