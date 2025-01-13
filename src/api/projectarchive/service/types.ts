export interface ServiceVO {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * 服务名称
   */
  serviceName?: string

  /**
   * 服务别名
   */
  serviceAlias?: string

  /**
   * 服务编号
   */
  serviceCode?: string

  /**
   * 服务地址
   */
  serviceUrl?: string

  /**
   * 服务类型
   */
  serviceType?: string

  /**
   * 年份
   */
  serviceYear?: string

  /**
   * 区域
   */
  region?: string

  /**
   * 视角
   */
  camera?: string

  /**
   * 范围
   */
  bounds?: string

  /**
   * 顺序
   */
  orderindex?: string

  /**
   * 状态
   */
  status?: number

  /**
   * 步骤
   */
  step?: number

}

export interface ServiceForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * 服务名称
   */
  serviceName?: string

  /**
   * 服务别名
   */
  serviceAlias?: string

  /**
   * 服务编号
   */
  serviceCode?: string

  /**
   * 服务地址
   */
  serviceUrl?: string

  /**
   * 服务类型
   */
  serviceType?: string

  /**
   * 年份
   */
  serviceYear?: string

  /**
   * 区域
   */
  region?: string

  /**
   * 视角
   */
  camera?: string

  /**
   * 范围
   */
  bounds?: string

  /**
   * 顺序
   */
  orderindex?: string

  /**
   * 状态
   */
  status?: number

  /**
   * 步骤
   */
  step?: number

}

export interface ServiceQuery extends PageQuery {

  /**
   * 服务名称
   */
  serviceName?: string

  /**
   * 服务别名
   */
  serviceAlias?: string

  /**
   * 服务编号
   */
  serviceCode?: string

  /**
   * 服务地址
   */
  serviceUrl?: string

  /**
   * 服务类型
   */
  serviceType?: string

  /**
   * 年份
   */
  serviceYear?: string

  /**
   * 区域
   */
  region?: string

  /**
   * 视角
   */
  camera?: string

  /**
   * 范围
   */
  bounds?: string

  /**
   * 顺序
   */
  orderindex?: string

  /**
   * 状态
   */
  status?: number

  /**
   * 步骤
   */
  step?: number

  /**
   * 日期范围参数
   */
  params?: any
}
