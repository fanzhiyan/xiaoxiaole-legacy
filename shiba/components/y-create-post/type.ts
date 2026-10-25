export type ActionType = 'dynamic' | 'runner'

export interface CreatePostOptions {
  // 是否需要登录
  needAuth?: boolean
  // 是否需要加入圈子
  needJoin?: boolean
  // 圈子ID
  topicId?: string | number
}

export interface CreatePostReturn {
  confirm: () => void
  cancel: () => void
}

export interface CreatePostHookReturn {
  show: (options: CreatePostOptions) => Promise<CreatePostReturn>
}

export interface CreatePostInst {
  show: (options: CreatePostOptions) => Promise<CreatePostReturn>
  hide: () => void
}

export interface CreatePostInstance {
  // 显示创建帖子弹窗
  show: (options?: CreatePostOptions) => void
  // 隐藏创建帖子弹窗
  hide: () => void
}

export interface ActionConfig {
  type: ActionType
  path: string
  needAuth?: boolean
  needJoin?: boolean
} 