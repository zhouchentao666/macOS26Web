// 右键菜单功能

class ContextMenu {
    constructor() {
        this.menu = null;
        this.init();
    }

    init() {
        // 创建菜单容器
        this.menu = document.createElement('div');
        this.menu.className = 'context-menu';
        document.body.appendChild(this.menu);

        // 监听点击事件关闭菜单
        document.addEventListener('click', () => this.hide());
        document.addEventListener('contextmenu', (e) => {
            // 如果点击的是菜单本身，不关闭
            if (e.target.closest('.context-menu')) {
                return;
            }
        });

        // 监听窗口大小变化
        window.addEventListener('resize', () => this.hide());
    }

    show(x, y, items) {
        // 清空现有内容
        this.menu.innerHTML = '';

        // 添加菜单项
        items.forEach(item => {
            if (item.type === 'divider') {
                const divider = document.createElement('div');
                divider.className = 'context-menu-divider';
                this.menu.appendChild(divider);
            } else {
                const menuItem = document.createElement('div');
                menuItem.className = 'context-menu-item';
                if (item.disabled) {
                    menuItem.classList.add('disabled');
                }

                let html = `<span>${item.label}</span>`;
                if (item.shortcut) {
                    html += `<span class="shortcut">${item.shortcut}</span>`;
                }

                menuItem.innerHTML = html;

                if (!item.disabled && item.action) {
                    menuItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        item.action();
                        this.hide();
                    });
                }

                this.menu.appendChild(menuItem);
            }
        });

        // 设置位置
        this.menu.style.left = x + 'px';
        this.menu.style.top = y + 'px';
        this.menu.classList.add('show');

        // 确保菜单不超出屏幕
        setTimeout(() => {
            const rect = this.menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                this.menu.style.left = (window.innerWidth - rect.width - 10) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                this.menu.style.top = (window.innerHeight - rect.height - 10) + 'px';
            }
        }, 0);
    }

    hide() {
        this.menu.classList.remove('show');
    }
}

// 创建全局右键菜单实例
const contextMenu = new ContextMenu();

// 通知函数
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 50px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 12px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-size: 13px;
        color: #1d1d1f;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// 创建新文件夹（桌面）
function createNewFolder() {
    const folderName = prompt('请输入文件夹名称:', '未命名文件夹');
    if (folderName && folderName.trim()) {
        // 在桌面上添加图标
        addFolderToDesktop(folderName);
        
        // 如果访达窗口打开且在桌面文件夹，也添加到访达
        const finderWindow = document.getElementById('finder-window');
        const finderTitle = finderWindow?.querySelector('.finder-title');
        
        if (finderWindow && finderWindow.style.display !== 'none' && 
            finderTitle && finderTitle.textContent === '桌面') {
            addFolderToFinder(folderName);
        }
        
        showNotification(`已创建文件夹: ${folderName}`);
    }
}

// 添加文件夹到桌面
function addFolderToDesktop(folderName) {
    const desktopIcons = document.getElementById('desktop-icons');
    if (!desktopIcons) return;
    
    const desktopIcon = document.createElement('div');
    desktopIcon.className = 'desktop-icon';
    desktopIcon.dataset.name = folderName;
    desktopIcon.innerHTML = `
        <img src="image/folder.png" alt="${folderName}">
        <span>${folderName}</span>
    `;
    
    // 双击打开文件夹
    desktopIcon.addEventListener('dblclick', function() {
        // 打开访达窗口并导航到该文件夹
        const finderWindow = document.getElementById('finder-window');
        const finderDockItem = document.querySelector('.dock-item[data-app="Finder"]');
        
        if (finderWindow && finderWindow.style.display === 'none') {
            finderDockItem?.click();
        }
        
        showNotification(`打开文件夹: ${folderName}`);
    });
    
    // 添加到桌面
    desktopIcons.appendChild(desktopIcon);
}

// 添加文件夹到访达窗口
function addFolderToFinder(folderName) {
    const finderWindow = document.getElementById('finder-window');
    const fileGrid = finderWindow?.querySelector('.file-grid');
    
    if (fileGrid) {
        const newFolder = document.createElement('div');
        newFolder.className = 'file-item';
        newFolder.dataset.name = folderName;
        newFolder.innerHTML = `
            <div class="file-icon"><img src="image/folder.png" alt="文件夹"></div>
            <div class="file-name">${folderName}</div>
        `;
        
        // 添加到文件网格的开头
        fileGrid.insertBefore(newFolder, fileGrid.firstChild);
        
        // 添加双击事件
        newFolder.addEventListener('dblclick', function() {
            console.log('打开文件夹:', folderName);
        });
        
        // 添加悬停效果
        newFolder.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 122, 255, 0.1)';
        });
        
        newFolder.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    }
}

// 更改背景
function changeBackground() {
    const backgrounds = [
        'image/macOS 26 Light.jpg',
        'image/macOS 26 Light.webp'
    ];
    const currentBg = document.querySelector('.bg img');
    const currentSrc = currentBg.src.split('/').pop();
    const nextBg = backgrounds.find(bg => !bg.includes(currentSrc)) || backgrounds[0];
    
    currentBg.style.transition = 'opacity 0.5s';
    currentBg.style.opacity = '0';
    
    setTimeout(() => {
        currentBg.src = nextBg;
        currentBg.style.opacity = '1';
        showNotification('桌面背景已更改');
    }, 500);
}

// 排序选项
function showSortOptions() {
    const sortOptions = ['名称', '种类', '修改日期', '创建日期', '大小'];
    const option = sortOptions[Math.floor(Math.random() * sortOptions.length)];
    showNotification(`按${option}排序`);
}

// 清理桌面
function cleanupDesktop() {
    showNotification('桌面已整理');
}

// 桌面右键菜单
document.addEventListener('contextmenu', (e) => {
    // 检查是否在桌面区域（不在窗口、菜单栏、Dock上）
    const isDesktop = !e.target.closest('.finder-window') &&
                      !e.target.closest('.menu-bar') &&
                      !e.target.closest('.dock-container') &&
                      !e.target.closest('.context-menu');

    if (isDesktop) {
        e.preventDefault();
        
        const desktopMenuItems = [
            { label: '新建文件夹', action: createNewFolder },
            { type: 'divider' },
            { label: '获取信息', shortcut: '⌘I', disabled: true },
            { label: '更改桌面背景...', action: changeBackground },
            { type: 'divider' },
            { label: '使用叠放', action: () => showNotification('叠放功能已启用') },
            { label: '排序方式', action: showSortOptions },
            { label: '清理', action: cleanupDesktop },
            { type: 'divider' },
            { label: '显示显示选项', action: () => showNotification('显示桌面选项') }
        ];

        contextMenu.show(e.clientX, e.clientY, desktopMenuItems);
    }
});

// 访达窗口右键菜单
document.addEventListener('contextmenu', (e) => {
    const finderWindow = e.target.closest('.finder-window');
    
    if (finderWindow) {
        e.preventDefault();
        
        // 检查是否点击在文件项上
        const fileItem = e.target.closest('.file-item');
        
        if (fileItem) {
            const fileName = fileItem.dataset.name;
            const fileType = fileItem.dataset.type;
            const finderTitle = finderWindow.querySelector('.finder-title');
            const currentFolder = finderTitle ? finderTitle.textContent : '';
            
            // 根据当前位置显示不同的菜单
            if (currentFolder === '废纸篓') {
                // 废纸篓中的右键菜单
                const trashMenuItems = [
                    { label: '放回原处', action: () => {
                        if (window.finderActions && window.finderActions.restoreFromTrash) {
                            window.finderActions.restoreFromTrash(fileName);
                            showNotification(`已恢复: ${fileName}`);
                        }
                    }},
                    { type: 'divider' },
                    { label: '永久删除', action: () => {
                        if (window.finderActions && window.finderActions.deletePermananently) {
                            window.finderActions.deletePermananently(fileName);
                        }
                    }},
                    { type: 'divider' },
                    { label: '获取信息', shortcut: '⌘I', action: () => {
                        showNotification(`文件名: ${fileName}\n类型: ${fileType}`);
                    }}
                ];
                
                contextMenu.show(e.clientX, e.clientY, trashMenuItems);
            } else {
                // 普通文件/文件夹右键菜单
                const fileMenuItems = [];
                
                // 如果是文件夹或磁盘，显示打开选项
                if (fileType === 'folder' || fileType === 'disk') {
                    fileMenuItems.push({ label: '打开', action: () => {
                        if (window.finderActions && window.finderActions.openFolder) {
                            window.finderActions.openFolder(fileName);
                        }
                    }});
                    fileMenuItems.push({ type: 'divider' });
                }
                
                fileMenuItems.push(
                    { label: '获取信息', shortcut: '⌘I', action: () => {
                        showNotification(`文件名: ${fileName}\n类型: ${fileType}`);
                    }},
                    { label: '重命名', action: () => {
                        const newName = prompt('请输入新名称:', fileName);
                        if (newName && newName.trim() && newName !== fileName) {
                            showNotification(`已重命名为: ${newName}`);
                        }
                    }},
                    { type: 'divider' },
                    { label: '复制', shortcut: '⌘C', action: () => showNotification('已复制') },
                    { type: 'divider' },
                    { label: '移到废纸篓', shortcut: '⌘⌫', action: () => {
                        if (window.finderActions && window.finderActions.moveToTrash) {
                            window.finderActions.moveToTrash(fileName, currentFolder);
                            showNotification(`已移到废纸篓: ${fileName}`);
                        }
                    }}
                );
                
                contextMenu.show(e.clientX, e.clientY, fileMenuItems);
            }
        } else if (e.target.closest('.finder-files') || e.target.closest('.file-grid')) {
            // 空白区域右键菜单
            const finderTitle = finderWindow.querySelector('.finder-title');
            const currentFolder = finderTitle ? finderTitle.textContent : '';
            
            // 检查是否可以新建文件夹
            const canCreateFolder = !['个人收藏', '应用程序', 'iCloud 云盘', '磁盘', '废纸篓'].includes(currentFolder);
            
            const emptyAreaMenuItems = [
                { 
                    label: '新建文件夹', 
                    shortcut: '⇧⌘N', 
                    disabled: !canCreateFolder,
                    action: () => {
                        if (window.finderActions && window.finderActions.createNewFolder) {
                            window.finderActions.createNewFolder();
                        }
                    }
                },
                { type: 'divider' },
                { label: '获取信息', shortcut: '⌘I', disabled: true },
                { type: 'divider' },
                { label: '粘贴', shortcut: '⌘V', disabled: true },
                { label: '全选', shortcut: '⌘A', action: () => showNotification('已全选') },
                { type: 'divider' },
                { label: '显示显示选项', action: () => showNotification('显示选项') }
            ];
            
            contextMenu.show(e.clientX, e.clientY, emptyAreaMenuItems);
        }
    }
});
