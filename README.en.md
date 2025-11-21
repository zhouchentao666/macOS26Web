# macOS 26 Web Simulator

A web-based macOS 26 desktop environment simulator built with pure HTML, CSS, and JavaScript - no frameworks required.

[简体中文](README.md) | English

## ✨ Features

- 🎨 **Highly Authentic macOS Interface** - Complete simulation of macOS visual design and interaction experience
- 🪟 **Fully Functional Finder Window** - Support for dragging, resizing, maximizing/minimizing operations
- 📁 **File System Simulation** - Multi-level folder structure and file browsing
- 🎯 **Dock Bar** - Dynamic app icons with hover effects
- 📋 **Menu Bar** - Complete top menu system with dropdown menus
- 🔍 **Search Functionality** - Built-in search in Finder window
- 📱 **Responsive Design** - Adapts to different screen sizes
- 🎭 **Frosted Glass Effect** - Glassmorphism using CSS backdrop-filter
- 🖱️ **Context Menu** - Right-click menu support
- 🌈 **Adaptive Colors** - Automatic interface color adjustment based on background

## 🚀 Quick Start

### Online Preview

Simply open the `index.html` file in your browser.

### Local Development

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd macos-web-simulator

# Run with any HTTP server
# Option 1: Using Python
python -m http.server 8000

# Option 2: Using Node.js http-server
npx http-server

# Option 3: Using VS Code Live Server extension
# Right-click index.html -> Open with Live Server
```

Then visit `http://localhost:8000` in your browser.

## 📁 Project Structure

```
.
├── index.html              # Main page
├── css/                    # Stylesheets
│   ├── base.css           # Base styles
│   ├── menubar.css        # Menu bar styles
│   ├── dock.css           # Dock bar styles
│   ├── desktop.css        # Desktop styles
│   ├── LiquidGlass.css    # Frosted glass effect
│   ├── dropdown.css       # Dropdown menu styles
│   ├── contextmenu.css    # Context menu styles
│   ├── responsive.css     # Responsive styles
│   ├── finder.css         # Finder window styles
│   └── finder/            # Finder submodule styles
│       ├── window.css     # Window styles
│       ├── titlebar.css   # Title bar styles
│       ├── sidebar.css    # Sidebar styles
│       └── files.css      # File view styles
├── js/                     # JavaScript files
│   ├── time.js            # Time display
│   ├── menu.js            # Menu functionality
│   ├── menu-actions.js    # Menu actions
│   ├── dropdown.js        # Dropdown menus
│   ├── contextmenu.js     # Context menu
│   ├── adaptive-color.js  # Adaptive colors
│   ├── finder.js          # Finder main script
│   └── finder/            # Finder submodules
│       ├── index.js       # Finder initialization
│       ├── window-controls.js  # Window controls
│       ├── drag.js        # Drag functionality
│       ├── resize.js      # Resize functionality
│       ├── navigation.js  # Navigation
│       ├── file-view.js   # File view
│       └── file-data.js   # File data
├── image/                  # Image assets
│   ├── macOS 26 Light.jpg # Desktop wallpaper
│   ├── Finder.png         # Finder icon
│   ├── Safari.png         # Safari icon
│   └── ...                # Other app icons
└── ttf/                    # Font files
    └── PingFangSC-*.ttf   # PingFang SC fonts
```

## 🎮 Features Guide

### Finder Window

- **Open/Close**: Click the Finder icon in the Dock
- **Drag**: Hold and drag the title bar or top of sidebar
- **Resize**: Drag window edges or corners
- **Maximize**: Click the green button or double-click title bar
- **Minimize**: Click the yellow button, window shrinks to Dock
- **Close**: Click the red button

### File Browsing

- **Switch Views**: Use icon view/list view buttons in toolbar
- **Navigate**: Click sidebar items or use back/forward buttons
- **Search**: Click search button or type keywords directly
- **Sort**: Use sort button to select sorting method
- **New Folder**: Click new folder button in toolbar

### Menu Bar

- **Apple Menu**: System-related operations
- **Finder Menu**: Finder app settings
- **File/Edit/View**: File operations and view controls
- **Go**: Quick navigation to common locations
- **Window**: Window management
- **Help**: Help information

### Dock Bar

- **Hover Effect**: Icons magnify on mouse hover
- **App Labels**: Display app names on hover
- **Divider**: Separates apps and folders

## 🛠️ Tech Stack

- **HTML5** - Page structure
- **CSS3** - Styles and animations
  - Flexbox & Grid layout
  - CSS Variables for theming
  - backdrop-filter for glassmorphism
  - CSS Transitions & Animations
- **Vanilla JavaScript** - Interaction logic
  - DOM manipulation
  - Event handling
  - Drag and Drop API
  - Dynamic content rendering

## 🎨 Design Highlights

### Frosted Glass Effect (Liquid Glass)

Glassmorphism effect using CSS `backdrop-filter`, applied to:
- Menu bar
- Dock bar
- Finder window
- Dropdown menus
- Context menus

### Animations

- Window open/close animations
- Minimize to Dock animation
- Menu expand/collapse animations
- Dock icon hover magnification effect
- Smooth dragging and resizing

### Responsive Design

- Adapts to desktop and tablet devices
- Auto-adjusts layout on small screens
- Touch device optimization

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note**: Frosted glass effect requires browser support for `backdrop-filter` property.

## 📝 Customization

### Change Background

Replace the `image/macOS 26 Light.jpg` file, or modify in `index.html`:

```html
<div class="bg">
    <img src="your-background.jpg" alt="Background">
</div>
```

### Add Applications

Add new app items in the Dock section of `index.html`:

```html
<div class="dock-item" data-app="YourApp">
    <img src="image/your-app.png" alt="Your App">
    <span class="dock-label">Your App</span>
</div>
```

### Modify File Structure

Edit the `folderContents` object in `js/finder/file-data.js` to customize the file system structure.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License

## 🙏 Acknowledgments

- Design inspiration from Apple macOS
- Icon resources from macOS system
- Font: PingFang SC

---

**Note**: This is an educational and demonstration project for learning web development technologies. All trademarks and copyrights belong to their respective owners.
