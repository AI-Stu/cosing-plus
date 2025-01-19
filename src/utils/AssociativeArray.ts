/**
 * TODO 自定义密钥-值对的集合
 * @author Cesium
 * @date
 */
function defined(value: string | number | undefined) {
  return value !== undefined && value !== null;
}

/**
 * 密钥-值对的集合，存储为哈希，以便于查找，而且还提供了用于快速迭代的数组。
 * @alias AssociativeArray
 * @constructor
 */
export default class AssociativeArray {
  private _array: Array<any>;
  private _hash: Record<string | number, any>;

  constructor() {
    this._array = [];
    this._hash = {};
  }

  /**
   * 获取集合中的长度
   * @memberof AssociativeArray.prototype
   * @type {number}
   */
  get length() {
    return this._array.length;
  }

  /**
   * 获取集合数组，不可修改
   * @memberof AssociativeArray.prototype
   * @type {Array}
   */
  get values() {
    return this._array;
  }

  /**
   * 获取集合数组，不可修改
   * @memberof AssociativeArray.prototype
   * @type {Array}
   */
  get keys() {
    return Object.keys(this._hash);
  }

  /**
   * 数组是否包含key
   * @param {string | number} key
   * @returns {boolean} 存在 true 否则 false
   */
  contains(key: string | number): boolean {
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw console.error('键必须是字符串或数字！');
    }
    return defined(this._hash[key]);
  }

  /**
   * 将提供的 key与 value相关联。
   * 如果 key已经存在时，将被覆盖
   *
   * @param {string | number} key
   * @param {*} value
   */
  set(key: string | number, value: any) {
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw console.error('键必须是字符串或数字！');
    }

    const oldValue = this._hash[key];
    if (value !== oldValue) {
      this.remove(key);
      this._hash[key] = value;
      this._array.push(value);
    }
  }

  /**
   * 根据 key 获取 value
   *
   * @param {string | number} key
   * @returns {*} value
   */
  get(key: string | number): any {
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw console.error('键必须是字符串或数字！');
    }
    return this._hash[key];
  }

  /**
   * 数组交换位置
   * @param {number | string} index1
   * @param {number | string} index2
   */
  swapArr(index1: number | string, index2: number | string) {
    if (typeof index1 === 'number' && typeof index2 === 'number') {
      if (index1 >= this._array.length || index2 >= this._array.length) {
        console.error('索引超出');
      }
      else {
        this._array.splice(index1, 1, this._array.splice(index2, 1, this._array[index1])[0])[0];
      }
    }
    else {
      console.error('参数错误');
    }
  }

  /**
   * 从集合中删除键值对
   *
   * @param {any} key
   * @returns {boolean} 是否删除
   */
  remove(key: any): boolean {
    if (defined(key) && typeof key !== 'string' && typeof key !== 'number') {
      throw console.error('键必须是字符串或数字！');
    }

    const value = this._hash[key];
    const hasValue = defined(value);
    if (hasValue) {
      const array = this._array;
      array.splice(array.indexOf(value), 1);
      delete this._hash[key];
    }
    return hasValue;
  }

  /**
   * 删除索引及以后
   * @param index
   * @param isContains 是否删除下标元素
   */
  removeSplice(index: number, primaryKey = 'id', isContains = true) {
    if (index < 0) {
      throw console.error('下标必须是数字且大于-1！');
    }

    // 不删除下标元素
    !isContains && index++;

    if (index === 0) {
      this.removeAll();
      return true;
    }

    const array = this._array;
    const hasValue = defined(array[index]);
    if (hasValue) {
      array.splice(index, array.length - index);
      this._hash = array.reduce((hash, item) => {
        hash[item[primaryKey]] = item;
        return hash;
      }, {});
    }
    return hasValue;
  }

  /**
   * 清空集合
   */
  removeAll() {
    const array = this._array;
    if (array.length > 0) {
      this._hash = {};
      array.length = 0;
    }
  }
}
