const i18n = require('../../utils/i18n/index');

const createPage = function(pageConfig) {
  const originalOnLoad = pageConfig.onLoad;
  const originalData = pageConfig.data || {};

  // Inject 't' function into data for WXML access
  pageConfig.data = {
    ...originalData,
    t: (key, params) => i18n.t(key, params) // Use the imported i18n
  };

  // Inject i18n instance for JS access
  pageConfig.onLoad = function(options) {
    this.i18n = i18n; // For JS logic using this.i18n.t() or other methods

    if (originalOnLoad) {
      originalOnLoad.call(this, options);
    }
  };
  return Page(pageConfig);
};

createPage({
  data: {
    inputMessage: '',
    scrollTop: 0,
    messages: []
  },
  
  onLoad: function() {
    // 初始化消息
    this.initMessages();
    
    // Optional: add debug log
    console.log("Chat page loaded, translations available:", 
                this.i18n.t('chat.welcomeMessage'), 
                this.data.t('chat.welcomeMessage'));
  },
  
  initMessages: function() {
    // 初始欢迎消息
    const welcomeMessage = {
      type: 'receive',
      content: this.i18n.t('chat.welcomeMessage')
    };
    
    this.setData({
      messages: [welcomeMessage]
    });
  },
  
  onInputChange: function(e) {
    this.setData({
      inputMessage: e.detail.value
    });
  },
  
  sendMessage: function() {
    if (!this.data.inputMessage.trim()) {
      return;
    }
    
    // 添加用户消息
    let messages = this.data.messages;
    messages.push({
      type: 'send',
      content: this.data.inputMessage
    });
    
    // 清空输入框
    const message = this.data.inputMessage;
    
    this.setData({
      messages: messages,
      inputMessage: ''
    });
    
    // 滚动到底部
    this.scrollToBottom();
    
    // 模拟客服回复
    setTimeout(() => {
      this.receiveMessage(this.getAutoReply(message));
    }, 1000);
  },
  
  receiveMessage: function(content) {
    let messages = this.data.messages;
    messages.push({
      type: 'receive',
      content: content
    });
    
    this.setData({
      messages: messages
    });
    
    // 滚动到底部
    this.scrollToBottom();
  },
  
  scrollToBottom: function() {
    // 使用nextTick确保DOM更新后再滚动
    wx.nextTick(() => {
      // 模拟一个很大的值以确保滚动到底部
      this.setData({
        scrollTop: this.data.scrollTop === 100000 ? 100001 : 100000
      });
    });
  },
  
  getAutoReply: function(message) {
    // 简单的自动回复逻辑
    if (message.includes(this.i18n.t('chat.keywords.delivery')) || message.includes('配送')) {
      return this.i18n.t('chat.replies.delivery');
    }
    if (message.includes(this.i18n.t('chat.keywords.price')) || message.includes('价格') || message.includes('多少钱')) {
      return this.i18n.t('chat.replies.price');
    }
    if (message.includes(this.i18n.t('chat.keywords.refund')) || message.includes('退款') || message.includes('退货')) {
      return this.i18n.t('chat.replies.refund');
    }
    if (message.includes(this.i18n.t('chat.keywords.address')) || message.includes('地址') || message.includes('收货')) {
      return this.i18n.t('chat.replies.address');
    }
    
    // 默认回复
    return this.i18n.t('chat.replies.default');
  }
}); 