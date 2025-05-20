const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 定义图标尺寸
const ICON_SIZE = 50;

// 定义图标的基本颜色
const COLOR = '#ffffff';

// 创建icons目录
const ICONS_DIR = path.join(__dirname, '../src/assets/images/icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 生成首页导航图标
function generateNavIcons() {
  // 生成所有商品图标
  createAllProductsIcon();
  
  // 生成饮水知识图标
  createKnowledgeIcon();
  
  // 生成优惠活动图标
  createDiscountIcon();
  
  // 生成新人礼包图标
  createGiftIcon();
  
  console.log('首页导航图标已生成完成！');
}

// 生成所有商品图标
function createAllProductsIcon() {
  const canvas = createCanvas(ICON_SIZE, ICON_SIZE);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
  
  // 设置颜色
  ctx.strokeStyle = COLOR;
  ctx.fillStyle = COLOR;
  ctx.lineWidth = 2;
  
  // 绘制水瓶图标
  // 瓶身
  ctx.beginPath();
  ctx.rect(15, 15, 20, 25);
  ctx.stroke();
  
  // 瓶盖
  ctx.beginPath();
  ctx.rect(20, 10, 10, 5);
  ctx.stroke();
  
  // 水波纹
  ctx.beginPath();
  ctx.moveTo(15, 25);
  ctx.lineTo(35, 25);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(15, 30);
  ctx.lineTo(35, 30);
  ctx.stroke();

  // 生成文件名
  const fileName = 'all.png';
  const filePath = path.join(ICONS_DIR, fileName);
  
  // 将画布保存为PNG文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成图标: ${fileName}`);
}

// 生成饮水知识图标
function createKnowledgeIcon() {
  const canvas = createCanvas(ICON_SIZE, ICON_SIZE);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
  
  // 设置颜色
  ctx.strokeStyle = COLOR;
  ctx.fillStyle = COLOR;
  ctx.lineWidth = 2;
  
  // 绘制书本图标
  // 书本外形
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(10, 40);
  ctx.lineTo(40, 40);
  ctx.lineTo(40, 10);
  ctx.lineTo(10, 10);
  ctx.stroke();
  
  // 书脊
  ctx.beginPath();
  ctx.moveTo(25, 10);
  ctx.lineTo(25, 40);
  ctx.stroke();
  
  // 水滴图案表示饮水知识
  ctx.beginPath();
  ctx.moveTo(33, 20);
  ctx.bezierCurveTo(30, 15, 25, 18, 33, 30);
  ctx.bezierCurveTo(40, 18, 36, 15, 33, 20);
  ctx.fill();
  
  // 生成文件名
  const fileName = 'knowledge.png';
  const filePath = path.join(ICONS_DIR, fileName);
  
  // 将画布保存为PNG文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成图标: ${fileName}`);
}

// 生成优惠活动图标
function createDiscountIcon() {
  const canvas = createCanvas(ICON_SIZE, ICON_SIZE);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
  
  // 设置颜色
  ctx.strokeStyle = COLOR;
  ctx.fillStyle = COLOR;
  ctx.lineWidth = 2;
  
  // 绘制打折标签
  // 标签外形
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(40, 10);
  ctx.lineTo(40, 30);
  ctx.lineTo(25, 40);
  ctx.lineTo(10, 30);
  ctx.closePath();
  ctx.stroke();
  
  // 折扣百分号
  ctx.font = 'bold 16px Arial';
  ctx.fillText('%', 22, 27);
  
  // 生成文件名
  const fileName = 'discount.png';
  const filePath = path.join(ICONS_DIR, fileName);
  
  // 将画布保存为PNG文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成图标: ${fileName}`);
}

// 生成新人礼包图标
function createGiftIcon() {
  const canvas = createCanvas(ICON_SIZE, ICON_SIZE);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
  
  // 设置颜色
  ctx.strokeStyle = COLOR;
  ctx.fillStyle = COLOR;
  ctx.lineWidth = 2;
  
  // 绘制礼物盒
  // 盒子主体
  ctx.beginPath();
  ctx.rect(10, 15, 30, 25);
  ctx.stroke();
  
  // 盒子盖
  ctx.beginPath();
  ctx.rect(8, 10, 34, 5);
  ctx.stroke();
  
  // 丝带
  ctx.beginPath();
  ctx.moveTo(25, 10);
  ctx.lineTo(25, 40);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(10, 25);
  ctx.lineTo(40, 25);
  ctx.stroke();
  
  // 生成文件名
  const fileName = 'gift.png';
  const filePath = path.join(ICONS_DIR, fileName);
  
  // 将画布保存为PNG文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成图标: ${fileName}`);
}

// 执行生成图标
generateNavIcons(); 