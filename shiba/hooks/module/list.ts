import { reactive, ref } from "vue";
import { onLoad, onReachBottom, onPullDownRefresh } from "@dcloudio/uni-app";
import request from "@/shiba/api/request";
import { Data, LastPage } from "@/shiba/api/request.d";

// 定义选项类型
type Option = {
  params?: Record<string, any> | (() => Record<string, any>); // 额外请求参数，可以是对象或返回对象的函数
  success?: () => void; // 请求成功回调
  fail?: () => void; // 请求失败回调
  finally?: () => void; // 请求完成回调（无论成功或失败）
  manual?: boolean; // 是否手动控制，为 true 时不会自动调用接口
};

// 定义分页状态类型
type PageState = {
  page: number; // 当前页码
  limit: number; // 每页请求数量
};

// 定义API响应数据结构类型 (假设的结构，根据实际调整)
type ResponseData<T> = {
  total: number; // 数据总条数
  data: T[]; // 当前页的数据列表
  last_page: number; // 最后一页的页码
  current_page: number; // 当前页码 (API返回)
  per_page: number; // 每页数量 (API返回)
};

/**
 * 自定义 Hook: 用于获取和管理分页列表数据。
 * @param fun - 发起API请求的异步函数，接收参数对象，返回Promise<Data<LastPage<T>>>。
 * @param option - 配置选项，包含额外参数和回调函数。
 * @param isInternalPage - 是否由Hook内部处理触底加载逻辑，默认为 true。
 * @returns 返回包含列表数据、状态和操作方法的对象。
 */
export const useGetList = <T extends any[]>( // T 泛型约束为数组类型
  fun: (params: Record<string, any>) => Promise<Data<LastPage<T>>>, // API请求函数类型
  option: Option, // 配置选项
  isInternalPage: boolean = true // 是否内部处理分页逻辑
) => {
  // 分页状态参数
  const pageState = reactive<PageState>({
    page: 1, // 初始化当前页码为 1
    limit: 10, // 初始化每页条数为 10
  });

  // 数据总数
  const TotalData = ref<number>(0);

  // 列表数据
  const DataList = ref<T[]>([]); // 使用 ref 包装空数组，并指定泛型 T

  // 是否正在请求中
  const isLoading = ref<boolean>(false);

  // 是否所有数据已加载完毕
  const isComplete = ref<boolean>(false);

  // 服务器时间
  const time = ref<number>(0);
  // 获取数据的核心函数
  const GetData = async () => {
    // 如果正在加载中或已加载完毕，则直接返回，避免重复请求
    if (isLoading.value || isComplete.value) return;

    isLoading.value = true; // 设置为加载中状态
    uni.showLoading({ title: "加载中..." }); // 显示全局加载提示

    try {
      // 处理params参数，支持函数形式
      const extraParams = typeof option?.params === "function" ? option.params() : option?.params;

      // 合并基础分页参数和传入的额外参数
      const queryParams = { ...pageState, ...extraParams };
      // 调用传入的 API 请求函数
      const res = await fun(queryParams);
      time.value = res.time;
      // 如果请求成功 (根据实际项目调整成功判断条件，这里假设 res.code === 1)
      // if (res.code === 1) { // 示例：如果需要判断 code
      option?.success?.(); // 执行成功回调
      TotalData.value = res.data.total; // 更新总数据条数

      // 将新获取的数据追加到列表中
      res.data.data.forEach((item) => {
        // 使用 forEach 或其他遍历方式
        DataList.value.push(item);
      });

      // 检查是否所有数据都已加载
      if (DataList.value.length >= TotalData.value) {
        isComplete.value = true; // 标记为加载完毕
      }

      // 如果尚未加载完毕，页码加 1，为下次请求准备
      if (!isComplete.value) {
        pageState.page++;
      }
      // } else {
      //   // 处理请求失败或业务错误的情况
      //   option?.fail?.();
      //   uni.showToast({ icon: "error", title: res.msg || "请求失败" });
      // }
    } catch (e) {
      // 处理网络请求等异常
      console.error("useGetList GetData Error:", e);
      option?.fail?.(); // 执行失败回调
      // uni.showToast({ icon: "error", title: "网络错误" }); // 显示错误提示
    } finally {
      // 无论成功、失败或异常，最终都会执行
      uni.hideLoading(); // 隐藏加载提示
      isLoading.value = false; // 重置加载中状态
      option?.finally?.(); // 执行最终回调
    }
  };

  // 重置列表状态并重新加载数据
  const reset = () => {
    pageState.page = 1; // 重置页码为 1
    DataList.value = []; // 清空列表数据
    TotalData.value = 0; // 重置总数
    isComplete.value = false; // 重置加载完成状态
    isLoading.value = false; // 重置加载中状态
    GetData();
  };

  // uni-app 页面触底事件处理
  onReachBottom(() => {
    // 如果配置为外部处理分页，则不执行内部逻辑
    if (!isInternalPage) return;

    // 如果已加载完毕，显示提示
    if (isComplete.value) {
      uni.showToast({
        icon: "none",
        title: "没有更多数据了",
      });
    } else {
      // 否则，获取下一页数据
      GetData();
    }
  });

  // uni-app 页面下拉刷新事件处理
  onPullDownRefresh(() => {
    reset(); // 调用重置方法
    if (!option.manual) {
      GetData(); // 如果不是手动模式，则自动获取数据
    }
    // 停止下拉刷新动画
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  });

  // uni-app 页面加载完成事件处理
  onLoad(() => {
    // 只有在非手动模式下才自动获取数据
    if (!option?.manual) {
      GetData();
    }
  });

  // 返回状态和方法供组件使用
  return {
    time,
    reset, // 重置函数
    GetData, // 重命名为
    TotalData, // 总数据条数 (ref)
    DataList, // 列表数据 (ref)
    isComplete, // 是否加载完毕 (ref)
    isLoading, // 是否正在加载 (ref)
    pageState, // 分页状态 (reactive)
  };
};
