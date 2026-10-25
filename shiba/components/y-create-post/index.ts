import { ref, provide } from 'vue'
import { ActionType, CreatePostOptions, CreatePostReturn } from './type'
import { deepMerge, deepClone } from '../libs/utils'

// 默认的选项
export const defaultOptions: CreatePostOptions & { show: boolean } = {
  // 是否需要登录
  needAuth: false,
  // 是否需要加入圈子
  needJoin: false,
  // 圈子ID
  topicId: undefined,
  show: false
}

export const createPostDefaultOptionKey = 'CREATEPOST__'

export function useCreatePost(selector: string = '') {
  const createPostOption = ref<CreatePostOptions>(deepClone(defaultOptions))
  const createPostOptionKey = selector ? createPostDefaultOptionKey + selector : createPostDefaultOptionKey

  provide(createPostOptionKey, createPostOption)

  const createMethod = (type: ActionType) => {
    return (options: Partial<CreatePostOptions> | string) => {
      const createPostOptions = deepMerge({ type }, typeof options === 'string' ? { topicId: options } : options) as CreatePostOptions
      return show(createPostOptions)
    }
  }

  const show = (option: CreatePostOptions | string) => {
    return new Promise<CreatePostReturn>((resolve, reject) => {
      const options = deepMerge(defaultOptions, typeof option === 'string' ? { topicId: option } : option) as CreatePostOptions

      let obj = Object.assign(deepClone(createPostOption.value), deepClone(options), {
        show: true,
        onConfirm: (res: CreatePostReturn) => {
          resolve(res)
        },
        onCancel: (res: CreatePostReturn) => {
          reject(res)
        }
      })
      createPostOption.value = obj
    })
  }

  // 打开动态发布
  const dynamic = createMethod('dynamic')
  // 打开跑腿发布
  const runner = createMethod('runner')

  const close = () => {
    createPostOption.value = { ...defaultOptions }
  }

  return {
    show,
    dynamic,
    runner,
    close
  }
}

export type { CreatePostInst, CreatePostOptions, CreatePostReturn } 