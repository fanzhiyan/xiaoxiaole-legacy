import config from './config.js';
import { formatMessage } from '../libs/index.js';

/**
 * WebSocket客户端封装类
 * 支持Vue3和Pinia集成
 */
class WebSocketClient {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.store = null;
    this.heartbeatTimer = null;
  }

  /**
   * 设置Pinia存储实例
   * @param {Object} store - Pinia store实例
   */
  setStore(store) {
    this.store = store;
  }

  /**
   * 连接WebSocket服务器
   * @param {String} url - WebSocket服务器地址
   * @param {Object} options - 连接选项
   */
  connect(url = config.wsUrl, options = {}) {
    if (this.isConnected) return;
    
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WebSocket连接已建立');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // 通知Pinia store连接状态
        if (this.store) {
          this.store.setConnected(true);
        }
        
        // 启动心跳检测
        this.startHeartbeat();
        
        // 触发连接选项中的onOpen回调
        if (options.onOpen) {
          options.onOpen();
        }
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // 处理心跳响应
          if (message.type === 'pong') {
            return;
          }
          
          // 格式化接收到的消息
          const formattedMessage = formatMessage(message);
          
          // 将消息添加到Pinia store
          if (this.store) {
            this.store.addMessage(formattedMessage);
          }
          
          // 触发消息回调
          if (options.onMessage) {
            options.onMessage(formattedMessage);
          }
        } catch (error) {
          console.error('处理消息时出错:', error);
        }
      };
      
      this.ws.onclose = (event) => {
        this.isConnected = false;
        this.stopHeartbeat();
        
        // 通知Pinia store连接状态
        if (this.store) {
          this.store.setConnected(false);
        }
        
        // 尝试重新连接
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`WebSocket连接已关闭，${this.reconnectInterval / 1000}秒后尝试重新连接...`);
          setTimeout(() => this.connect(url, options), this.reconnectInterval);
        } else {
          console.log('WebSocket连接已关闭，已达到最大重连次数');
        }
        
        // 触发关闭回调
        if (options.onClose) {
          options.onClose(event);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        
        // 触发错误回调
        if (options.onError) {
          options.onError(error);
        }
      };
    } catch (error) {
      console.error('创建WebSocket连接时出错:', error);
    }
  }

  /**
   * 断开WebSocket连接
   */
  disconnect() {
    if (this.ws && this.isConnected) {
      this.ws.close();
      this.isConnected = false;
      this.stopHeartbeat();
      
      // 通知Pinia store连接状态
      if (this.store) {
        this.store.setConnected(false);
      }
    }
  }

  /**
   * 发送消息到WebSocket服务器
   * @param {Object} data - 要发送的数据
   */
  send(data) {
    if (this.ws && this.isConnected) {
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        this.ws.send(message);
        
        // 如果是聊天消息，添加到本地消息列表
        if (data.type === 'chat' && this.store) {
          const localMessage = {
            ...data,
            isSelf: true,
            status: 'sent',
            timestamp: new Date().getTime()
          };
          this.store.addMessage(localMessage);
        }
        
        return true;
      } catch (error) {
        console.error('发送消息时出错:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * 启动心跳检测
   */
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'ping', timestamp: new Date().getTime() });
      }
    }, config.heartbeatInterval || 30000);
  }

  /**
   * 停止心跳检测
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

// 创建单例实例
const socketClient = new WebSocketClient();

export default socketClient; 