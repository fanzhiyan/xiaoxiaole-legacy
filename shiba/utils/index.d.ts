export interface utilsType {
   // 深度克隆函数的接口
   declare function deepClone<T>(obj: T, hash?: WeakMap<any, any>): T;
   
   // 获取云存储URL函数的接口
   declare function oss(url: string): string;
   
   // 打开地图导航函数的接口
   declare function openMapLocation(latitude: number, longitude: number): void;
   
   // 预览图片函数的接口
   declare function previewImages(urls: string | string[]): void;
   
   // 格式化时间函数的接口
   declare function formatTime(dateTime?: number | string, formatStr?: string): string;
   
   // 显示提示信息函数的接口
   declare function showToast(message: string): void;
   
   // 判断是否为对象函数的接口
   declare function isObject(obj: any): boolean;
   
   // 深度合并多个对象函数的接口
   declare function deepMerge(target: any, ...sources: any[]): any;
   
   // 显示提示信息函数的另一种定义方式
   declare function toast(title: string): void;
   
   // 查看协议函数的接口
   declare function ViewProtocol(title: string, id: number): void;
   
   // 构建查询字符串函数的接口
   declare function buildQueryString(params: { [key: string]: any | any[] }): string;

}

