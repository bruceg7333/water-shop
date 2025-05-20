const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// 定义图片尺寸
const BANNER_WIDTH = 750;
const BANNER_HEIGHT = 400;
const ARTICLE_WIDTH = 400;
const ARTICLE_HEIGHT = 300;

// 创建目录
const BANNER_DIR = path.join(__dirname, '../src/assets/images/banner');
const ARTICLE_DIR = path.join(__dirname, '../src/assets/images/articles');

// 确保目录存在
if (!fs.existsSync(BANNER_DIR)) {
  fs.mkdirSync(BANNER_DIR, { recursive: true });
}

if (!fs.existsSync(ARTICLE_DIR)) {
  fs.mkdirSync(ARTICLE_DIR, { recursive: true });
}

// 生成所有图片
async function generateAllImages() {
  // 生成轮播图
  await generateBannerImages();
  
  // 生成文章图片
  await generateArticleImages();
  
  console.log('所有图片已生成完成！');
}

// 生成轮播图
async function generateBannerImages() {
  // 轮播图1：高山冰川水
  await generateGradientImage(
    BANNER_WIDTH, 
    BANNER_HEIGHT, 
    'banner1.jpg', 
    BANNER_DIR, 
    'linear-gradient(135deg, #1a78c2, #56CCF2)',
    '高山冰川水',
    true,
    '水滴'
  );
  
  // 轮播图2：深层矿泉水
  await generateGradientImage(
    BANNER_WIDTH, 
    BANNER_HEIGHT, 
    'banner2.jpg', 
    BANNER_DIR, 
    'linear-gradient(135deg, #00838f, #4dd0e1)',
    '深层矿泉水',
    true,
    '矿物质'
  );
  
  // 轮播图3：健康饮水
  await generateGradientImage(
    BANNER_WIDTH, 
    BANNER_HEIGHT, 
    'banner3.jpg', 
    BANNER_DIR, 
    'linear-gradient(135deg, #0288d1, #4fc3f7)',
    '健康饮水',
    true,
    '健康'
  );
}

// 生成文章图片
async function generateArticleImages() {
  // 文章1：每天应该喝多少水？科学饮水指南
  await generateGradientImage(
    ARTICLE_WIDTH, 
    ARTICLE_HEIGHT, 
    'article1.jpg', 
    ARTICLE_DIR, 
    'linear-gradient(135deg, #1a78c2, #56CCF2)',
    '科学饮水指南',
    false
  );
  
  // 文章2：不同类型饮用水的区别与选择
  await generateGradientImage(
    ARTICLE_WIDTH, 
    ARTICLE_HEIGHT, 
    'article2.jpg', 
    ARTICLE_DIR, 
    'linear-gradient(135deg, #00838f, #4dd0e1)',
    '饮用水的区别',
    false
  );
  
  // 文章3：饮水与健康：关于水的几个误区
  await generateGradientImage(
    ARTICLE_WIDTH, 
    ARTICLE_HEIGHT, 
    'article3.jpg', 
    ARTICLE_DIR, 
    'linear-gradient(135deg, #0288d1, #4fc3f7)',
    '饮水与健康',
    false
  );
}

// 生成渐变背景图片
async function generateGradientImage(width, height, fileName, directory, gradient, text, drawWaterPattern = false, patternType = '') {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // 创建线性渐变背景
  const grd = ctx.createLinearGradient(0, 0, width, height);
  
  // 解析渐变颜色
  const gradientMatch = gradient.match(/linear-gradient\(135deg,\s*(#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/i);
  
  if (gradientMatch) {
    const startColor = gradientMatch[1];
    const endColor = gradientMatch[2];
    
    grd.addColorStop(0, startColor);
    grd.addColorStop(1, endColor);
    
    // 填充背景
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
    
    // 添加一些装饰图案
    if (drawWaterPattern) {
      // 添加水滴或矿物质或健康图案
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      
      if (patternType === '水滴') {
        // 绘制水滴图案
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = 10 + Math.random() * 30;
          
          ctx.beginPath();
          ctx.moveTo(x, y - size);
          ctx.bezierCurveTo(
            x - size, y - size / 2,
            x - size, y + size / 2,
            x, y + size
          );
          ctx.bezierCurveTo(
            x + size, y + size / 2,
            x + size, y - size / 2,
            x, y - size
          );
          ctx.fill();
        }
      } else if (patternType === '矿物质') {
        // 绘制矿物质结晶图案
        for (let i = 0; i < 40; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = 5 + Math.random() * 15;
          
          ctx.beginPath();
          ctx.moveTo(x, y - size);
          ctx.lineTo(x + size, y);
          ctx.lineTo(x, y + size);
          ctx.lineTo(x - size, y);
          ctx.closePath();
          ctx.fill();
        }
      } else if (patternType === '健康') {
        // 绘制心形健康图案
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = 10 + Math.random() * 20;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.bezierCurveTo(
            x - size / 2, y - size / 2,
            x - size, y,
            x, y + size
          );
          ctx.bezierCurveTo(
            x + size, y,
            x + size / 2, y - size / 2,
            x, y
          );
          ctx.fill();
        }
      }
    }
    
    // 添加文字
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `bold ${width / 10}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, height / 2);
    
    // 添加装饰纹理
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 5;
    
    // 画波浪线
    ctx.beginPath();
    for (let x = 0; x < width; x += 50) {
      const waveHeight = 20;
      const y = height - 50 + Math.sin(x / 30) * waveHeight;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
  
  // 将画布保存为文件
  const filePath = path.join(directory, fileName);
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成图片: ${fileName}`);
}

// 生成产品图片
async function generateProductImages() {
  // 待实现，类似于上面的代码
}

// 执行生成图片
generateAllImages().catch(console.error); 