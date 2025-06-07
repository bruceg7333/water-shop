const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 定义图标的基本颜色
const COLORS = {
  normal: '#999999',
  active: '#0088cc'
};

// 定义图标尺寸
const ICON_SIZE = 24;

// 定义图标类型和对应的绘制函数
const ICONS = {
  home: drawHome,
  shop: drawShop,
  cart: drawCart,
  order: drawOrder,
  profile: drawProfile
};

// 创建PNG目录
const PNG_DIR = path.join(__dirname, '../src/assets/images/tabbar/png');
if (!fs.existsSync(PNG_DIR)) {
  fs.mkdirSync(PNG_DIR, { recursive: true });
}

// 为每种图标生成普通和激活状态的PNG
Object.keys(ICONS).forEach(iconName => {
  // 生成普通状态图标
  generateIcon(iconName, false);
  
  // 生成激活状态图标
  generateIcon(iconName, true);
});

console.log('所有图标已生成完成！');

// 生成单个图标
function generateIcon(iconName, isActive) {
  const canvas = createCanvas(ICON_SIZE, ICON_SIZE);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
  
  // 设置颜色
  const color = isActive ? COLORS.active : COLORS.normal;
  
  // 绘制图标
  ICONS[iconName](ctx, color);
  
  // 生成文件名
  const fileName = isActive ? `${iconName}-active.png` : `${iconName}.png`;
  const filePath = path.join(PNG_DIR, fileName);
  
  // 将画布保存为PNG文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`生成图标: ${fileName}`);
}

// 绘制首页图标
function drawHome(ctx, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  // 绘制房子外框
  ctx.beginPath();
  ctx.moveTo(12, 3); // 屋顶顶点
  ctx.lineTo(3, 10); // 左下角
  ctx.lineTo(3, 21); // 左墙底部
  ctx.lineTo(21, 21); // 底部
  ctx.lineTo(21, 10); // 右墙
  ctx.lineTo(12, 3); // 回到顶点
  ctx.stroke();
  
  // 绘制门
  ctx.beginPath();
  ctx.rect(9, 15, 6, 6);
  ctx.stroke();
}

// 绘制购物车图标
function drawCart(ctx, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  // 绘制购物车顶部
  ctx.beginPath();
  ctx.moveTo(4, 6);
  ctx.lineTo(6, 6);
  ctx.lineTo(8, 14);
  ctx.lineTo(18, 14);
  ctx.lineTo(20, 6);
  ctx.lineTo(22, 6);
  ctx.stroke();
  
  // 绘制购物车主体
  ctx.beginPath();
  ctx.rect(7, 14, 12, 5);
  ctx.stroke();
  
  // 绘制左轮
  ctx.beginPath();
  ctx.arc(9, 21, 1.5, 0, Math.PI * 2);
  ctx.stroke();
  
  // 绘制右轮
  ctx.beginPath();
  ctx.arc(17, 21, 1.5, 0, Math.PI * 2);
  ctx.stroke();
}

// 绘制订单图标
function drawOrder(ctx, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  // 绘制订单外框
  ctx.beginPath();
  ctx.rect(5, 4, 14, 16);
  ctx.stroke();
  
  // 绘制订单线条
  ctx.beginPath();
  ctx.moveTo(8, 9);
  ctx.lineTo(16, 9);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(8, 13);
  ctx.lineTo(16, 13);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(8, 17);
  ctx.lineTo(16, 17);
  ctx.stroke();
}

// 绘制商城图标
function drawShop(ctx, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  // 绘制商店外框
  ctx.beginPath();
  ctx.rect(4, 6, 16, 15);
  ctx.stroke();
  
  // 绘制屋顶
  ctx.beginPath();
  ctx.moveTo(3, 6);
  ctx.lineTo(12, 2);
  ctx.lineTo(21, 6);
  ctx.stroke();
  
  // 绘制门
  ctx.beginPath();
  ctx.rect(10, 13, 4, 8);
  ctx.stroke();
  
  // 绘制窗户
  ctx.beginPath();
  ctx.rect(6, 10, 3, 3);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(15, 10, 3, 3);
  ctx.stroke();
  
  // 绘制招牌
  ctx.beginPath();
  ctx.rect(7, 4, 10, 2);
  ctx.stroke();
}

// 绘制个人图标
function drawProfile(ctx, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  // 绘制头部
  ctx.beginPath();
  ctx.arc(12, 8, 5, 0, Math.PI * 2);
  ctx.stroke();
  
  // 绘制身体
  ctx.beginPath();
  ctx.moveTo(12, 13);
  ctx.lineTo(12, 16);
  ctx.stroke();
  
  // 绘制躯干
  ctx.beginPath();
  ctx.arc(12, 19, 5, Math.PI * 0.3, Math.PI * 0.7, false);
  ctx.stroke();
} 