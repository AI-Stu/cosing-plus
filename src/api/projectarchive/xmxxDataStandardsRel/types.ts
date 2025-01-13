export interface XmxxDataStandardsRelVO {
  /**
   * id
   */
  id: string | number

  /**
   * xmid
   */
  xmid: string | number

  /**
   * 数据标准id
   */
  dataStandardsId: string | number

  /**
   * 数据类型
   */
  dataType: string

  /**
   * 数据标准
   */
  dataStandards: string

  /**
   * 技术标准
   */
  skillStandards: string

  /**
   * 资料类型
   */
  materialType: string

  /**
   * 数量
   */
  sl: number

  /**
   * 状态
   */
  stauts: number

  /**
   * 标准名称
   */
  name: string

  /**
   * $column.columnComment
   */
  datastorageid: string | number

}

export interface XmxxDataStandardsRelForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * xmid
   */
  xmid?: string | number

  /**
   * 数据标准id
   */
  dataStandardsId?: string | number

  /**
   * 数据类型
   */
  dataType?: string

  /**
   * 数据标准
   */
  dataStandards?: string

  /**
   * 技术标准
   */
  skillStandards?: string

  /**
   * 资料类型
   */
  materialType?: string

  /**
   * 数量
   */
  sl?: number

  /**
   * 状态
   */
  stauts?: number

  /**
   * 标准名称
   */
  name?: string

  /**
   * $column.columnComment
   */
  datastorageid?: string | number

}

export interface XmxxDataStandardsRelQuery extends PageQuery {

  /**
   * xmid
   */
  xmid?: string | number

  /**
   * 数据标准id
   */
  dataStandardsId?: string | number

  /**
   * 数据类型
   */
  dataType?: string

  /**
   * 数据标准
   */
  dataStandards?: string

  /**
   * 技术标准
   */
  skillStandards?: string

  /**
   * 资料类型
   */
  materialType?: string

  /**
   * 数量
   */
  sl?: number

  /**
   * 状态
   */
  stauts?: number

  /**
   * 标准名称
   */
  name?: string

  /**
   * $column.columnComment
   */
  datastorageid?: string | number

  /**
   * 日期范围参数
   */
  params?: any
}
