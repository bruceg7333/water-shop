// 引入国际化和页面基础模块
const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');

// 页面配置
const pageConfig = {
  data: {
    articleId: null,
    article: null,
    relatedArticles: [],
    i18n: {} // 添加国际化文本对象
  },
  
  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    this.setData({
      i18n: {
        loading: this.t('common.loading'),
        error: this.t('common.error'),
        viewsLabel: this.t('articleDetail.viewsLabel') || '阅读',
        sharesLabel: this.t('articleDetail.sharesLabel') || '分享',
        shareButton: this.t('articleDetail.shareButton') || '分享',
        relatedArticles: this.t('articleDetail.relatedArticles') || '相关文章',
        homeButton: this.t('articleDetail.homeButton') || '首页',
        authorLabel: this.t('articleDetail.authorLabel') || '作者',
        dateLabel: this.t('articleDetail.dateLabel') || '发布日期',
        loadingText: this.t('articleDetail.loadingText') || '内容加载中...'
      }
    });
  },
  
  onLoad: function(options) {
    if (options && options.id) {
      const articleId = options.id;
      this.setData({ articleId });
      
      // 加载文章详情数据
      this.loadArticleDetail(articleId);
    } else {
      wx.showToast({
        title: this.t('articleDetail.invalidParam') || '参数错误',
        icon: 'none'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
  
  // 加载文章详情
  loadArticleDetail: function(articleId) {
    wx.showLoading({
      title: this.t('common.loading') || '加载中...'
    });
    
    // 请求文章详情
    api.article.getDetail(articleId)
      .then(res => {
        if (res.success && res.data && res.data.article) {
          // 获取文章数据和相关文章
          const { article, relatedArticles } = res.data;
          
          // 格式化日期，使用国际化的日期格式
          if (article.publishDate) {
            article.publishDate = this.formatDate(new Date(article.publishDate));
          }
          
          // 格式化相关文章日期
          if (relatedArticles && relatedArticles.length > 0) {
            relatedArticles.forEach(relArticle => {
              if (relArticle.publishDate) {
                relArticle.publishDate = this.formatDate(new Date(relArticle.publishDate));
              }
            });
          }
          
          this.setData({
            article,
            relatedArticles: relatedArticles || []
          });
          
          // 设置页面标题
          wx.setNavigationBarTitle({
            title: article.title
          });
        } else {
          wx.showToast({
            title: this.t('articleDetail.notFound') || '文章不存在',
            icon: 'none'
          });
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      })
      .catch(err => {
        console.error('获取文章详情失败:', err);
        wx.showToast({
          title: this.t('articleDetail.loadFailed') || '加载失败，请重试',
          icon: 'none'
        });
      })
      .finally(() => {
        wx.hideLoading();
      });
  },
  
  // 分享文章
  onShareAppMessage: function() {
    if (this.data.article) {
      // 增加分享计数
      this.increaseShareCount();
      
      return {
        title: this.data.article.title,
        path: `/pages/article/detail?id=${this.data.articleId}`,
        imageUrl: this.data.article.imageUrl
      };
    }
    return {
      title: this.t('app.title') || 'SPRINKLE 饮水科普',
      path: '/pages/index/index'
    };
  },
  
  // 增加分享计数
  increaseShareCount: function() {
    if (!this.data.articleId) return;
    
    api.article.increaseShareCount(this.data.articleId)
      .then(res => {
        if (res.success && res.data) {
          // 更新本地分享数
          this.setData({
            'article.shares': res.data.shares
          });
        }
      })
      .catch(err => {
        console.error('更新分享计数失败:', err);
      });
  },
  
  // 返回首页
  goToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  
  // 查看相关文章
  viewRelatedArticle: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: `/pages/article/detail?id=${id}`
    });
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 