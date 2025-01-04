export interface SelectListType {
  name: string
  value: string
}

export interface SeacrhSelectListOptions {
  label: string
  options: SelectListType[]
  isMultiple?: boolean // 是否多选 默认单选
}
