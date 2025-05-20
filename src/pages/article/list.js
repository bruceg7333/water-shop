const { createPage } = require('../../utils/page-base');
const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');

// 定义页面配置
const pageConfig = {
  data: {
    articles: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    categories: [],
    activeCategory: 'all',
    i18n: {}
  },
  
  // 更新国际化文本
  updateI18nText() {
    // 更新分类列表
    const categories = [
      { id: 'all', name: this.t('articleList.categories.all') },
      { id: 'health', name: this.t('articleList.categories.health') },
      { id: 'science', name: this.t('articleList.categories.science') },
      { id: 'tips', name: this.t('articleList.categories.tips') }
    ];
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.t('articleList.title')
    });
    
    // 更新国际化文本
    this.setData({
      categories,
      i18n: {
        loading: this.t('articleList.loading'),
        noMore: this.t('articleList.noMore'),
        loadMore: this.t('articleList.loadMore'),
        noArticles: this.t('articleList.noArticles'),
        loadFailed: this.t('articleList.loadFailed'),
        empty: this.t('articleList.empty'),
        viewsLabel: this.t('articleList.viewsLabel')
      }
    });
  },
  
  onLoad: function(options) {
    // 如果有指定类别，则设置为当前类别
    if (options && options.category) {
      this.setData({
        activeCategory: options.category
      });
    }
    
    // 初始加载数据
    this.loadArticles(true);
  },
  
  // 切换分类
  switchCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    
    this.setData({
      activeCategory: category,
      page: 1,
      articles: [],
      hasMore: true
    });
    
    // 重新加载数据
    this.loadArticles(true);
  },
  
  // 加载文章数据
  loadArticles: function(isRefresh = false) {
    if (this.data.loading || (!this.data.hasMore && !isRefresh)) {
      return;
    }
    
    this.setData({
      loading: true
    });
    
    // 构建请求参数
    const params = {
      page: this.data.page,
      limit: this.data.pageSize
    };
    
    // 如果指定了分类，则按分类筛选
    if (this.data.activeCategory !== 'all') {
      params.category = this.data.activeCategory;
    }
    
    // 发起API请求获取文章列表
    api.article.getList(params)
      .then(res => {
        if (res.success && res.data && res.data.articles) {
          // 处理获取到的文章数据
          const articles = res.data.articles;
          
          // 格式化日期为YYYY-MM-DD格式
          articles.forEach(article => {
            if (article.publishDate) {
              const date = new Date(article.publishDate);
              article.publishDate = this.formatDate(date, 'YYYY-MM-DD');
            }
          });
          
          // 判断是否还有更多数据
          const hasMore = articles.length >= this.data.pageSize;
          
          this.setData({
            articles: isRefresh ? articles : [...this.data.articles, ...articles],
            page: this.data.page + 1,
            hasMore: hasMore,
            loading: false
          });
        } else {
          // 接口调用成功但数据为空
          this.setData({
            loading: false,
            hasMore: false
          });
          
          if (isRefresh) {
            wx.showToast({
              title: this.data.i18n.noArticles,
              icon: 'none'
            });
          }
        }
      })
      .catch(err => {
        console.error('获取文章列表失败:', err);
        this.setData({
          loading: false
        });
        
        wx.showToast({
          title: this.data.i18n.loadFailed,
          icon: 'none'
        });
      });
  },
  
  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
      articles: [],
      hasMore: true
    });
    
    this.loadArticles(true);
    
    wx.stopPullDownRefresh();
  },
  
  // 上拉加载更多
  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadArticles();
    }
  },
  
  // 点击文章查看详情
  viewArticle: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/article/detail?id=${id}`
    });
  },
  
  // 分享功能
  onShareAppMessage: function() {
    return {
      title: this.t('articleList.title'),
      path: '/pages/article/list'
    };
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 