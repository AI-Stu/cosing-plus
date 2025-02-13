import type { ColumnType } from 'ant-design-vue/es/table/interface';
import type { VNode } from 'vue';

import type { TooltipProps } from 'ant-design-vue/es/tooltip/Tooltip';
import type { PopconfirmProps } from 'ant-design-vue/es/popconfirm';

export interface ATableColumnType extends ColumnType {
  type?: 'dict-tag' | 'dict' | 'switch' | 'checkbox' | 'radio' | 'date-range' | 'rate' | 'progress'
  component?: VNode
  componentProps?: Record<string, any>
  hide?: boolean // 是否隐藏列
  disabled?: boolean // 是否在列设置中禁止勾选
};

export interface ATableApi {
  LIST_API: (...arg: any[]) => Promise<any>
  ADD_API?: (...arg: any[]) => Promise<any>
  DEL_API?: (...arg: any[]) => Promise<any>
  UPDATE_API?: (...arg: any[]) => Promise<any>
  DOWNLOAD?: string | ((...arg: any[]) => Promise<any>)
}

export interface AccessKey {
  ADD?: string
  DEL?: string
  EDIT?: string
  EXPORT?: string
};

export interface ActionItem {
  onClick?: Fn
  label: string
  popConfirm?: PopconfirmProps
  disabled?: boolean
  divider?: boolean
  auth?: string | string[] // 权限编码控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean) // 业务控制是否显示
  tooltip?: TooltipProps
  color?: string
}
