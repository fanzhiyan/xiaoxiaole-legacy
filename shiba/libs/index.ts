import config from "@/shiba/config/config";
const { VUE_BASE_IMAGE_Url } = config;

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
 * @description 获取云存储URL
 * @param {string} url - 原始URL
 * @returns {string} 处理后的URL
 */
function oss(url: string): string {
  const base64SVGRegex = /^data:image\/svg\+xml;base64,([A-Za-z0-9+/]+={0,2})$/;
  if (base64SVGRegex.test(url)) {
    return url;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  if (!url) {
    return "/static/logo.png";
  }
  return config.VUE_BASE_IMAGE_Url + url;
}

/**
 * @description 打开地图导航
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 */
function openMapLocation(latitude: number, longitude: number): void {
  uni.openLocation({
    latitude: latitude * 1,
    longitude: longitude * 1,
  });
}

/**
 * @description 预览图片
 * @param {string | string[]} urls - 图片URL或URL数组
 */
function previewImages(urls: string | string[],current=0): void {
  const urlList = Array.isArray(urls) ? urls : [urls];
  const ossUrl = urlList.map(ee=>oss(ee))
  uni.previewImage({
    current: current||0,
    urls: ossUrl,
  });
}

/**
 * @description 格式化时间
 * @param {number | string} [dateTime=0] - 时间戳或时间字符串
 * @param {string} [formatStr='yyyy-mm-dd'] - 格式化字符串
 * @returns {string} 格式化后的时间字符串
 */
const formatTime = (dateTime = 0, formatStr = "yyyy-mm-dd"): string => {
  let date;
  if (/^\d{10}$/.test(dateTime.toString().trim())) {
    date = new Date(dateTime * 1000);
  } else if (typeof dateTime === "string" && /^\d+$/.test(dateTime.trim())) {
    date = new Date(Number(dateTime));
  } else {
    date = new Date(typeof dateTime === "string" ? dateTime.replace(/-/g, "/") : dateTime);
  }

  const timeSource = {
    y: date.getFullYear().toString(),
    m: (date.getMonth() + 1).toString().padStart(2, "0"),
    d: date.getDate().toString().padStart(2, "0"),
    h: date.getHours().toString().padStart(2, "0"),
    M: date.getMinutes().toString().padStart(2, "0"),
    s: date.getSeconds().toString().padStart(2, "0"),
  };

  for (const key in timeSource) {
    const [ret] = new RegExp(`${key}+`).exec(formatStr) || [];
    if (ret) {
      const beginIndex = key === "y" && ret.length === 2 ? 2 : 0;
      formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex));
    }
  }
  return formatStr;
};

/**
 * @description 显示提示信息
 * @param {string} message - 提示信息
 */
const showToast = (message: string): void => {
  uni.showToast({
    icon: "none",
    title: message,
  });
};

/**
 * @description 判断是否为对象
 * @param obj - 要判断的变量
 * @returns {boolean} 是否为对象
 */
function isObject(obj: any): boolean {
  return obj && typeof obj === "object" && !Array.isArray(obj);
}

/**
 * @description 深度合并多个对象
 * @param target - 目标对象
 * @param sources - 源对象
 * @returns {object} 合并后的对象
 */
function deepMerge(target: any, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * @description 显示提示信息
 * @param {string} title - 提示信息
 */
function toast(title: string): void {
  uni.showToast({
    icon: "none",
    title,
  });
}
/**
 * @description 查看协议
 * @param {string} title - 提示信息
 * @param {string} id -  类型
 */
function ViewProtocol(title: string, id: number): void {
  uni.navigateTo({
    url: `/pages/setting/agreement?title=${title}&id=${id}`,
  });
}
// 解决get 传递数组问题
const buildQueryString = (params: { [key: string]: any }): string => {
  return Object.keys(params)
    .map((key) => {
      if (Array.isArray(params[key])) {
        return params[key].map((value) => `${encodeURIComponent(key)}[]=${encodeURIComponent(value)}`).join("&");
      } else {
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
      }
    })
    .join("&");
};
/**
 * 小程序跳转到公众号文章（引导关注）
 * @param {string} biz - 公众号的原始ID（如：MzAxxxxxx）
 */
function ToWeChatFollowByArticle(username: string) {
  if (typeof wx !== "undefined" && wx.openOfficialAccountProfile) {
    wx.openOfficialAccountProfile({
      username,
      success(res) {},
      fail(err) {
        console.log(err, "errerrerrerrerrerr");
        // 跳转失败，可做降级处理
        uni.showToast({
          icon: "none",
          title: "跳转失败，请稍后重试",
        });
      },
    });
  } else {
    uni.showToast({
      icon: "none",
      title: "当前环境不支持跳转公众号",
    });
  }
}

function copy(data: string) {
  uni.setClipboardData({
    data,
    success: function () {
      uni.showToast({
        title: "已复制内容",
      });
    },
  });
}

export { ToWeChatFollowByArticle, copy, buildQueryString, ViewProtocol, toast, deepClone, oss, openMapLocation, previewImages, formatTime, showToast, deepMerge };
