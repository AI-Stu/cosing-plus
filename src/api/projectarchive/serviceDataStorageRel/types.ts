export interface ServiceDataStorageRelVO {
  /**
   * $column.columnComment
   */
  id: string | number

  /**
   * 数据存储id
   */
  datastorageid: string | number

  /**
   * 服务id
   */
  serviceid: string | number

  /**
   * 项目信息id
   */
  xmxxid: string | number

  /**
   * 类型
   */
  type: string

}

export interface ServiceDataStorageRelForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number

  /**
   * 数据存储id
   */
  datastorageid?: string | number

  /**
   * 服务id
   */
  serviceid?: string | number

  /**
   * 项目信息id
   */
  xmxxid?: string | number

  /**
   * 类型
   */
  type?: string

}

export interface ServiceDataStorageRelQuery extends PageQuery {

  /**
   * 数据存储id
   */
  datastorageid?: string | number

  /**
   * 服务id
   */
  serviceid?: string | number

  /**
   * 项目信息id
   */
  xmxxid?: string | number

  /**
   * 类型
   */
  type?: string

  /**
   * 日期范围参数
   */
  params?: any
}
