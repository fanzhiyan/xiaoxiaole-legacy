/**
 * 检查一个值是否为对象
 * @param {any} obj - 要检查的值
 * @returns {boolean} 如果值是对象且不是数组，则返回 true；否则返回 false
 */
function isObject(obj) {
  return obj && typeof obj === "object" && !Array.isArray(obj);
}

/**
 * 深度合并多个对象
 * @param {object} target - 目标对象
 * @param {...object} sources - 需要合并的源对象
 * @returns {object} 合并后的目标对象
 */
function deepMerge(target, ...sources) {
  // 如果没有更多的源对象，返回目标对象
  if (!sources.length) return target;

  // 取出第一个源对象
  const source = sources.shift();

  // 如果目标和源都是对象，则进行合并
  if (isObject(target) && isObject(source)) {
    // 遍历源对象的所有属性
    for (const key in source) {
      // 如果源对象的属性也是对象，则递归合并
      if (isObject(source[key])) {
        // 如果目标对象中没有对应的属性，则创建一个空对象
        if (!target[key]) Object.assign(target, { [key]: {} });
        // 递归合并子对象
        deepMerge(target[key], source[key]);
      } else {
        // 如果源对象的属性不是对象，则直接赋值给目标对象
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  // 递归合并剩余的源对象
  return deepMerge(target, ...sources);
}

/**
 * 检查传入的参数是否为函数
 * @param value - 要检查的值
 * @returns 如果值是函数，则返回 true；否则返回 false
 */
function isFunction(value: any): value is Function {
  return typeof value === "function";
}

/**
 * 深度克隆一个对象或数组
 * @param obj - 要克隆的对象或数组
 * @param hash - 用于处理循环引用的 WeakMap
 * @returns 克隆后的新对象或数组
 */
function deepClone<T>(obj: T, hash = new WeakMap()): T {
  // 如果 obj 是 null 或者不是对象，直接返回它（基本类型直接返回）
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 如果 hash 中已经存在这个对象，说明是循环引用，直接返回它
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 如果 obj 是数组，创建一个新的数组，并递归克隆每一个元素
  if (Array.isArray(obj)) {
    const arrCopy = [] as any[];
    // 将新数组存入 hash 中，防止循环引用
    hash.set(obj, arrCopy);
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i], hash);
    }
    return arrCopy as unknown as T;
  }

  // 如果 obj 是对象，创建一个新的对象，并递归克隆每一个属性
  const objCopy = {} as { [key: string]: any };
  // 将新对象存入 hash 中，防止循环引用
  hash.set(obj, objCopy);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key], hash);
    }
  }
  return objCopy as T;
}

/**
 * 转RPX
 * @param value - 要转换的value值
 * @returns  转换后的值
 */
function RpxPipeline(value) {
  if (typeof value === "number") {
    return value + "rpx";
  } else if (typeof value === "string") {
    if (value.includes("px") && !value.includes("rpx")) {
      return parseInt(value) / 2 + "rpx";
    } else if (value.includes("rpx")) {
      return value;
    }
  }
}

/**
 * 判断传入的值是否是某个枚举中的键
 * @param enumObj - 枚举对象
 * @param value - 要检查的值
 * @returns 如果是枚举中的键则返回 true，否则返回 false
 */
function isEnumKey<T>(enumObj: T, value: any): value is keyof T {
  return Object.keys(enumObj).includes(value);
}

/**
 * 判断传入的字符串是否是一个有效的 URL 路径或文件路径
 * @param inputString - 要检查的字符串
 * @returns 如果是有效的 URL 路径或文件路径则返回 true，否则返回 false
 */
function isURL(inputString: string): boolean {
  // 定义 URL 和路径的正则表达式模式
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // 协议 (http 或 https) (可选)
      "(([\\w.-]+)\\.[a-zA-Z]{2,6})?" + // 域名 (可选)
      "(\\:\\d{1,5})?" + // 端口号 (可选)
      "(\\/\\S*)$", // 路径 (必须)
    "i" // 忽略大小写
  );

  // 使用正则表达式匹配输入字符串
  return urlPattern.test(inputString);
}

/**
 * @description 查看协议
 * @param {string} title - 提示信息
 * @param {string} id -  类型
 */
function Protocol(title: string, id: number): void {
  uni.navigateTo({
    url: `/pages/setting/agreement?title=${title}&id=${id}`,
  });
}

export { isURL, Protocol, isEnumKey, RpxPipeline, deepClone, isFunction, deepMerge, isObject };
