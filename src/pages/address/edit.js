const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');
const { api } = require('../../utils/request');

// 定义页面配置
const pageConfig = {
  data: {
    addressId: null,
    isEdit: false, // 是否为编辑模式
    addressData: {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    },
    i18n: {} // 国际化文本
  },
  
  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    wx.setNavigationBarTitle({
      title: this.data.isEdit ? this.t('page.addressEdit') : this.t('page.addressAdd')
    });
    
    this.setData({
      i18n: {
        title: this.data.isEdit ? this.t('page.addressEdit') : this.t('page.addressAdd'),
        name: this.t('addressEdit.name'),
        nameHolder: this.t('addressEdit.nameHolder'),
        phone: this.t('addressEdit.phone'),
        phoneHolder: this.t('addressEdit.phoneHolder'),
        region: this.t('addressEdit.region'),
        regionHolder: this.t('addressEdit.regionHolder'),
        detail: this.t('addressEdit.detail'),
        detailHolder: this.t('addressEdit.detailHolder'),
        setDefault: this.t('addressEdit.setDefault'),
        save: this.t('addressEdit.save'),
        saving: this.t('addressEdit.saving'),
        saveSuccess: this.t('addressEdit.saveSuccess'),
        
        // 验证错误消息
        nameRequired: this.t('addressEdit.nameRequired'),
        phoneRequired: this.t('addressEdit.phoneRequired'),
        phoneInvalid: this.t('addressEdit.phoneInvalid'),
        regionRequired: this.t('addressEdit.regionRequired'),
        detailRequired: this.t('addressEdit.detailRequired')
      }
    });
  },
  
  onLoad: function(options) {
    // 判断是编辑模式还是新增模式
    const isEdit = options && options.id;
    this.setData({ isEdit: !!isEdit });
    
    // 初始化国际化文本
    this.updateI18nText();
    
    if (isEdit) {
      this.setData({
        addressId: options.id
      });
      this.loadAddressData(options.id);
    }
  },
  
  loadAddressData: function(id) {
    console.log('加载地址数据，ID:', id); // 调试日志
    
    // 显示加载提示
    wx.showLoading({
      title: this.t('common.loading')
    });
    
    // 调用API获取地址数据
    api.getAddressById(id)
      .then(res => {
        wx.hideLoading();
        console.log('获取地址数据成功:', res); // 调试日志
        if (res.success && res.data) {
          // API成功返回，更新表单数据
          this.setData({
            addressData: { ...res.data }
          });
        } else {
          // API调用成功但未返回有效数据或返回失败
          console.error('获取地址数据失败:', res.message || '无有效地址数据');
          wx.showToast({
            title: this.t('addressEdit.loadFailed') || '加载地址失败',
            icon: 'none'
          });
          // 加载失败，可以考虑清空表单或返回上一页
          // 这里选择清空表单
          this.setData({
            addressData: {
              name: '',
              phone: '',
              province: '',
              city: '',
              district: '',
              detail: '',
              isDefault: false
            }
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('获取地址数据API调用失败:', err);
        wx.showToast({
          title: this.t('common.networkError') || '网络错误，请重试',
          icon: 'none'
        });
        // 加载失败，清空表单
        this.setData({
          addressData: {
            name: '',
            phone: '',
            province: '',
            city: '',
            district: '',
            detail: '',
            isDefault: false
          }
        });
      });
  },
  
  inputName: function(e) {
    this.setData({
      'addressData.name': e.detail.value
    });
  },
  
  inputPhone: function(e) {
    this.setData({
      'addressData.phone': e.detail.value
    });
  },
  
  inputDetail: function(e) {
    this.setData({
      'addressData.detail': e.detail.value
    });
  },
  
  regionChange: function(e) {
    const [province, city, district] = e.detail.value;
    this.setData({
      'addressData.province': province,
      'addressData.city': city,
      'addressData.district': district
    });
  },
  
  switchChange: function(e) {
    this.setData({
      'addressData.isDefault': e.detail.value
    });
  },
  
  saveAddress: function() {
    // 表单验证
    if (!this.validateForm()) {
      return;
    }
    
    wx.showLoading({
      title: this.data.i18n.saving
    });
    
    // 构造保存的数据
    const addressData = {
      name: this.data.addressData.name,
      phone: this.data.addressData.phone,
      province: this.data.addressData.province,
      city: this.data.addressData.city,
      district: this.data.addressData.district,
      detail: this.data.addressData.detail,
      isDefault: this.data.addressData.isDefault
    };
    
    // 如果是编辑模式，需要确保传递了正确的ID
    let apiMethod;
    let payload;
    if (this.data.isEdit) {
      apiMethod = api.updateAddress;
      payload = {
        ...addressData,
        _id: this.data.addressId // 传递 _id 给 updateAddress 函数
      };
      console.log('编辑地址，ID:', this.data.addressId); // 调试日志
    } else {
      apiMethod = api.createAddress;
      payload = addressData;
      console.log('创建新地址'); // 调试日志
    }
    
    console.log('保存地址数据:', payload); // 调试日志
    
    // 调用API保存地址
    apiMethod(payload) // 传递包含 _id 的 payload (如果是编辑)
      .then(res => {
        wx.hideLoading();
        console.log('保存地址成功:', res); // 调试日志
        if (res.success) {
          wx.showToast({
            title: this.data.i18n.saveSuccess,
            icon: 'success'
          });
          setTimeout(() => wx.navigateBack(), 1500);
        } else {
          wx.showToast({
            title: res.message || this.t('addressEdit.saveFailed'),
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('保存地址失败:', err);
        wx.showToast({
          title: this.t('addressEdit.saveFailed') || '保存失败，请重试',
          icon: 'none'
        });
      });
  },
  
  // 显示错误提示
  showError: function(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },
  
  validateForm: function() {
    if (!this.data.addressData.name) {
      this.showError(this.data.i18n.nameRequired);
      return false;
    }
    
    if (!this.data.addressData.phone) {
      this.showError(this.data.i18n.phoneRequired);
      return false;
    }
    
    if (!/^1\d{10}$/.test(this.data.addressData.phone)) {
      this.showError(this.data.i18n.phoneInvalid);
      return false;
    }
    
    if (!this.data.addressData.province) {
      this.showError(this.data.i18n.regionRequired);
      return false;
    }
    
    if (!this.data.addressData.detail) {
      this.showError(this.data.i18n.detailRequired);
      return false;
    }
    
    return true;
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 