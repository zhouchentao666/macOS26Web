# macOS 26 Web Simulator

一个基于 Web 技术实现的 macOS 26 桌面环境模拟器，使用纯 HTML、CSS 和 JavaScript 构建，无需任何框架依赖。

简体中文 | [English](README.en.md)

## ✨ 特性

- 🎨 **高度还原的 macOS 界面** - 完整模拟 macOS 的视觉设计和交互体验
- 🪟 **功能完整的访达窗口** - 支持拖动、调整大小、最大化/最小化等操作
- 📁 **文件系统模拟** - 包含多层级文件夹结构和文件浏览
- 🎯 **Dock 栏** - 动态应用图标和悬停效果
- 📋 **菜单栏** - 完整的顶部菜单系统，包含下拉菜单
- 🔍 **搜索功能** - 访达窗口内置搜索
- 📱 **响应式设计** - 适配不同屏幕尺寸
- 🎭 **毛玻璃效果** - 使用 CSS backdrop-filter 实现的磨砂玻璃效果
- 🖱️ **右键菜单** - 上下文菜单支持
- 🌈 **自适应配色** - 根据背景自动调整界面颜色

## 🚀 快速开始

### 在线预览

直接用浏览器打开 `index.html` 文件即可运行。

### 本地运行

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd macos-web-simulator

# 使用任意 HTTP 服务器运行
# 方式 1: 使用 Python
python -m http.server 8000

# 方式 2: 使用 Node.js http-server
npx http-server

# 方式 3: 使用 VS Code Live Server 插件
# 右键 index.html -> Open with Live Server
```

然后在浏览器中访问 `http://localhost:8000`

## 📁 项目结构

```
.
├── index.html              # 主页面
├── css/                    # 样式文件
│   ├── base.css           # 基础样式
│   ├── menubar.css        # 菜单栏样式
│   ├── dock.css           # Dock 栏样式
│   ├── desktop.css        # 桌面样式
│   ├── LiquidGlass.css    # 毛玻璃效果
│   ├── dropdown.css       # 下拉菜单样式
│   ├── contextmenu.css    # 右键菜单样式
│   ├── responsive.css     # 响应式样式
│   ├── finder.css         # 访达窗口样式
│   └── finder/            # 访达子模块样式
│       ├── window.css     # 窗口样式
│       ├── titlebar.css   # 标题栏样式
│       ├── sidebar.css    # 侧边栏样式
│       └── files.css      # 文件视图样式
├── js/                     # JavaScript 文件
│   ├── time.js            # 时间显示
│   ├── menu.js            # 菜单功能
│   ├── menu-actions.js    # 菜单操作
│   ├── dropdown.js        # 下拉菜单
│   ├── contextmenu.js     # 右键菜单
│   ├── adaptive-color.js  # 自适应配色
│   ├── finder.js          # 访达主脚本
│   └── finder/            # 访达子模块
│       ├── index.js       # 访达初始化
│       ├── window-controls.js  # 窗口控制
│       ├── drag.js        # 拖动功能
│       ├── resize.js      # 调整大小
│       ├── navigation.js  # 导航功能
│       ├── file-view.js   # 文件视图
│       └── file-data.js   # 文件数据
├── image/                  # 图片资源
│   ├── macOS 26 Light.jpg # 桌面背景
│   ├── Finder.png         # 访达图标
│   ├── Safari.png         # Safari 图标
│   └── ...                # 其他应用图标
└── ttf/                    # 字体文件
    └── PingFangSC-*.ttf   # 苹方字体
```

## 🎮 功能说明

### 访达窗口

- **打开/关闭**: 点击 Dock 栏中的访达图标
- **拖动**: 按住标题栏或侧边栏顶部拖动窗口
- **调整大小**: 拖动窗口边缘或四角
- **最大化**: 点击绿色按钮或双击标题栏
- **最小化**: 点击黄色按钮，窗口会缩小到 Dock
- **关闭**: 点击红色按钮

### 文件浏览

- **切换视图**: 使用工具栏的图标视图/列表视图按钮
- **导航**: 点击侧边栏项目或使用后退/前进按钮
- **搜索**: 点击搜索按钮或直接输入关键词
- **排序**: 使用排序按钮选择排序方式
- **新建文件夹**: 点击工具栏的新建文件夹按钮

### 菜单栏

- **Apple 菜单**: 系统相关操作
- **访达菜单**: 访达应用设置
- **文件/编辑/显示**: 文件操作和视图控制
- **前往**: 快速导航到常用位置
- **窗口**: 窗口管理
- **帮助**: 帮助信息

### Dock 栏

- **悬停效果**: 鼠标悬停时图标会放大
- **应用标签**: 悬停时显示应用名称
- **分隔线**: 区分应用和文件夹

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和动画
  - Flexbox & Grid 布局
  - CSS Variables 主题变量
  - backdrop-filter 毛玻璃效果
  - CSS Transitions & Animations
- **Vanilla JavaScript** - 交互逻辑
  - DOM 操作
  - 事件处理
  - 拖放 API
  - 动态内容渲染

## 🎨 设计特点

### 毛玻璃效果 (Liquid Glass)

使用 CSS `backdrop-filter` 实现的磨砂玻璃效果，应用于：
- 菜单栏
- Dock 栏
- 访达窗口
- 下拉菜单
- 右键菜单

### 动画效果

- 窗口打开/关闭动画
- 最小化到 Dock 动画
- 菜单展开/收起动画
- Dock 图标悬停放大效果
- 平滑的拖动和调整大小

### 响应式设计

- 适配桌面和平板设备
- 小屏幕下自动调整布局
- 触摸设备优化

## 🌐 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**注意**: 毛玻璃效果需要浏览器支持 `backdrop-filter` 属性。

## 📝 自定义

### 修改背景

替换 `image/macOS 26 Light.jpg` 文件，或在 `index.html` 中修改：

```html
<div class="bg">
    <img src="your-background.jpg" alt="Background">
</div>
```

### 添加应用

在 `index.html` 的 Dock 部分添加新的应用项：

```html
<div class="dock-item" data-app="YourApp">
    <img src="image/your-app.png" alt="Your App">
    <span class="dock-label">你的应用</span>
</div>
```

### 修改文件结构

编辑 `js/finder/file-data.js` 中的 `folderContents` 对象来自定义文件系统结构。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- 设计灵感来自 Apple macOS
- 图标资源来自 macOS 系统
- 字体使用苹方 (PingFang SC)

---

**注意**: 这是一个教育和演示项目，仅用于学习 Web 开发技术。所有商标和版权归其各自所有者所有。
