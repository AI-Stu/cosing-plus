import { delXmxxDataStandardsRelApi, listXmxxDataStandardsRelApi, saveXmxxDataStandardsListApi } from '@/api/projectarchive/xmxxDataStandardsRel';

export const Api = {
  SAVE_API: saveXmxxDataStandardsListApi,
  // ADD_API: addDataStandardsApi,
  DEL_API: delXmxxDataStandardsRelApi,
  // UPDATE_API: updateDataStandardsApi,
  LIST_API: listXmxxDataStandardsRelApi
};

// 表格列
export const columns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    customRender: ({ index }: { index: number }) => {
      return index + 1;
    },
    width: 60,
    minWidth: 60,
    maxWidth: 120,
    disabled: true
  },
  {
    title: '数据标准',
    key: 'name',
    dataIndex: 'name',
    width: 150,
    ellipsis: true,
    resizable: true
  },
  {
    title: '父级目录',
    key: 'parentPath',
    dataIndex: 'parentPath',
    width: 300,
    ellipsis: true,
    resizable: true
  },
  {
    title: '技术标准',
    key: 'skillStandards',
    dataIndex: 'skillStandards',
    width: 120,
    ellipsis: true,
    resizable: true
  },
  {
    title: '数量',
    key: 'sl',
    dataIndex: 'sl',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100
  }
];
