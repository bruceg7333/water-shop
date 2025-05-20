const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 定义图片尺寸
const PRODUCT_WIDTH = 400;
const PRODUCT_HEIGHT = 400;

// 创建目录
const PRODUCTS_DIR = path.join(__dirname, '../src/assets/images/products');
if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

// 生成所有产品图片
function generateAllProductImages() {
  // 生成冰川纯净水
  generateProductImage(
    'water1.jpg', 
    '#0088cc', 
    '#56CCF2', 
    '冰川纯净水', 
    '玻璃瓶'
  );
  
  // 生成山泉矿泉水
  generateProductImage(
    'water2.jpg', 
    '#00838f', 
    '#4dd0e1', 
    '山泉矿泉水', 
    '塑料瓶'
  );
  
  // 生成冰川纯净水家庭装
  generateProductImage(
    'water3.jpg', 
    '#0288d1', 
    '#4fc3f7', 
    '家庭装', 
    '大桶'
  );
  
  // 生成天然矿泉水
  generateProductImage(
    'water4.jpg', 
    '#01579b', 
    '#29b6f6', 
    '天然矿泉水', 
    '运动瓶'
  );
  
  console.log('所有产品图片已生成完成！');
}

// 生成产品图片
function generateProductImage(fileName, colorStart, colorEnd, productName, bottleType) {
  const canvas = createCanvas(PRODUCT_WIDTH, PRODUCT_HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // 创建背景渐变
  const bgGradient = ctx.createLinearGradient(0, 0, PRODUCT_WIDTH, PRODUCT_HEIGHT);
  bgGradient.addColorStop(0, '#f5f5f5');
  bgGradient.addColorStop(1, '#e0f7fa');
  
  // 填充背景
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, PRODUCT_WIDTH, PRODUCT_HEIGHT);
  
  // 绘制水波纹背景
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  
  for (let y = 50; y < PRODUCT_HEIGHT; y += 20) {
    ctx.beginPath();
    for (let x = 0; x < PRODUCT_WIDTH; x += 10) {
      const amplitude = 5;
      const waveY = y + Math.sin(x / 30) * amplitude;
      
      if (x === 0) {
        ctx.moveTo(x, waveY);
      } else {
        ctx.lineTo(x, waveY);
      }
    }
    ctx.stroke();
  }
  
  // 绘制瓶子
  const bottleWidth = 100;
  const bottleHeight = 250;
  const bottleX = (PRODUCT_WIDTH - bottleWidth) / 2;
  const bottleY = 75;
  
  // 瓶身渐变
  const bottleGradient = ctx.createLinearGradient(
    bottleX, 
    bottleY, 
    bottleX + bottleWidth, 
    bottleY + bottleHeight
  );
  bottleGradient.addColorStop(0, colorStart);
  bottleGradient.addColorStop(1, colorEnd);
  
  if (bottleType === '玻璃瓶') {
    // 玻璃瓶形状
    // 瓶身
    ctx.fillStyle = bottleGradient;
    ctx.beginPath();
    ctx.moveTo(bottleX + bottleWidth * 0.3, bottleY);  // 瓶口左侧
    ctx.lineTo(bottleX + bottleWidth * 0.7, bottleY);  // 瓶口右侧
    ctx.lineTo(bottleX + bottleWidth * 0.8, bottleY + 30);  // 瓶颈右侧
    ctx.lineTo(bottleX + bottleWidth * 0.9, bottleY + bottleHeight * 0.9);  // 瓶身右下
    ctx.lineTo(bottleX + bottleWidth * 0.1, bottleY + bottleHeight * 0.9);  // 瓶身左下
    ctx.lineTo(bottleX + bottleWidth * 0.2, bottleY + 30);  // 瓶颈左侧
    ctx.closePath();
    ctx.fill();
    
    // 瓶盖
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.rect(bottleX + bottleWidth * 0.3, bottleY - 15, bottleWidth * 0.4, 15);
    ctx.fill();
    
    // 瓶口高光效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.rect(bottleX + bottleWidth * 0.35, bottleY + 5, bottleWidth * 0.1, bottleHeight * 0.8);
    ctx.fill();
  } else if (bottleType === '塑料瓶') {
    // 塑料瓶形状
    // 瓶身
    ctx.fillStyle = bottleGradient;
    ctx.beginPath();
    ctx.moveTo(bottleX + bottleWidth * 0.35, bottleY);  // 瓶口左侧
    ctx.lineTo(bottleX + bottleWidth * 0.65, bottleY);  // 瓶口右侧
    ctx.lineTo(bottleX + bottleWidth * 0.75, bottleY + 40);  // 瓶颈右侧
    ctx.lineTo(bottleX + bottleWidth * 0.9, bottleY + 80);  // 瓶肩右侧
    ctx.lineTo(bottleX + bottleWidth * 0.9, bottleY + bottleHeight * 0.9);  // 瓶身右下
    ctx.lineTo(bottleX + bottleWidth * 0.1, bottleY + bottleHeight * 0.9);  // 瓶身左下
    ctx.lineTo(bottleX + bottleWidth * 0.1, bottleY + 80);  // 瓶肩左侧
    ctx.lineTo(bottleX + bottleWidth * 0.25, bottleY + 40);  // 瓶颈左侧
    ctx.closePath();
    ctx.fill();
    
    // 瓶盖
    ctx.fillStyle = colorEnd;
    ctx.beginPath();
    ctx.rect(bottleX + bottleWidth * 0.35, bottleY - 15, bottleWidth * 0.3, 15);
    ctx.fill();
    
    // 瓶身纹理
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let y = bottleY + 100; y < bottleY + bottleHeight * 0.9; y += 20) {
      ctx.beginPath();
      ctx.moveTo(bottleX + 10, y);
      ctx.lineTo(bottleX + bottleWidth - 10, y);
      ctx.stroke();
    }
  } else if (bottleType === '大桶') {
    // 大桶水形状
    // 桶身
    ctx.fillStyle = bottleGradient;
    ctx.beginPath();
    ctx.moveTo(bottleX + bottleWidth * 0.3, bottleY);  // 桶口左侧
    ctx.lineTo(bottleX + bottleWidth * 0.7, bottleY);  // 桶口右侧
    ctx.lineTo(bottleX + bottleWidth, bottleY + 30);  // 桶肩右侧
    ctx.lineTo(bottleX + bottleWidth, bottleY + bottleHeight);  // 桶身右下
    ctx.lineTo(bottleX, bottleY + bottleHeight);  // 桶身左下
    ctx.lineTo(bottleX, bottleY + 30);  // 桶肩左侧
    ctx.closePath();
    ctx.fill();
    
    // 桶把手
    ctx.fillStyle = colorEnd;
    ctx.beginPath();
    ctx.rect(bottleX + bottleWidth * 0.75, bottleY + 50, bottleWidth * 0.15, 40);
    ctx.fill();
    
    // 桶身纹理
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    for (let y = bottleY + 50; y < bottleY + bottleHeight; y += 30) {
      ctx.beginPath();
      ctx.moveTo(bottleX + 5, y);
      ctx.lineTo(bottleX + bottleWidth - 5, y);
      ctx.stroke();
    }
  } else if (bottleType === '运动瓶') {
    // 运动瓶形状
    // 瓶身
    ctx.fillStyle = bottleGradient;
    ctx.beginPath();
    ctx.moveTo(bottleX + bottleWidth * 0.4, bottleY);  // 瓶口左侧
    ctx.lineTo(bottleX + bottleWidth * 0.6, bottleY);  // 瓶口右侧
    ctx.lineTo(bottleX + bottleWidth * 0.7, bottleY + 20);  // 瓶颈右侧
    ctx.lineTo(bottleX + bottleWidth * 0.8, bottleY + 50);  // 瓶肩右侧
    ctx.lineTo(bottleX + bottleWidth * 0.85, bottleY + bottleHeight * 0.9);  // 瓶身右下
    ctx.lineTo(bottleX + bottleWidth * 0.15, bottleY + bottleHeight * 0.9);  // 瓶身左下
    ctx.lineTo(bottleX + bottleWidth * 0.2, bottleY + 50);  // 瓶肩左侧
    ctx.lineTo(bottleX + bottleWidth * 0.3, bottleY + 20);  // 瓶颈左侧
    ctx.closePath();
    ctx.fill();
    
    // 运动瓶盖
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.arc(bottleX + bottleWidth / 2, bottleY - 5, bottleWidth * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // 瓶身纹理
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bottleX + bottleWidth * 0.3, bottleY + 70);
    ctx.lineTo(bottleX + bottleWidth * 0.7, bottleY + 70);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(bottleX + bottleWidth * 0.25, bottleY + 100);
    ctx.lineTo(bottleX + bottleWidth * 0.75, bottleY + 100);
    ctx.stroke();
  }
  
  // 添加标签
  const labelWidth = bottleWidth * 0.8;
  const labelHeight = bottleHeight * 0.3;
  const labelX = bottleX + (bottleWidth - labelWidth) / 2;
  const labelY = bottleY + bottleHeight * 0.5;
  
  // 标签背景
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.rect(labelX, labelY, labelWidth, labelHeight);
  ctx.fill();
  
  // 标签边框
  ctx.strokeStyle = colorStart;
  ctx.lineWidth = 2;
  ctx.strokeRect(labelX, labelY, labelWidth, labelHeight);
  
  // 产品名称
  ctx.fillStyle = colorStart;
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(productName, PRODUCT_WIDTH / 2, labelY + 30);
  
  // 在瓶口添加水滴效果
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(bottleX + bottleWidth / 2 - 10, bottleY - 25, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(bottleX + bottleWidth / 2 + 15, bottleY - 20, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // 将画布保存为文件
  const filePath = path.join(PRODUCTS_DIR, fileName);
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成产品图片: ${fileName}`);
}

// 执行生成图片
generateAllProductImages(); 