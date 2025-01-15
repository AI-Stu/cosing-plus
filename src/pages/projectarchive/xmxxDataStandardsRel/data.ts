import type { Rule } from 'ant-design-vue/es/form';
import { addDataStandardsCatalogApi, listDataStandardsCatalogApi } from '@/api/projectarchive/dataStandardsCatalog';
import { addXmxxDataStandardsRelApi, delXmxxDataStandardsRelApi, listXmxxDataStandardsRelApi, updateXmxxDataStandardsRelApi } from '@/api/projectarchive/xmxxDataStandardsRel';
import type { XmxxDataStandardsRelVO } from '@/api/projectarchive/xmxxDataStandardsRel/types';

export const AccessKey = {
  ADD: 'projectarchive:xmxxDataStandardsRel:add',
  DEL: 'projectarchive:xmxxDataStandardsRel:remove',
  EDIT: 'projectarchive:xmxxDataStandardsRel:edit',
  EXPORT: 'projectarchive:xmxxDataStandardsRel:export'
};

export const Api = {
  ADD_CATALOG_API: addDataStandardsCatalogApi,
  LIST_CATALOG_API: listDataStandardsCatalogApi,
  ADD_API: addXmxxDataStandardsRelApi,
  DEL_API: delXmxxDataStandardsRelApi,
  UPDATE_API: updateXmxxDataStandardsRelApi,
  LIST_API: listXmxxDataStandardsRelApi,
  DOWNLOAD: 'projectarchive/xmxxDataStandardsRel/export'
};

// 表格列
export const columns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    customRender: ({ index }: { index: number }) => {
      return index + 1;
    },
    width: 80,
    minWidth: 80,
    maxWidth: 120,
    disabled: true
  },
  {
    title: '应收文档资料',
    key: 'name',
    dataIndex: 'name',
    width: 250,
    ellipsis: true,
    resizable: true
  },
  {
    title: '技术标准',
    key: 'skillStandards',
    dataIndex: 'standared',
    width: 120,
    ellipsis: true,
    resizable: true
  },
  {
    title: '数据类型',
    key: 'dataType',
    dataIndex: 'dataType',
    width: 120
  },
  {
    title: '资料类型',
    key: 'materialType',
    dataIndex: 'materialType',
    width: 120,
    resizable: true
  },
  {
    title: '数量',
    key: 'sl',
    dataIndex: 'sl',
    width: 120
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    width: 140
  },
  {
    title: '状态',
    key: 'stauts',
    dataIndex: 'stauts',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 120
  }
];

export const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '文档资料名称不能为空', trigger: 'change' }
  ]
};

export interface DataVo extends XmxxDataStandardsRelVO {

}
