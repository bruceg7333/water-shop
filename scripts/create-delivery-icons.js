const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 定义图标尺寸
const ICON_SIZE = 80;

// 定义图标的基本颜色
const COLOR = '#0088cc';

// 创建icons目录
const ICONS_DIR = path.join(__dirname, '../src/assets/images/icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 生成送货方式图标
function generateDeliveryIcons() {
  // 生成外卖图标
  createDeliveryIcon();
  
  // 生成自取图标
  createSelfPickupIcon();
  
  console.log('送货方式图标已生成完成！');
}

// 生成外卖图标
function createDeliveryIcon() {
  const canvas = createCanvas(ICON_SIZE, ICON_SIZE);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
  
  // 设置颜色
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 3;
  
  // 外卖车辆图标
  // 车身
  ctx.beginPath();
  ctx.rect(15, 25, 30, 20);
  ctx.stroke();
  
  // 车头
  ctx.beginPath();
  ctx.moveTo(45, 25);
  ctx.lineTo(60, 30);
  ctx.lineTo(60, 45);
  ctx.lineTo(45, 45);
  ctx.stroke();
  
  // 车轮
  ctx.beginPath();
  ctx.arc(25, 50, 5, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(50, 50, 5, 0, Math.PI * 2);
  ctx.stroke();
  
  // 水滴图案表示水配送
  ctx.beginPath();
  ctx.moveTo(30, 15);
  ctx.bezierCurveTo(25, 5, 20, 10, 20, 15);
  ctx.bezierCurveTo(20, 22, 30, 22, 30, 15);
  ctx.fillStyle = COLOR;
  ctx.fill();
  
  // 生成文件名
  const fileName = 'delivery.png';
  const filePath = path.join(ICONS_DIR, fileName);
  
  // 将画布保存为PNG文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成图标: ${fileName}`);
}

// 生成自取图标
function createSelfPickupIcon() {
  const canvas = createCanvas(ICON_SIZE, ICON_SIZE);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
  
  // 设置颜色
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 3;
  
  // 绘制商店
  // 房子主体
  ctx.beginPath();
  ctx.moveTo(40, 15); // 屋顶顶点
  ctx.lineTo(15, 30); // 屋顶左侧
  ctx.lineTo(15, 55); // 左墙
  ctx.lineTo(65, 55); // 底部
  ctx.lineTo(65, 30); // 右墙
  ctx.lineTo(40, 15); // 返回顶点
  ctx.stroke();
  
  // 门
  ctx.beginPath();
  ctx.rect(35, 40, 10, 15);
  ctx.stroke();
  
  // 水瓶图标代表水站
  ctx.beginPath();
  ctx.rect(20, 35, 10, 15);
  ctx.stroke();
  
  // 瓶盖
  ctx.beginPath();
  ctx.rect(22, 32, 6, 3);
  ctx.stroke();
  
  // 生成文件名
  const fileName = 'self-pickup.png';
  const filePath = path.join(ICONS_DIR, fileName);
  
  // 将画布保存为PNG文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成图标: ${fileName}`);
}

// 执行生成图标
generateDeliveryIcons(); 