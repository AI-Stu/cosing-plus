import { isEmpty } from 'lodash';
import { getDictsApi } from '@/api/system/dict/data';

export const useDictStore = defineStore('dict', () => {
  const dict = ref<
    Array<{
      key: string
      value: DictDataOption[]
    }>
  >([]);

  /**
   * 获取字典
   * @param key 字典key
   */
  const getDictByKey = (key: string): BackNullable<DictDataOption[]> => {
    if (isEmpty(key)) {
      return null;
    }
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i]?.key === key) {
          return dict.value[i]?.value;
        }
      }
    }
    catch (e) {
      return null;
    }
    return null;
  };

  /**
   * 设置字典
   * @param key 字典key
   * @param value 字典value
   */
  const setDict = (key: string, value: DictDataOption[]) => {
    if (!isEmpty(key)) {
      dict.value.push({ key, value });
    }
  };

  /**
   * 获取多个字典
   * @param args
   * @returns 字典Map
   */
  const getDict = (...args: string[]): { [key: string]: DictDataOption[] } => {
    const res = ref<{
      [key: string]: DictDataOption[]
    }>({});
    return (() => {
      args.forEach(async (dictType) => {
        res.value[dictType] = [];
        const dicts = getDictByKey(dictType);
        if (dicts) {
          res.value[dictType] = dicts;
        }
        else {
          await getDictsApi(dictType).then((resp) => {
            if (resp.data) {
              res.value[dictType] = resp.data.map(
                (p: any): DictDataOption => ({ label: p.dictLabel, value: p.dictValue, tagType: p.listClass, tagClass: p.cssClass })
              );
            }
            setDict(dictType, res.value[dictType] || []);
          }).catch((err) => {
            console.log('获取字典数据失败', err);
          });
        }
      });
      return res.value;
    })();
  };

  /**
   * 删除字典
   * @param key
   */
  const removeDict = (key: string): boolean => {
    let bln = false;
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i]?.key === key) {
          dict.value.splice(i, 1);
          return true;
        }
      }
    }
    catch (e) {
      bln = false;
    }
    return bln;
  };

  /**
   * 清空字典
   */
  const cleanDict = (): void => {
    dict.value = [];
  };

  return {
    dict,
    getDictByKey,
    getDict,
    setDict,
    removeDict,
    cleanDict
  };
});

export default useDictStore;
