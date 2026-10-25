import { defineStore } from 'pinia';

/**
 * 聊天状态管理 Pinia Store
 */
export const useChatStore = defineStore('chat', {
  state: () => ({
    // 连接状态
    isConnected: false,
    
    // 会话列表
    conversations: [],
    
    // 当前选中的会话ID
    currentConversationId: null,
    
    // 消息列表，按会话ID分组
    messages: {} as Record<string, any[]>,
    
    // 未读消息计数，按会话ID分组
    unreadCounts: {} as Record<string, number>,
    
    // 加载状态
    loading: false,
    
    // 用户信息
    userInfo: null,
    
    // 上次发送消息的时间戳
    lastSentTimestamp: 0
  }),

  getters: {
    /**
     * 获取当前会话
     */
    currentConversation: (state) => {
      if (!state.currentConversationId) return null;
      return state.conversations.find(conv => conv.id === state.currentConversationId);
    },

    /**
     * 获取当前会话的消息列表
     */
    currentMessages: (state) => {
      if (!state.currentConversationId) return [];
      return state.messages[state.currentConversationId] || [];
    },

    /**
     * 获取总未读消息数
     */
    totalUnreadCount: (state) => {
      return Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0);
    }
  },

  actions: {
    /**
     * 设置连接状态
     */
    setConnected(status: boolean) {
      this.isConnected = status;
    },

    /**
     * 设置当前会话
     */
    setCurrentConversation(conversationId: string | null) {
      this.currentConversationId = conversationId;
      
      // 切换会话时清除未读计数
      if (conversationId && this.unreadCounts[conversationId]) {
        this.unreadCounts[conversationId] = 0;
      }
    },

    /**
     * 添加新会话
     */
    addConversation(conversation: any) {
      // 检查会话是否已存在
      const exists = this.conversations.find(conv => conv.id === conversation.id);
      if (!exists) {
        this.conversations.push(conversation);
        // 初始化该会话的消息列表和未读计数
        if (!this.messages[conversation.id]) {
          this.messages[conversation.id] = [];
        }
        if (!this.unreadCounts[conversation.id]) {
          this.unreadCounts[conversation.id] = 0;
        }
      }
    },

    /**
     * 更新会话
     */
    updateConversation(conversationId: string, data: any) {
      const index = this.conversations.findIndex(conv => conv.id === conversationId);
      if (index !== -1) {
        this.conversations[index] = { ...this.conversations[index], ...data };
      }
    },

    /**
     * 添加消息
     */
    addMessage(message: any) {
      const conversationId = message.conversationId || this.currentConversationId;
      if (!conversationId) return;

      // 确保会话存在
      if (!this.conversations.find(conv => conv.id === conversationId)) {
        this.addConversation({ id: conversationId, name: '新会话', lastMessage: message });
      } else {
        // 更新会话的最后一条消息
        this.updateConversation(conversationId, { lastMessage: message });
      }

      // 初始化消息数组（如果不存在）
      if (!this.messages[conversationId]) {
        this.messages[conversationId] = [];
      }

      // 添加消息到数组
      this.messages[conversationId].push(message);

      // 如果不是当前会话，增加未读计数
      if (conversationId !== this.currentConversationId && !message.isSelf) {
        if (!this.unreadCounts[conversationId]) {
          this.unreadCounts[conversationId] = 0;
        }
        this.unreadCounts[conversationId]++;
      }

      // 更新最后发送时间（如果是自己发送的消息）
      if (message.isSelf) {
        this.lastSentTimestamp = message.timestamp || Date.now();
      }
    },

    /**
     * 更新消息状态
     */
    updateMessage(conversationId: string, messageId: string, status: string) {
      if (!this.messages[conversationId]) return;
      
      const index = this.messages[conversationId].findIndex(msg => msg.id === messageId);
      if (index !== -1) {
        this.messages[conversationId][index].status = status;
      }
    },

    /**
     * 清除会话消息
     */
    clearMessages(conversationId: string) {
      if (this.messages[conversationId]) {
        this.messages[conversationId] = [];
      }
    },

    /**
     * 设置用户信息
     */
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
    },

    /**
     * 重置状态
     */
    reset() {
      this.isConnected = false;
      this.conversations = [];
      this.currentConversationId = null;
      this.messages = {};
      this.unreadCounts = {};
      this.loading = false;
      this.userInfo = null;
      this.lastSentTimestamp = 0;
    }
  }
}); 