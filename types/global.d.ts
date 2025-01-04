import type { ComponentInternalInstance as ComponentInstance } from 'vue';

declare global {
  /** vue Instance */
  declare type ComponentInternalInstance = ComponentInstance;

  /** 返回可空 */
  declare type BackNullable<T> = T | null | undefined;

  /**
   * 界面字段隐藏属性
   */
  declare interface FieldOption {
    key: number
    label: string
    visible: boolean
    children?: Array<FieldOption>
  }

  /**
   * 弹窗属性
   */
  declare interface DialogOption {
    /**
     * 弹窗标题
     */
    title?: string
    /**
     * 是否显示
     */
    visible: boolean
    /**
     * 是否显示
     */
    isDisabled: boolean
  }

  declare interface UploadOption {
    /** 设置上传的请求头部 */
    headers: { [key: string]: any }

    /** 上传的地址 */
    url: string
  }

  /**
   * 导入属性
   */
  declare interface ImportOption extends UploadOption {
    /** 是否显示弹出层 */
    open: boolean
    /** 弹出层标题 */
    title: string
    /** 是否禁用上传 */
    isUploading: boolean

    updateSupport: number

    /** 其他参数 */
    [key: string]: any
  }
  /**
   * 字典数据  数据配置
   */
  declare interface DictDataOption {
    label: string
    value: string
    tagType?: ATagType
    tagClass?: string
  }

  declare interface BaseEntity {
    createBy?: any
    createDept?: any
    createTime?: string
    updateBy?: any
    updateTime?: any
  }

  /**
   * 分页数据
   * T : 表单数据
   * D : 查询参数
   */
  declare interface PageData<T, D> {
    formData: T
    queryParams?: D
    rules?: ElFormRules
  }
  /**
   * 分页查询参数
   */
  declare interface PageQuery {
    pageNum: number
    pageSize: number
  }
}
export {};
