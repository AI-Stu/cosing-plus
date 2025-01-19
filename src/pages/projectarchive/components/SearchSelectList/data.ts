export interface SelectListType {
  name: string
  value: string | number
}

export interface SeacrhSelectListOptions {
  label: string
  options: SelectListType[]
  isMultiple?: boolean // 是否多选 默认单选
}
