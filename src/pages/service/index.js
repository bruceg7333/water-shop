const i18n = require('../../utils/i18n/index');

const createPage = function(pageConfig) {
  const originalOnLoad = pageConfig.onLoad;
  const originalData = pageConfig.data || {};

  // 简化数据注入
  pageConfig.data = {
    ...originalData
  };

  // 简化onLoad函数
  pageConfig.onLoad = function(options) {
    this.i18n = i18n;
    
    // 设置导航栏标题为国际化文本
    wx.setNavigationBarTitle({
      title: i18n.t('page.service')
    });
    
    // 初始化FAQ数据
    this.initFaqList();
    
    // 直接设置所有文本，避免模板中的函数调用
    this.setData({
      titleText: i18n.t('service.title'),
      subtitleText: i18n.t('service.subtitle'),
      contactTitleText: i18n.t('service.contactTitle'),
      phoneTitle: i18n.t('service.phone.title'),
      phoneNumber: i18n.t('service.phone.number'),
      chatTitle: i18n.t('service.chat.title'),
      chatDesc: i18n.t('service.chat.desc'),
      wechatTitle: i18n.t('service.wechat.title'),
      wechatDesc: i18n.t('service.wechat.desc'),
      faqTitleText: i18n.t('service.faqTitle')
    });
    
    // 执行原始onLoad
    if (originalOnLoad) {
      originalOnLoad.call(this, options);
    }
  };
  return Page(pageConfig);
};

createPage({
  data: {
    faqList: [],
    // 默认文本
    titleText: '客服中心',
    subtitleText: '9:00-18:00 | 周一至周日',
    contactTitleText: '联系方式',
    phoneTitle: '客服电话',
    phoneNumber: '400-888-8888',
    chatTitle: '在线客服',
    chatDesc: '点击开始对话',
    wechatTitle: '微信客服',
    wechatDesc: '点击进入微信客服会话',
    faqTitleText: '常见问题'
  },
  
  initFaqList: function() {
    const faqList = [
      {
        question: this.i18n.t('service.faq.address.question'),
        answer: this.i18n.t('service.faq.address.answer'),
        isExpanded: false
      },
      {
        question: this.i18n.t('service.faq.shipping.question'),
        answer: this.i18n.t('service.faq.shipping.answer'),
        isExpanded: false
      },
      {
        question: this.i18n.t('service.faq.refund.question'),
        answer: this.i18n.t('service.faq.refund.answer'),
        isExpanded: false
      },
      {
        question: this.i18n.t('service.faq.coupon.question'),
        answer: this.i18n.t('service.faq.coupon.answer'),
        isExpanded: false
      },
      {
        question: this.i18n.t('service.faq.points.question'),
        answer: this.i18n.t('service.faq.points.answer'),
        isExpanded: false
      }
    ];
    
    this.setData({
      faqList: faqList
    });
  },
  
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: '4008888888',
      success: () => {
        console.log('拨打电话成功');
      },
      fail: (err) => {
        console.error('拨打电话失败:', err);
      }
    });
  },
  
  startChat: function() {
    wx.navigateTo({
      url: '/pages/service/chat'
    });
  },
  
  toggleFaq: function(e) {
    const index = e.currentTarget.dataset.index;
    const expandedStatus = `faqList[${index}].isExpanded`;
    
    this.setData({
      [expandedStatus]: !this.data.faqList[index].isExpanded
    });
  }
}) 