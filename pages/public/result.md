# Result 结果页面使用文档

## 组件说明
`result.vue` 是一个简洁的结果页面组件，用于展示操作的结果状态。支持成功/失败状态、支付信息展示等场景。

## 参数说明

### 基础参数
| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|--------|------|------|------|--------|
| success | boolean | 否 | 是否成功 | true |
| title | string | 否 | 主标题 | 根据 success 显示"操作成功"或"操作失败" |
| pageTitle | string | 否 | 导航栏标题 | 同 title |
| failReason | string | 否 | 失败原因 | - |

### 支付相关参数
| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|--------|------|------|------|--------|
| showPay | boolean | 否 | 是否显示支付信息 | false |
| payType | string | 否 | 支付方式 | '微信支付' |
| payTime | string | 否 | 支付时间 | 当前时间 |

### 按钮控制参数
| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|--------|------|------|------|--------|
| showBack | boolean | 否 | 是否显示返回按钮 | true |
| showHome | boolean | 否 | 是否显示首页按钮 | true |

## 使用示例

### 1. 基础成功提示
```typescript
uni.$u.route({
  url: '/pages/public/result',
  params: {
    title: '发布成功'
  }
});
```

### 2. 基础失败提示
```typescript
uni.$u.route({
  url: '/pages/public/result',
  params: {
    success: false,
    title: '发布失败',
    failReason: '网络连接超时，请稍后重试'
  }
});
```

### 3. 支付成功
```typescript
uni.$u.route({
  url: '/pages/public/result',
  params: {
    title: '支付成功',
    showPay: true,
    payType: '微信支付',
    payTime: '2024-03-21 16:45'
  }
});
```

### 4. 支付失败
```typescript
uni.$u.route({
  url: '/pages/public/result',
  params: {
    success: false,
    title: '支付失败',
    failReason: '余额不足',
    showPay: true,
    payType: '微信支付'
  }
});
```

### 5. 只显示返回按钮
```typescript
uni.$u.route({
  url: '/pages/public/result',
  params: {
    title: '提交成功',
    showHome: false
  }
});
```

### 6. 只显示首页按钮
```typescript
uni.$u.route({
  url: '/pages/public/result',
  params: {
    title: '注销成功',
    showBack: false
  }
});
```

### 7. 自定义导航栏标题
```typescript
uni.$u.route({
  url: '/pages/public/result',
  params: {
    title: '实名认证成功',
    pageTitle: '认证结果'
  }
});
```

## 注意事项

1. 所有参数都是可选的，组件会提供合理的默认值
2. 成功/失败状态会影响图标显示（success.gif/error.gif）
3. 支付信息需要设置 `showPay: true` 才会显示
4. 时间格式建议：`YYYY-MM-DD HH:mm`
5. 失败状态下建议提供 `failReason` 说明原因
6. 按钮默认都显示，可以通过 `showBack` 和 `showHome` 控制

## 样式说明

1. 页面采用白色背景
2. 图标固定尺寸 140rpx × 140rpx
3. 支付信息采用浅灰背景卡片样式
4. 按钮采用主题蓝色 (#1673fe)
5. 失败原因采用灰色字体显示
6. 响应式布局，适配各种屏幕尺寸

## 图标说明

组件使用以下图标（需要在 `/static/public/` 目录下存在）：
- success.gif - 成功图标
- error.gif - 失败图标 