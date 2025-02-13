import type { TreeProps } from 'ant-design-vue';
import type { DataNode, EventDataNode } from 'ant-design-vue/es/tree';
import { Tree } from 'ant-design-vue';
import { assign } from 'lodash-es';

const { TreeNode } = Tree;
/**
 * 表格选择框扩展类型
 */
export interface TreeRowSelectionsProps {
  /**
   * 选择行
   */
  selectedRows: any[]
  /**
   * 选择行key
   */
  selectedRowKeys: any[]
}

/**
 * 表格查询配置
 */
export interface TreeQueryOptions<D = any> {
  /**
   *查询接口
   */
  queryApi: (params?: any) => Promise<any>

  /**
   * 自定义字段
   */
  fieldNames: TreeProps['fieldNames']

  /**
   * 是否加载中
   */
  loading: boolean
  /**
   * 数据源
   */
  dataSource: D[]

  /**
   * 默认选中
   */
  defaultSelectedKeys: (string | number)[]
  /**
   * 查询参数
   */
  queryParams: Record<string, any>

  /**
   * 已加载的节点
   */
  loadedKeys: (string | number)[]
  /**
   * 选择的key
   */
  rowSelections: TreeRowSelectionsProps
  /**
   * 展开的key
   */
  expandedKeys: (string | number)[]
  /**
   * 挂载时进行查询
   */
  queryOnMounted: boolean

  /**
   * 是否展开
   */
  expand: boolean
  /**
   * 构建时规则
   */
  buildfilter: (item: any) => any

  /**
   * 构建时规则
   */
  loadData: TreeProps['loadData']

  /**
   * node前回调
   */
  beforeQueryNode: (data: DataNode) => object

  /**
   * 展开变化
   */
  expandChange: () => void
  /**
   * 查询前回调
   */
  beforeQuery: () => void | Promise<void>
  /**
   * 查询后回调
   */
  afterQuery: (data: any) => any | Promise<any>
}

export function useTreeQuery(_options: Partial<TreeQueryOptions>) {
  const state = reactive<TreeQueryOptions>(assign({
    queryApi: () => Promise.resolve(),
    fieldNames: {
      children: 'children',
      title: 'label',
      key: 'id'
    },
    loading: false,
    dataSource: [],
    queryParams: {},
    defaultSelectedKeys: [],
    loadedKeys: [],
    expandedKeys: [],
    rowSelections: assign({
      selectedRowKeys: [],
      selectedRows: [],
      onChange(selectedRowKeys: any[], selectedRows: any[]) {
        state.rowSelections.selectedRowKeys = selectedRowKeys;
        state.rowSelections.selectedRows = selectedRows;
      }
    } as TreeRowSelectionsProps, _options.rowSelections),
    queryOnMounted: true,
    expand: false,
    loadData: async (treeNode: EventDataNode) => {
      if (!treeNode.dataRef || treeNode.dataRef.children) {
        return Promise.resolve();
      }

      const _queryParams = state.beforeQueryNode(treeNode.dataRef);
      const { rows } = await state.queryApi({
        ..._queryParams
      }).catch(() => {
        return Promise.resolve();
      });

      if (rows) {
        const _data = state.afterQuery(rows);
        treeNode.dataRef.children = _data ?? [];
      }
      state.expandedKeys.push(treeNode.dataRef.key);
      state.loadedKeys.push(treeNode.dataRef.key);
      state.dataSource = [...state.dataSource];
      return Promise.resolve();
    },
    beforeQueryNode() {},
    buildfilter() {},
    expandChange() {
      state.expand = !state.expand;
    },
    beforeQuery() {},
    afterQuery(data: []) {
      return data;
    }
  }, _options));

  /**
   * 树转成一维数组
   * @param data []
   */
  function buildList(data: any) {
    const _listData: any[] = [];
    if (!data)
      return;
    function handle(data: any) {
      for (let i = 0; i < data.length; i++) {
        const node = state.buildfilter ? state.buildfilter(data[i]) : data[i];
        _listData.push(node);
        if (node.children) {
          handle(node.children);
        }
      }
    }
    handle(data);
    return _listData;
  }

  /**
   * 一维数组转成树
   * @param data []
   */
  function buildTree(data: [], key = 'id', parentKey = 'pid') {
    if (!data)
      return;
    const _treeData = [] as any;
    const map = {} as Record<string, any>;

    // 创建一个映射，每个节点以 id 为键
    data.forEach((item: any) => {
      map[item[key]] = state.buildfilter ? state.buildfilter(item) : { ...item, children: [] };
    });

    data.forEach((item: any) => {
      if (item[parentKey] === null) {
        _treeData.push(map[item[key]]);
      }
      else {
        map[item[parentKey]].children.push(map[item[key]]);
      }
    });

    return _treeData;
  }

  // 查询方法
  async function query() {
    if (state.loading)
      return;
    state.loading = true;

    try {
      await state.beforeQuery();
      const { rows } = await state.queryApi({
        ...state.queryParams
      });

      if (rows) {
        const _data = await state.afterQuery(rows);
        state.dataSource = _data ?? [];
      }
    }
    catch (e: any) {
      throw new Error(`Query Failed: ${e?.msg || e}`);
    }
    finally {
      state.loading = false;
    }
  }

  // 重置方法
  function resetQuery() {
    state.queryParams = {};
    query();
  }

  // 初始化查询
  async function initQuery() {
    state.dataSource = [];
    state.loadedKeys = [];
    state.expandedKeys = [];
    await query().catch((err) => {
      return Promise.reject(err);
    });
    state.defaultSelectedKeys = [state.dataSource[0].key];
    state.rowSelections.selectedRowKeys = [state.dataSource[0].key];
  }

  // 新增子节点
  const addNode = async (key: string | number, data: any) => {
    const nodeData = await state.afterQuery(data);

    function addNodeRecursively(nodes: any[]): any[] {
      return nodes.map((node: any) => {
        if (node.key === key) {
          return {
            ...node,
            children: [
              ...node.children,
              nodeData
            ]
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addNodeRecursively(node.children)
          };
        }
        return node;
      });
    };

    return addNodeRecursively(state.dataSource);
  };

  return {
    resetQuery,
    initQuery,
    addNode,
    buildList,
    buildTree,
    state
  };
}
