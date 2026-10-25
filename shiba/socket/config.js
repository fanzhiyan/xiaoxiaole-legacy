import env from '../config/env.js';

/**
 * WebSocket配置
 */
export default {
  // WebSocket服务器地址
  wsUrl: env.websocket.url || 'ws://localhost:8080/ws',
  
  // 心跳间隔（毫秒）
  heartbeatInterval: env.websocket.heartbeatInterval || 30000,
  
  // 自动重连设置
  reconnect: {
    // 是否启用自动重连
    enabled: true,
    // 最大重连次数
    maxAttempts: 5,
    // 重连间隔（毫秒）
    interval: 3000
  },
  
  // 消息类型
  messageTypes: {
    TEXT: 'text',
    IMAGE: 'image',
    VOICE: 'voice',
    VIDEO: 'video',
    FILE: 'file',
    LOCATION: 'location',
    SYSTEM: 'system'
  }
} 