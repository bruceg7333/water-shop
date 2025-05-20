const i18n = require('../../utils/i18n/index');

const createPage = function(pageConfig) {
  const originalOnLoad = pageConfig.onLoad;
  const originalData = pageConfig.data || {};

  pageConfig.data = {
    ...originalData
  };

  pageConfig.onLoad = function(options) {
    this.i18n = i18n;
    
    // 设置导航栏标题为国际化文本
    wx.setNavigationBarTitle({
      title: i18n.t('page.about')
    });

    // 预渲染所有文本到data中
    this.setData({
      slogan: i18n.t('about.slogan'),
      version: i18n.t('about.version'),
      brandIntro: i18n.t('about.brandIntro'),
      brandIntroContent: i18n.t('about.brandIntroContent'),
      brandPhilosophy: i18n.t('about.brandPhilosophy'),
      brandPhilosophyContent: i18n.t('about.brandPhilosophyContent'),
      productSeries: i18n.t('about.productSeries'),
      productSeriesContent: i18n.t('about.productSeriesContent'),
      contactUs: i18n.t('about.contactUs'),
      phone: i18n.t('about.phone'),
      email: i18n.t('about.email'),
      officialStore: i18n.t('about.officialStore'),
      officialStoreName: i18n.t('about.officialStoreName'),
      userAgreement: i18n.t('about.userAgreement'),
      privacyPolicy: i18n.t('about.privacyPolicy')
    });

    if (originalOnLoad) {
      originalOnLoad.call(this, options);
    }
  };
  return Page(pageConfig);
};

createPage({
  data: {
    // 预设默认值，避免加载过程中页面空白
    slogan: '清新生活，健康饮水',
    version: '版本',
    brandIntro: '品牌介绍',
    brandIntroContent: 'SPRINKLE水站是一家专注于提供高品质饮用水的品牌...',
    brandPhilosophy: '品牌理念',
    brandPhilosophyContent: '我们秉承"健康、环保、便捷"的理念...',
    productSeries: '产品系列',
    productSeriesContent: '我们提供多种类型的饮用水产品...',
    contactUs: '联系我们',
    phone: '客服电话',
    email: '电子邮箱',
    officialStore: '官方商城',
    officialStoreName: 'SPRINKLE官方旗舰店',
    userAgreement: '用户协议',
    privacyPolicy: '隐私政策'
  },
  
  copyText: function(e) {
    const text = e.currentTarget.dataset.text;
    
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: this.i18n.t('about.copySuccess'),
          icon: 'success'
        });
      }
    });
  }
}) 