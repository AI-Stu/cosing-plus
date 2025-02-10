export interface DataStorageVO {
  /**
   * ID
   */
  id: string | number

  /**
   * 目录名称
   */
  name: string

  /**
   * 父目录id
   */
  pid: string | number

  /**
   * 是否文件
   */
  isfile: number

  /**
   * 是否关联项目
   */
  isrelxm: number

  /**
   * 是否发布服务
   */
  ispublish: string

  /**
   * 文件大小
   */
  fileSize: number

  /**
   * 文件类型
   */
  fileType: string

  /**
   * 文件后缀
   */
  fileSuffix: string

  /**
   * 文件路径
   */
  filePath: string

  /**
   * 顺序
   */
  orderindex: number

}

export interface DataStorageForm extends BaseEntity {
  /**
   * Id
   */
  id?: string | number

  /**
   * 目录名称
   */
  name?: string

  /**
   * 父目录id
   */
  pid?: string | number

  /**
   * 是否文件
   */
  isfile?: number

  /**
   * 是否关联项目
   */
  isrelxm?: number

  /**
   * 是否发布服务
   */
  ispublish?: number

  /**
   * 文件大小
   */
  fileSize?: number

  /**
   * 文件类型
   */
  fileType?: string

  /**
   * 文件后缀
   */
  fileSuffix?: string

  /**
   * 文件路径
   */
  filePath?: string

  /**
   * 顺序
   */
  orderindex?: number

}

export interface DataStorageQuery extends PageQuery {

  /**
   * 目录名称
   */
  name?: string

  /**
   * 父目录id
   */
  pid?: string | number

  /**
   * 是否文件
   */
  isfile?: number

  /**
   * 是否关联项目
   */
  isrelxm?: number

  /**
   * 是否发布服务
   */
  ispublish?: string

  /**
   * 文件大小
   */
  fileSize?: number

  /**
   * 文件类型
   */
  fileType?: string

  /**
   * 文件后缀
   */
  fileSuffix?: string

  /**
   * 文件路径
   */
  filePath?: string

  /**
   * 顺序
   */
  orderindex?: number

  /**
   * 日期范围参数
   */
  params?: any
}
