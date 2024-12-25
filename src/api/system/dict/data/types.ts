export interface DictDataQuery extends PageQuery {
  dictName: string
  dictType: string
  dictLabel: string
}

export interface DictDataVO extends BaseEntity {
  dictCode: string
  dictLabel: string
  dictValue: string
  tagClass: string
  tagType: ATagType
  dictSort: number
  remark: string
}

export interface DictDataForm {
  dictType?: string
  dictCode: string | undefined
  dictLabel: string
  dictValue: string
  tagClass: string
  tagType: ATagType
  dictSort: number
  remark: string
}
