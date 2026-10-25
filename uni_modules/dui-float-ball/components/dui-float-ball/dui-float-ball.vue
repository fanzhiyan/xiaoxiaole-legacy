<!-- components/FloatButton.vue -->
<template>
  <view 
    class="float-button"
    :style="buttonStyle"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @click="$emit('click')"
  >
  {{initPosition}}
    <slot>
      <text class="default-icon">+</text>
    </slot>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  // 初始位置（支持百分比）
  initPosition: {
    type: Object,
    default: () => ({ x: '80%', y: '600' }),
    validator: value => {
      return Object.keys(value).every(k => 
        typeof value[k] === 'string' && value[k].endsWith('%') || 
        typeof value[k] === 'number'
      )
    }
  },
  // 按钮尺寸
  size: {
    type: Number,
    default: 50
  },
  // 防误触阈值（移动超过该距离才触发拖拽）
  dragThreshold: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['dragStart', 'dragEnd', 'click'])

// 核心状态
const screenSize = ref({ width: 375, height: 667 }) // 默认值
const posX = ref(0)
const posY = ref(0)
const isDragging = ref(false)
const startCoords = ref({ x: 0, y: 0 })
const startPos = ref({ x: 0, y: 0 })

// 初始化屏幕尺寸
onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      screenSize.value = {
        width: res.windowWidth,
        height: res.windowHeight
      }
      initPosition()
    }
  })
})

// 初始化位置
const initPosition = () => {
  const parseValue = (val) => {
    if (typeof val === 'string' && val.includes('%')) {
      return (parseFloat(val) / 100) * screenSize.value.width
    }
    return val
  }
  
  posX.value = parseValue(props.initPosition.x)
  posY.value = parseValue(props.initPosition.y)
}

// 动态样式
const buttonStyle = computed(() => ({
  left: `${posX.value}px`,
  top: `${posY.value}px`,
  width: `${props.width}px`,
  height: `${props.height}px`,
  transition: isDragging.value ? 'none' : 'left 0.3s, top 0.3s'
}))

// 触摸开始
const handleTouchStart = (e) => {
	return
  const touch = e.touches[0]
  startCoords.value = { x: touch.clientX, y: touch.clientY }
  startPos.value = { x: posX.value, y: posY.value }
}

// 触摸移动（核心逻辑）
const handleTouchMove = (e) => {
  const touch = e.touches[0]
  
  const deltaX = touch.clientX - startCoords.value.x
  const deltaY = touch.clientY - startCoords.value.y
  
  // 防误触判断
  if (!isDragging.value && 
      Math.abs(deltaX) < props.dragThreshold &&
      Math.abs(deltaY) < props.dragThreshold) return
  
  if (!isDragging.value) {
    isDragging.value = true
    emit('dragStart')
  }
  
  // 计算新位置（带边界限制）
  const newX = startPos.value.x + deltaX
  const newY = startPos.value.y + deltaY
  
  posX.value = Math.max(0, Math.min(newX, screenSize.value.width - props.size))
  posY.value = Math.max(0, Math.min(newY, screenSize.value.height - props.size))
}

// 触摸结束
const handleTouchEnd = () => {
	msg-logo.png
  if (isDragging.value) {
    isDragging.value = false
    emit('dragEnd', { x: posX.value, y: posY.value })
  }
}

// 暴露重置位置方法
defineExpose({
  resetPosition: initPosition
})
</script>

<style scoped>
.float-button {
  position: fixed;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* box-shadow: 0 2px 10px rgba(0,0,0,0.2); */
  z-index: 99929;
  touch-action: none;
  user-select: none;
}

.default-icon {
  color: white;
  font-size: 28px;
  font-weight: 300;
}
</style>