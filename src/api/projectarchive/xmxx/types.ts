export interface XmxxVO {
  /**
   * 项目信息id
   */
  xmxxid: string | number

  /**
   * 项目编号
   */
  xmbh: string

  /**
   * 委托单位
   */
  unit: string

  /**
   * 区域
   */
  region: string

  /**
   * 项目地址
   */
  xmdz: string

  /**
   * 是否竣工
   */
  isjg: number

  /**
   * 竣工时间
   */
  jgsj: string

  /**
   * 签定时间
   */
  signdata: string

  /**
   * 经度
   */
  longitude: number

  /**
   * 纬度
   */
  latitude: number

}

export interface XmxxForm extends BaseEntity {
  /**
   * 项目信息id
   */
  xmxxid?: string | number

  /**
   * 项目编号
   */
  xmbh?: string

  /**
   * 委托单位
   */
  unit?: string

  /**
   * 区域
   */
  region?: string

  /**
   * 项目地址
   */
  xmdz?: string

  /**
   * 是否竣工
   */
  isjg?: number

  /**
   * 竣工时间
   */
  jgsj?: string

  /**
   * 签定时间
   */
  signdata?: string

  /**
   * 经度
   */
  longitude?: number

  /**
   * 纬度
   */
  latitude?: number

}

export interface XmxxQuery extends PageQuery {

  /**
   * 项目编号
   */
  xmbh?: string

  /**
   * 委托单位
   */
  unit?: string

  /**
   * 区域
   */
  region?: string

  /**
   * 项目地址
   */
  xmdz?: string

  /**
   * 是否竣工
   */
  isjg?: number

  /**
   * 竣工时间
   */
  jgsj?: string

  /**
   * 签定时间
   */
  signdata?: string

  /**
   * 经度
   */
  longitude?: number

  /**
   * 纬度
   */
  latitude?: number

  /**
   * 日期范围参数
   */
  params?: any
}
