const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 定义图标尺寸
const ICON_SIZE = 200;

// 创建icons目录
const ICONS_DIR = path.join(__dirname, '../src/assets/images/icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 创建空购物车图标
function createEmptyCartIcon() {
  const canvas = createCanvas(ICON_SIZE, ICON_SIZE);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
  
  // 设置颜色
  const color = '#aaccdd';
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  
  // 绘制购物车
  const scale = 4;
  const xOffset = 50;
  const yOffset = 70;
  
  // 绘制购物车顶部
  ctx.beginPath();
  ctx.moveTo(xOffset, yOffset);
  ctx.lineTo(xOffset + 10*scale, yOffset);
  ctx.lineTo(xOffset + 20*scale, yOffset + 40*scale);
  ctx.lineTo(xOffset + 70*scale, yOffset + 40*scale);
  ctx.lineTo(xOffset + 80*scale, yOffset);
  ctx.lineTo(xOffset + 90*scale, yOffset);
  ctx.stroke();
  
  // 绘制购物车主体
  ctx.beginPath();
  ctx.rect(xOffset + 15*scale, yOffset + 40*scale, 60*scale, 25*scale);
  ctx.stroke();
  
  // 绘制左轮
  ctx.beginPath();
  ctx.arc(xOffset + 30*scale, yOffset + 75*scale, 8*scale, 0, Math.PI * 2);
  ctx.stroke();
  
  // 绘制右轮
  ctx.beginPath();
  ctx.arc(xOffset + 60*scale, yOffset + 75*scale, 8*scale, 0, Math.PI * 2);
  ctx.stroke();
  
  // 绘制叉号表示空
  ctx.beginPath();
  ctx.moveTo(xOffset + 35*scale, yOffset + 15*scale);
  ctx.lineTo(xOffset + 55*scale, yOffset + 35*scale);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(xOffset + 55*scale, yOffset + 15*scale);
  ctx.lineTo(xOffset + 35*scale, yOffset + 35*scale);
  ctx.stroke();
  
  // 生成文件名
  const fileName = 'empty-cart.png';
  const filePath = path.join(ICONS_DIR, fileName);
  
  // 将画布保存为PNG文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成图标: ${fileName}`);
}

createEmptyCartIcon();
console.log('空购物车图标已生成完成！'); 