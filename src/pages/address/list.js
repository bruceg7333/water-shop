// 引入登录验证工具
const { checkLogin } = require('../../utils/auth');
// 使用request.js
const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');

// 定义页面配置
const pageConfig = {
  data: {
    addresses: [], // 初始化为空数组，不再包含默认数据
    from: '', // 来源页面
    i18n: {} // 国际化文本
  },
  
  onLoad: function(options) {
    console.log("地址列表页onLoad接收到参数:", options);
    
    if (options && options.from) {
      this.setData({
        from: options.from
      });
    }
    
    // 初始化国际化文本
    this.updateI18nText();
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 检查用户是否已登录
    if (!checkLogin()) {
      return; // 未登录，已跳转到登录页
    }
    
    // 用户已登录，继续加载数据
    this.loadAddresses();
  },
  
  /**
   * 加载地址列表
   */
  loadAddresses() {
    // 显示加载提示
    wx.showLoading({
      title: this.t('common.loading')
    });
    
    // 调用API获取地址列表
    api.getAddresses()
      .then(res => {
        wx.hideLoading();
        console.log('api.getAddresses 原始响应:', JSON.stringify(res)); // 打印原始响应
        
        if (res.success && Array.isArray(res.data)) {
          // API成功返回，更新地址列表
          this.setData({
            addresses: res.data // 直接使用 res.data
          });
        } else {
          // API调用成功但未返回有效数据或返回失败
          console.error('获取地址列表失败:', res.message || '无有效地址数据');
          this.setData({
            addresses: [] // 确保地址列表为空
          });
          wx.showToast({
            title: this.t('address.loadFailed') || '加载地址失败',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('获取地址列表API调用失败:', err);
        this.setData({
          addresses: [] // 确保地址列表为空
        });
        wx.showToast({
          title: this.t('common.networkError') || '网络错误，请重试',
          icon: 'none'
        });
      });
  },
  
  selectAddress: function(e) {
    console.log("选择地址，来源:", this.data.from);
    const address = e.currentTarget.dataset.address;
    
    // 如果是从订单确认页面跳转过来，选择后返回
    if (this.data.from === 'checkout') {
      // 使用本地存储传递选中的地址
      wx.setStorageSync('selectedAddress', address);
      wx.navigateBack();
    }
  },
  
  setDefault: function(e) {
    const index = e.currentTarget.dataset.index;
    const addressId = this.data.addresses[index]._id;
    
    // 如果已经是默认地址，不执行任何操作
    if (this.data.addresses[index].isDefault) {
      return;
    }
    
    wx.showLoading({
      title: this.t('common.loading')
    });
    
    // 调用API设置默认地址
    api.setDefaultAddress(addressId)
      .then(res => {
        wx.hideLoading();
        if (res.success) {
          // 更新本地数据，确保只有一个默认地址
          let addresses = this.data.addresses;
          addresses.forEach(item => {
            item.isDefault = (item._id === addressId);
          });
          
          this.setData({
            addresses: addresses
          });
          
          wx.showToast({
            title: this.t('address.setDefaultSuccess'),
            icon: 'success'
          });
        } else {
          console.error('设置默认地址失败:', res.message);
          wx.showToast({
            title: res.message || this.t('address.setDefaultFailed'),
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('设置默认地址失败:', err);
        wx.showToast({
          title: this.t('address.setDefaultFailed') || '设置失败，请重试',
          icon: 'none'
        });
      });
  },
  
  editAddress: function(e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.addresses[index];
    
    wx.navigateTo({
      url: '/pages/address/edit?id=' + address._id
    });
  },
  
  deleteAddress: function(e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.addresses[index];
    const addressId = address._id;
    
    console.log('准备删除地址:', address); // 调试日志
    console.log('删除地址ID:', addressId); // 调试日志
    
    if (!addressId) {
      wx.showToast({
        title: '无效的地址ID',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: this.t('common.tip'),
      content: this.t('address.confirmDelete'),
      confirmText: this.t('common.confirm'),
      cancelText: this.t('common.cancel'),
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: this.t('common.loading')
          });
          
          // 调用API删除地址
          api.deleteAddress(addressId)
            .then(res => {
              wx.hideLoading();
              console.log('删除地址API响应:', res); // 完整响应
              
              // 无论API返回什么，都重新加载列表
              this.loadAddresses();
              
              wx.showToast({
                title: this.t('address.deleteSuccess'),
                icon: 'success'
              });
            })
            .catch(err => {
              wx.hideLoading();
              console.error('删除地址失败:', err);
              
              // 即使失败也重新加载列表
              this.loadAddresses();
              
              wx.showToast({
                title: this.t('address.deleteFailed') || '删除失败，请重试',
                icon: 'none'
              });
            });
        }
      }
    });
  },
  
  addAddress: function() {
    wx.navigateTo({
      url: '/pages/address/edit'
    });
  },
  
  updateI18nText() {
    // 立即设置页面标题，避免闪烁
    wx.setNavigationBarTitle({
      title: this.t('page.address')
    });
    
    this.setData({
      i18n: {
        title: this.t('page.address'), // 添加标题字段
        empty: this.t('address.empty') || '还没有添加地址',
        defaultTag: this.t('address.defaultTag'),
        setDefault: this.t('address.setDefault'),
        edit: this.t('address.edit'),
        delete: this.t('address.delete'),
        add: this.t('address.add'),
        confirm: this.t('address.confirm'),
        confirmDelete: this.t('address.confirmDelete'),
        deleteSuccess: this.t('address.deleteSuccess'),
        deleteFailed: this.t('address.deleteFailed'),
        setDefaultSuccess: this.t('address.setDefaultSuccess'),
        setDefaultFailed: this.t('address.setDefaultFailed'),
        loadFailed: this.t('address.loadFailed') || '加载地址失败'
      }
    });
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig));
