# SPRINKLE 水商城微信小程序

## 项目简介

SPRINKLE 水商城是一个基于微信小程序的品牌产品展示与销售平台，专注于水品质商品的在线销售，提供完整的购物体验，包括商品浏览、购物车、订单管理、用户中心、积分系统、优惠券等功能。

## 技术栈

### 小程序框架
- **微信小程序原生框架** - 使用原生小程序开发，性能优异
- **WXML** - 微信标记语言，用于页面结构
- **WXSS** - 微信样式表，用于页面样式
- **JavaScript** - 页面逻辑和数据处理

### 开发工具
- **微信开发者工具** - 官方开发调试工具
- **Canvas** - 图形绘制和图像处理

### 功能特性
- **国际化支持** - 多语言切换功能
- **事件总线** - 全局事件通信机制
- **状态管理** - 全局数据状态管理
- **网络请求** - 封装的 HTTP 请求库

## 软件架构

### 目录结构
```
src/
├── pages/              # 页面文件
│   ├── index/          # 首页
│   ├── cart/           # 购物车
│   ├── product/        # 商品相关
│   │   ├── detail/     # 商品详情
│   │   └── list/       # 商品列表
│   ├── order/          # 订单相关
│   │   ├── index/      # 订单列表
│   │   ├── detail/     # 订单详情
│   │   ├── confirm/    # 订单确认
│   │   ├── payment/    # 支付页面
│   │   └── result/     # 支付结果
│   ├── member/         # 会员相关
│   │   ├── login/      # 登录
│   │   ├── register/   # 注册
│   │   └── info/       # 个人信息
│   ├── address/        # 地址管理
│   │   ├── list/       # 地址列表
│   │   └── edit/       # 地址编辑
│   ├── coupon/         # 优惠券
│   ├── favorite/       # 收藏
│   ├── points/         # 积分
│   ├── profile/        # 个人中心
│   ├── profile-edit/   # 个人信息编辑
│   ├── service/        # 客服
│   ├── about/          # 关于我们
│   ├── article/        # 文章
│   ├── promotion/      # 促销活动
│   └── agreement/      # 用户协议
├── utils/              # 工具函数
│   ├── i18n/           # 国际化
│   ├── auth.js         # 认证工具
│   ├── request.js      # 网络请求
│   └── event-emitter.js # 事件总线
├── static/             # 静态资源
│   └── images/         # 图片资源
├── assets/             # 资源文件
├── app.js              # 小程序入口
├── app.json            # 小程序配置
├── app.wxss            # 全局样式
└── sitemap.json        # 站点地图
```

### 架构特点
- **页面路由**: 基于微信小程序原生路由系统
- **组件化**: 可复用的自定义组件
- **数据绑定**: 双向数据绑定机制
- **生命周期**: 完整的页面和组件生命周期管理
- **事件系统**: 全局事件总线，支持跨页面通信

## 功能清单

### 🏠 首页 (Index)
- **轮播图**: 首页轮播广告展示
- **商品推荐**: 热销商品、新品推荐
- **分类导航**: 商品分类快速入口
- **活动专区**: 促销活动展示
- **搜索功能**: 商品搜索入口

### 📦 商品模块 (Product)
- **商品列表**: 分类商品展示、筛选排序
- **商品详情**: 商品图片、描述、规格、评价
- **商品搜索**: 关键词搜索、历史搜索
- **商品收藏**: 收藏/取消收藏商品
- **商品分享**: 分享商品给好友

### 🛒 购物车 (Cart)
- **购物车管理**: 添加、删除、修改商品
- **数量调整**: 商品数量增减
- **规格选择**: 商品规格变更
- **价格计算**: 实时计算总价
- **批量操作**: 全选、批量删除
- **优惠券**: 优惠券选择和使用

### 📋 订单模块 (Order)
- **订单确认**: 确认订单信息、选择地址
- **订单支付**: 微信支付、货到付款
- **订单列表**: 不同状态订单展示
- **订单详情**: 完整订单信息查看
- **订单操作**: 取消、确认收货、申请退款
- **物流跟踪**: 订单物流状态查询

### 👤 用户模块 (Member)
- **用户注册**: 手机号注册、验证码验证
- **用户登录**: 账号密码登录、微信授权登录
- **个人信息**: 头像、昵称、性别、生日等
- **密码管理**: 修改密码、找回密码
- **账号安全**: 手机号绑定、安全设置

### 📍 地址管理 (Address)
- **地址列表**: 收货地址展示
- **地址添加**: 新增收货地址
- **地址编辑**: 修改地址信息
- **默认地址**: 设置默认收货地址
- **地址删除**: 删除不需要的地址

### 🎫 优惠券 (Coupon)
- **优惠券列表**: 可用、已使用、已过期优惠券
- **优惠券领取**: 领取平台发放的优惠券
- **使用规则**: 优惠券使用条件说明
- **优惠券分享**: 分享优惠券给好友

### ❤️ 收藏 (Favorite)
- **收藏列表**: 用户收藏的商品展示
- **收藏管理**: 取消收藏、批量管理
- **快速购买**: 从收藏直接加入购物车

### 🎯 积分系统 (Points)
- **积分查询**: 当前积分余额
- **积分记录**: 积分获取和消费记录
- **积分规则**: 积分获取和使用规则
- **积分兑换**: 积分兑换商品或优惠券

### 👨‍💼 个人中心 (Profile)
- **用户信息**: 头像、昵称、会员等级
- **订单管理**: 快速查看各状态订单
- **功能入口**: 地址、优惠券、收藏、积分等
- **设置中心**: 语言切换、消息设置
- **客服联系**: 在线客服、意见反馈

### 🌐 国际化 (i18n)
- **多语言支持**: 中文、英文等多语言切换
- **动态切换**: 实时语言切换，无需重启
- **本地存储**: 语言偏好本地保存
- **全局更新**: 所有页面同步更新语言

### 📱 其他功能
- **客服系统**: 在线客服咨询
- **关于我们**: 品牌介绍、联系方式
- **用户协议**: 服务条款、隐私政策
- **文章资讯**: 品牌资讯、使用指南
- **促销活动**: 限时活动、节日促销

## 小程序配置

### 页面配置 (app.json)
```json
{
  "pages": [
    "pages/index/index",      // 首页
    "pages/cart/index",       // 购物车
    "pages/profile/index",    // 个人中心
    "pages/order/index",      // 订单列表
    "pages/product/detail",   // 商品详情
    "pages/product/list",     // 商品列表
    "pages/member/login",     // 登录
    "pages/address/list",     // 地址管理
    "pages/coupon/list",      // 优惠券
    "pages/favorite/list",    // 收藏
    "pages/points/index"      // 积分
  ],
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/images/tabbar/home.png",
        "selectedIconPath": "static/images/tabbar/home-active.png"
      },
      {
        "pagePath": "pages/cart/index",
        "text": "购物车",
        "iconPath": "static/images/tabbar/cart.png",
        "selectedIconPath": "static/images/tabbar/cart-active.png"
      },
      {
        "pagePath": "pages/order/index",
        "text": "订单",
        "iconPath": "static/images/tabbar/order.png",
        "selectedIconPath": "static/images/tabbar/order-active.png"
      },
      {
        "pagePath": "pages/profile/index",
        "text": "我的",
        "iconPath": "static/images/tabbar/profile.png",
        "selectedIconPath": "static/images/tabbar/profile-active.png"
      }
    ]
  }
}
```

### 权限配置
```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "您的位置信息将用于获取附近的配送信息"
    }
  }
}
```

## 开发环境

### 环境要求
- **微信开发者工具** - 最新稳定版
- **微信小程序账号** - 用于真机调试和发布
- **Node.js** - v14+ (用于构建工具)

### 开发工具下载
- [微信开发者工具下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 项目配置

#### 1. 导入项目
1. 打开微信开发者工具
2. 选择"小程序"项目类型
3. 点击"导入项目"
4. 选择项目根目录
5. 填入小程序 AppID
6. 点击"导入"

#### 2. 配置 AppID
修改 `project.config.json` 文件：
```json
{
  "appid": "你的小程序AppID",
  "projectname": "water-shop",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "minified": true
  }
}
```

#### 3. 配置后端接口
修改 `src/utils/request.js` 中的 API 地址：
```javascript
const BASE_URL = 'http://localhost:5001/api'; // 开发环境
// const BASE_URL = 'https://your-api-domain.com/api'; // 生产环境
```

### 开发调试

#### 本地调试
1. 在微信开发者工具中打开项目
2. 点击"编译"按钮
3. 在模拟器中查看效果
4. 使用调试器查看日志和网络请求

#### 真机调试
1. 点击"预览"按钮生成二维码
2. 使用微信扫码在手机上查看
3. 或点击"真机调试"进行实时调试

#### 网络配置
在微信公众平台配置服务器域名：
- request 合法域名：你的 API 服务器域名
- uploadFile 合法域名：文件上传服务器域名
- downloadFile 合法域名：文件下载服务器域名

## 部署发布

### 版本管理
1. 在微信开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 上传代码到微信后台

### 提交审核
1. 登录微信公众平台
2. 进入"版本管理"页面
3. 选择要发布的版本
4. 提交审核并填写审核信息

### 发布上线
1. 审核通过后，在微信公众平台发布版本
2. 用户可以通过微信搜索或扫码访问小程序

## API 接口

### 基础配置
```javascript
// src/utils/request.js
const BASE_URL = 'http://localhost:5001/api';

// 请求拦截器
const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: resolve,
      fail: reject
    });
  });
};
```

### 主要接口
- **用户相关**: `/users` - 登录、注册、个人信息
- **商品相关**: `/products` - 商品列表、详情、搜索
- **购物车**: `/cart` - 购物车操作
- **订单相关**: `/orders` - 订单创建、查询、状态更新
- **地址管理**: `/addresses` - 收货地址管理
- **优惠券**: `/coupons` - 优惠券领取、使用
- **收藏**: `/favorites` - 商品收藏管理
- **积分**: `/points` - 积分查询、记录
- **支付**: `/payments` - 支付处理

## 性能优化

### 代码优化
- **按需加载**: 页面和组件按需加载
- **图片优化**: 图片懒加载、压缩处理
- **缓存策略**: 合理使用本地存储和缓存
- **网络优化**: 请求合并、防抖处理

### 用户体验
- **加载状态**: 所有异步操作显示加载状态
- **错误处理**: 友好的错误提示和重试机制
- **离线支持**: 基础功能离线可用
- **响应式**: 适配不同屏幕尺寸

## 常见问题

### 1. 开发者工具相关
- **项目导入失败**: 检查项目目录结构和配置文件
- **编译错误**: 检查代码语法和依赖关系
- **预览失败**: 检查网络连接和 AppID 配置

### 2. 网络请求问题
- **接口调用失败**: 检查服务器域名配置和网络连接
- **跨域问题**: 确保后端正确配置 CORS
- **认证失败**: 检查 Token 是否正确传递

### 3. 功能异常
- **登录失败**: 检查用户信息和网络状态
- **支付问题**: 确认支付配置和商户信息
- **图片显示异常**: 检查图片 URL 和网络权限

### 4. 性能问题
- **页面加载慢**: 优化图片大小和网络请求
- **内存占用高**: 及时清理不需要的数据和监听器
- **卡顿问题**: 减少复杂计算和频繁的数据更新

## 开发规范

### 代码规范
- 使用 ES6+ 语法
- 遵循小程序开发规范
- 统一的命名规范
- 完善的注释文档

### 文件命名
- 页面文件：kebab-case
- 组件文件：PascalCase
- 工具文件：camelCase
- 图片文件：kebab-case

### 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 样式调整
- refactor: 代码重构
- test: 测试相关

## 技术支持

### 官方文档
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信小程序 API 文档](https://developers.weixin.qq.com/miniprogram/dev/api/)

### 社区支持
- 微信开放社区
- GitHub Issues
- 开发者交流群

如有问题或建议，请联系开发团队或提交 Issue。

## 更新日志

### v1.0.0
- 初始版本发布
- 完整的购物功能
- 用户管理系统
- 订单处理流程
- 国际化支持 