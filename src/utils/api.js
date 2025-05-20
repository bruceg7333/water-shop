// API基础URL
const BASE_URL = 'http://localhost:5001/api';

/* global wx */

/**
 * 发送请求
 * @param {Object} options 请求选项
 * @returns {Promise} 请求结果
 */
const request = (options) => {
  const { url, method = 'GET', data, header = {} } = options;
  
  // 获取令牌
  const token = wx.getStorageSync('token');
  
  // 如果有令牌，添加到请求头
  if (token) {
    header.Authorization = `Bearer ${token}`;
  }
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      data,
      method,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: res => {
        const { statusCode, data } = res;
        
        // 请求成功
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data);
        } else {
          // 请求失败
          reject(res);
        }
      },
      fail: error => {
        reject(error);
      }
    });
  });
};

// API方法
const api = {
  // 用户相关
  login: (data) => request({
    url: '/users/login',
    method: 'POST',
    data
  }),
  
  register: (data) => request({
    url: '/users/register',
    method: 'POST',
    data
  }),
  
  wechatLogin: (data) => request({
    url: '/users/wechat-login',
    method: 'POST',
    data
  }),
  
  wechatRegister: (data) => request({
    url: '/users/wechat-register',
    method: 'POST',
    data
  }),
  
  getCurrentUser: () => request({
    url: '/users/me'
  }),
  
  updateProfile: (data) => request({
    url: '/users/me',
    method: 'PUT',
    data
  }),
  
  // 添加结构化的用户相关API
  user: {
    login: (data) => request({
      url: '/users/login',
      method: 'POST',
      data
    }),
    
    register: (data) => request({
      url: '/users/register',
      method: 'POST',
      data
    }),
    
    wechatLogin: (data) => request({
      url: '/users/wechat-login',
      method: 'POST',
      data
    }),
    
    wechatRegister: (data) => request({
      url: '/users/wechat-register',
      method: 'POST',
      data
    }),
    
    getCurrentUser: () => request({
      url: '/users/me'
    }),
    
    updateProfile: (data) => request({
      url: '/users/me',
      method: 'PUT',
      data
    })
  },
  
  // 产品相关
  getProducts: (params) => request({
    url: '/products',
    data: params
  }),
  
  getProductById: (id) => request({
    url: `/products/${id}`
  }),
  
  getProductReviews: (productId, params = {}) => request({
    url: `/reviews/product/${productId}`,
    data: params
  }),
  
  // 购物车相关
  getCart: () => request({
    url: '/cart'
  }),
  
  getTempCart: (localCart) => {
    // 将本地购物车转换为查询字符串
    const items = encodeURIComponent(JSON.stringify(localCart));
    return request({
      url: `/cart/temp?items=${items}`
    });
  },
  
  syncCart: (data) => request({
    url: '/cart/sync',
    method: 'POST',
    data
  }),
  
  addToCart: (data) => request({
    url: '/cart/items',
    method: 'POST',
    data
  }),
  
  updateCartItem: (data) => request({
    url: '/cart/items',
    method: 'PUT',
    data
  }),
  
  removeCartItem: (itemId) => request({
    url: `/cart/items/${itemId}`,
    method: 'DELETE'
  }),
  
  clearCart: () => request({
    url: '/cart',
    method: 'DELETE'
  }),
  
  // 订单相关
  createOrder: (data) => request({
    url: '/orders',
    method: 'POST',
    data
  }),
  
  getOrders: (params) => request({
    url: '/orders',
    data: params
  }),
  
  getOrderById: (id) => request({
    url: `/orders/${id}`
  }),
  
  // 地址相关
  getAddresses: () => request({
    url: '/addresses'
  }),
  
  createAddress: (data) => request({
    url: '/addresses',
    method: 'POST',
    data
  }),
  
  updateAddress: (id, data) => request({
    url: `/addresses/${id}`,
    method: 'PUT',
    data
  }),
  
  deleteAddress: (id) => request({
    url: `/addresses/${id}`,
    method: 'DELETE'
  }),
  
  // 支付相关
  createPayment: (orderId) => request({
    url: '/payments',
    method: 'POST',
    data: { orderId }
  }),
  
  // 添加缺失的支付相关API方法
  payment: {
    getPaymentParams: (data) => request({
      url: '/payments/params',
      method: 'POST',
      data
    }),
    
    confirmPayment: (data) => request({
      url: '/payments/confirm',
      method: 'POST',
      data
    })
  },
  
  // 订单相关API的结构化调用方式
  order: {
    create: (data) => request({
      url: '/orders',
      method: 'POST',
      data
    }),
    
    getList: (params) => request({
      url: '/orders',
      data: params
    }),
    
    getDetail: (id) => request({
      url: `/orders/${id}`
    }),
    
    cancel: (id) => request({
      url: `/orders/${id}/cancel`,
      method: 'POST'
    }),
    
    confirmReceipt: (id) => request({
      url: `/orders/${id}/confirm`,
      method: 'POST'
    })
  },
  
  // 收藏相关
  getFavorites: () => request({
    url: '/favorites'
  }),
  
  addFavorite: (productId) => request({
    url: '/favorites',
    method: 'POST',
    data: { productId }
  }),
  
  removeFavorite: (productId) => request({
    url: `/favorites/${productId}`,
    method: 'DELETE'
  }),
  
  checkFavorite: (productId) => request({
    url: `/favorites/check/${productId}`
  }),
  
  // 优惠券相关
  getUserCoupons: () => request({
    url: '/coupons/me'
  }),
  
  getAvailableCoupons: () => request({
    url: '/coupons/available'
  }),
  
  claimCoupon: (couponId) => request({
    url: '/coupons/claim',
    method: 'POST',
    data: { couponId }
  }),
  
  verifyCoupon: (couponId) => request({
    url: `/coupons/verify/${couponId}`
  }),
  
  // 购物车计数
  getCartCount: () => request({
    url: '/cart/count'
  })
};

module.exports = api; 