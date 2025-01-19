import type { Rule } from 'ant-design-vue/es/form';
import type { DataStorageForm } from '@/api/projectarchive/dataStorage/types';
import { addDataStorageApi, delDataStorageApi, getDataStorageApi, listDataStorageApi, updateDataStorageApi } from '@/api/projectarchive/dataStorage';

export const AccessKey = {
  ADD: 'projectarchive:dataStorage:add',
  DEL: 'projectarchive:dataStorage:remove',
  EDIT: 'projectarchive:dataStorage:edit',
  EXPORT: 'projectarchive:dataStorage:export'
};

export const Api = {
  ADD_API: addDataStorageApi,
  GET_API: getDataStorageApi,
  DEL_API: delDataStorageApi,
  UPDATE_API: updateDataStorageApi,
  LIST_API: listDataStorageApi
};

// 表格列
export const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    hide: true,
    width: 100
  },
  {
    title: '文件名',
    dataIndex: 'name',
    resizable: true,
    width: 350,
    ellipsis: true
  },
  {
    title: '类型',
    dataIndex: 'fileType',
    resizable: true,
    width: 140
  },
  {
    title: '文件路径',
    dataIndex: 'filePath',
    resizable: true,
    ellipsis: true,
    width: 100
  },
  {
    title: '父目录id',
    dataIndex: 'pid',
    resizable: true,
    hide: true,
    width: 140
  },
  {
    title: '是否文件',
    dataIndex: 'isfile',
    resizable: true,
    width: 100,
    hide: true
  },

  {
    title: '大小',
    dataIndex: 'fileSize',
    resizable: true,
    width: 100
  },

  {
    title: '文件后缀',
    dataIndex: 'fileSuffix',
    resizable: true,
    hide: true,
    width: 100
  },
  {
    title: '是否关联项目',
    dataIndex: 'isrelxm',
    resizable: true,
    width: 140
  },
  {
    title: '是否发布服务',
    dataIndex: 'ispublish',
    resizable: true,
    width: 100
  },
  {
    title: '顺序',
    dataIndex: 'orderindex',
    resizable: true,
    hide: true,
    width: 100
  },
  {
    title: '租户号',
    dataIndex: 'tenantId',
    resizable: true,
    hide: true,
    width: 100
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    resizable: true,
    hide: true,
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    resizable: true,
    hide: true,
    width: 100
  },
  {
    title: '更新人',
    dataIndex: 'updateBy',
    resizable: true,
    hide: true,
    width: 100
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    resizable: true,
    hide: true,
    width: 100
  }
];

export const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '文档资料名称不能为空', trigger: 'change' }
  ]
};

export interface DataVo extends DataStorageForm {
}

export const ROOT_FOLDER: DataVo = {
  name: undefined,
  pid: 0,
  filePath: '/',
  isrelxm: 0,
  isfile: 0
};
