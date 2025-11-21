// 访达窗口交互脚本

document.addEventListener('DOMContentLoaded', function() {
    const finderWindow = document.getElementById('finder-window');
    const finderDockItem = document.querySelector('.dock-item[data-app="Finder"]');
    const closeBtn = finderWindow?.querySelector('.control-btn.close');
    const minimizeBtn = finderWindow?.querySelector('.control-btn.minimize');
    const maximizeBtn = finderWindow?.querySelector('.control-btn.maximize');
    const titlebar = finderWindow?.querySelector('.finder-titlebar');
    const sidebar = finderWindow?.querySelector('.finder-sidebar');
    
    let isDragging = false;
    let isMaximized = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let currentView = 'grid'; // 当前视图模式
    
    // 窗口大小调整相关变量
    let isResizing = false;
    let resizeDirection = '';
    let startWidth, startHeight, startX, startY, startLeft, startTop;
    
    // 保存原始尺寸和位置
    let originalSize = {
        width: '900px',
        height: '550px',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)'
    };
    
    // 点击 Dock 中的访达图标打开/关闭窗口
    if (finderDockItem && finderWindow) {
        finderDockItem.addEventListener('click', function() {
            if (finderWindow.style.display === 'none' || !finderWindow.style.display) {
                finderWindow.style.display = 'flex';
                finderWindow.style.opacity = '0';
                finderWindow.style.transform = 'translateX(-50%) scale(0.1)';
                finderWindow.offsetHeight;
                finderWindow.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease';
                finderWindow.style.transform = 'translateX(-50%) scale(1)';
                finderWindow.style.opacity = '1';
                setTimeout(() => {
                    finderWindow.style.transition = '';
                }, 400);
            } else {
                finderWindow.style.display = 'none';
            }
        });
    }
    
    // 关闭按钮
    if (closeBtn && finderWindow) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isMaximized) {
                const menuBar = document.querySelector('.menu-bar');
                const dockContainer = document.querySelector('.dock-container');
                if (menuBar) {
                    menuBar.style.transition = '';
                    menuBar.style.transform = 'translateY(0)';
                    menuBar.style.opacity = '1';
                }
                if (dockContainer) {
                    dockContainer.style.transition = '';
                    dockContainer.style.transform = 'translateX(-50%) translateY(0)';
                    dockContainer.style.opacity = '1';
                }
                finderWindow.style.transition = '';
                finderWindow.style.width = originalSize.width;
                finderWindow.style.height = originalSize.height;
                finderWindow.style.top = originalSize.top;
                finderWindow.style.left = originalSize.left;
                finderWindow.style.transform = originalSize.transform;
                finderWindow.style.borderRadius = '10px';
                isMaximized = false;
                xOffset = 0;
                yOffset = 0;
            }
            finderWindow.style.display = 'none';
        });
    }

    // 最小化按钮
    if (minimizeBtn && finderWindow) {
        minimizeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const menuBar = document.querySelector('.menu-bar');
            const dockContainer = document.querySelector('.dock-container');
            
            if (isMaximized) {
                if (menuBar) {
                    menuBar.style.transition = '';
                    menuBar.style.transform = 'translateY(0)';
                    menuBar.style.opacity = '1';
                }
                if (dockContainer) {
                    dockContainer.style.transition = '';
                    dockContainer.style.transform = 'translateX(-50%) translateY(0)';
                    dockContainer.style.opacity = '1';
                }
                finderWindow.style.transition = '';
                finderWindow.style.width = originalSize.width;
                finderWindow.style.height = originalSize.height;
                finderWindow.style.top = originalSize.top;
                finderWindow.style.left = originalSize.left;
                finderWindow.style.transform = originalSize.transform;
                finderWindow.style.borderRadius = '10px';
                isMaximized = false;
                requestAnimationFrame(() => {
                    performMinimize();
                });
            } else {
                performMinimize();
            }
            
            function performMinimize() {
                const dockIcon = document.querySelector('.dock-item[data-app="Finder"]');
                if (!dockIcon) {
                    finderWindow.style.display = 'none';
                    return;
                }
                const windowRect = finderWindow.getBoundingClientRect();
                const iconRect = dockIcon.getBoundingClientRect();
                finderWindow.classList.add('minimizing');
                const scaleX = iconRect.width / windowRect.width;
                const scaleY = iconRect.height / windowRect.height;
                const translateX = iconRect.left + iconRect.width / 2 - (windowRect.left + windowRect.width / 2);
                const translateY = iconRect.top + iconRect.height / 2 - (windowRect.top + windowRect.height / 2);
                finderWindow.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease';
                finderWindow.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
                finderWindow.style.opacity = '0';
                setTimeout(() => {
                    finderWindow.style.display = 'none';
                    finderWindow.classList.remove('minimizing');
                    finderWindow.style.transition = '';
                    finderWindow.style.transform = '';
                    finderWindow.style.opacity = '1';
                }, 400);
            }
        });
    }
    
    // 最大化/还原按钮
    if (maximizeBtn && finderWindow) {
        maximizeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const menuBar = document.querySelector('.menu-bar');
            const dockContainer = document.querySelector('.dock-container');
            finderWindow.style.transition = 'width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease, border-radius 0.3s ease, transform 0.3s ease';
            
            if (!isMaximized) {
                const currentStyles = window.getComputedStyle(finderWindow);
                const currentWidth = finderWindow.style.width || currentStyles.width;
                const currentHeight = finderWindow.style.height || currentStyles.height;
                const currentTop = finderWindow.style.top || currentStyles.top;
                const currentLeft = finderWindow.style.left || currentStyles.left;
                const currentTransform = finderWindow.style.transform || currentStyles.transform;
                
                if (currentWidth !== '880px' || currentTop !== '60px' || currentTransform !== 'translateX(-50%)') {
                    originalSize = {
                        width: currentWidth,
                        height: currentHeight,
                        top: currentTop,
                        left: currentLeft,
                        transform: currentTransform === 'none' ? '' : currentTransform
                    };
                }
                
                if (menuBar) {
                    menuBar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    menuBar.style.transform = 'translateY(-100%)';
                    menuBar.style.opacity = '0';
                }
                if (dockContainer) {
                    dockContainer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    dockContainer.style.transform = 'translateX(-50%) translateY(100%)';
                    dockContainer.style.opacity = '0';
                }
                
                finderWindow.style.width = '100vw';
                finderWindow.style.height = '100vh';
                finderWindow.style.top = '0';
                finderWindow.style.left = '0';
                finderWindow.style.transform = 'none';
                finderWindow.style.borderRadius = '0';
                isMaximized = true;
            } else {
                if (menuBar) {
                    menuBar.style.transform = 'translateY(0)';
                    menuBar.style.opacity = '1';
                }
                if (dockContainer) {
                    dockContainer.style.transform = 'translateX(-50%) translateY(0)';
                    dockContainer.style.opacity = '1';
                }
                
                finderWindow.style.width = originalSize.width;
                finderWindow.style.height = originalSize.height;
                finderWindow.style.top = originalSize.top;
                finderWindow.style.left = originalSize.left;
                finderWindow.style.transform = originalSize.transform || 'translateX(-50%)';
                finderWindow.style.borderRadius = '10px';
                isMaximized = false;
                xOffset = 0;
                yOffset = 0;
            }
            
            setTimeout(() => {
                finderWindow.style.transition = '';
                if (menuBar) menuBar.style.transition = '';
                if (dockContainer) dockContainer.style.transition = '';
            }, 300);
        });
    }

    // 拖动功能 - 使用侧栏和整个标题栏区域
    if (finderWindow) {
        if (titlebar) {
            titlebar.addEventListener('mousedown', dragStart);
        }
        if (sidebar) {
            sidebar.addEventListener('mousedown', function(e) {
                // 只在侧栏顶部区域（红绿灯附近）允许拖动
                if (e.target === sidebar || e.target.classList.contains('window-controls')) {
                    dragStart(e);
                }
            });
        }
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }
    
    function dragStart(e) {
        if (e.target.classList.contains('control-btn') || e.target.classList.contains('toolbar-btn') || 
            e.target.classList.contains('sidebar-item') || e.target.classList.contains('sidebar-label')) {
            return;
        }
        
        if (isMaximized) {
            isMaximized = false;
            const menuBar = document.querySelector('.menu-bar');
            const dockContainer = document.querySelector('.dock-container');
            if (menuBar) {
                menuBar.style.transition = '';
                menuBar.style.transform = 'translateY(0)';
                menuBar.style.opacity = '1';
            }
            if (dockContainer) {
                dockContainer.style.transition = '';
                dockContainer.style.transform = 'translateX(-50%) translateY(0)';
                dockContainer.style.opacity = '1';
            }
            
            finderWindow.style.transition = '';
            finderWindow.style.width = originalSize.width;
            finderWindow.style.height = originalSize.height;
            finderWindow.style.borderRadius = '10px';
            const mouseXPercent = e.clientX / window.innerWidth;
            finderWindow.style.left = e.clientX - (parseInt(originalSize.width) * mouseXPercent) + 'px';
            finderWindow.style.top = e.clientY - 26 + 'px';
            finderWindow.style.transform = 'none';
            xOffset = 0;
            yOffset = 0;
        }
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if ((titlebar && (e.target === titlebar || titlebar.contains(e.target))) || 
            (sidebar && e.target === sidebar) || 
            e.target.classList.contains('window-controls')) {
            isDragging = true;
            finderWindow.style.cursor = 'grabbing';
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            finderWindow.style.transition = '';
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            const rect = finderWindow.getBoundingClientRect();
            let newLeft = rect.left + currentX;
            let newTop = rect.top + currentY;
            const titlebarHeight = titlebar.offsetHeight;
            const minLeft = 0;
            const maxLeft = window.innerWidth - rect.width;
            const minTop = 0;
            const maxTop = window.innerHeight - titlebarHeight;
            newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
            newTop = Math.max(minTop, Math.min(newTop, maxTop));
            finderWindow.style.left = newLeft + 'px';
            finderWindow.style.top = newTop + 'px';
            finderWindow.style.transform = 'none';
            initialX = e.clientX;
            initialY = e.clientY;
        }
    }
    
    function dragEnd() {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            finderWindow.style.cursor = 'default';
        }
    }
    
    // 窗口大小调整功能
    function createResizeHandles() {
        if (!finderWindow) return;
        
        // 先移除已存在的调整区域
        finderWindow.querySelectorAll('.resize-handle').forEach(el => el.remove());
        
        // 创建8个调整大小的区域（四边 + 四角）
        const handles = [
            { name: 'top', cursor: 'ns-resize' },
            { name: 'right', cursor: 'ew-resize' },
            { name: 'bottom', cursor: 'ns-resize' },
            { name: 'left', cursor: 'ew-resize' },
            { name: 'top-left', cursor: 'nwse-resize' },
            { name: 'top-right', cursor: 'nesw-resize' },
            { name: 'bottom-left', cursor: 'nesw-resize' },
            { name: 'bottom-right', cursor: 'nwse-resize' }
        ];
        
        handles.forEach(handle => {
            const div = document.createElement('div');
            div.className = `resize-handle resize-${handle.name}`;
            div.style.cursor = handle.cursor;
            // 直接添加到 finderWindow，作为第一个子元素
            finderWindow.insertBefore(div, finderWindow.firstChild);
        });
    }
    
    function startResize(e, direction) {
        if (isMaximized) return;
        
        isResizing = true;
        resizeDirection = direction;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = finderWindow.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = rect.left;
        startTop = rect.top;
        
        e.preventDefault();
        e.stopPropagation();
    }
    
    function doResize(e) {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const minWidth = 600;
        const minHeight = 400;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;
        
        // 根据调整方向计算新的尺寸和位置
        if (resizeDirection.includes('right')) {
            newWidth = Math.max(minWidth, startWidth + deltaX);
        }
        if (resizeDirection.includes('left')) {
            const potentialWidth = startWidth - deltaX;
            if (potentialWidth >= minWidth) {
                newWidth = potentialWidth;
                newLeft = startLeft + deltaX;
            }
        }
        if (resizeDirection.includes('bottom')) {
            newHeight = Math.max(minHeight, startHeight + deltaY);
        }
        if (resizeDirection.includes('top')) {
            const potentialHeight = startHeight - deltaY;
            if (potentialHeight >= minHeight) {
                newHeight = potentialHeight;
                newTop = startTop + deltaY;
            }
        }
        
        // 应用新的尺寸和位置
        finderWindow.style.width = newWidth + 'px';
        finderWindow.style.height = newHeight + 'px';
        finderWindow.style.left = newLeft + 'px';
        finderWindow.style.top = newTop + 'px';
        finderWindow.style.transform = 'none';
    }
    
    function stopResize() {
        if (isResizing) {
            isResizing = false;
            resizeDirection = '';
            
            // 更新原始尺寸，以便最大化后能正确还原
            const rect = finderWindow.getBoundingClientRect();
            originalSize = {
                width: rect.width + 'px',
                height: rect.height + 'px',
                top: rect.top + 'px',
                left: rect.left + 'px',
                transform: 'none'
            };
        }
    }
    
    // 初始化调整大小功能
    createResizeHandles();
    
    // 为调整大小的区域添加事件监听
    const resizeHandles = finderWindow.querySelectorAll('.resize-handle');
    resizeHandles.forEach(handle => {
        handle.addEventListener('mousedown', function(e) {
            const direction = this.className.replace('resize-handle resize-', '');
            startResize(e, direction);
        });
    });
    
    // 全局鼠标移动和释放事件
    document.addEventListener('mousemove', function(e) {
        if (isResizing) {
            doResize(e);
        }
    });
    
    document.addEventListener('mouseup', function() {
        stopResize();
    });

    // 侧边栏和文件管理
    const sidebarItems = finderWindow?.querySelectorAll('.sidebar-item');
    const finderTitle = finderWindow?.querySelector('.finder-title');
    const finderFiles = finderWindow?.querySelector('.finder-files');
    
    // 文件夹内容
    const folderContents = {
        '个人收藏': [
            { name: '应用程序', type: 'folder', image: 'image/folder.png' },
            { name: '桌面', type: 'folder', image: 'image/folder.png' },
            { name: '文稿', type: 'folder', image: 'image/folder.png' },
            { name: '下载', type: 'folder', image: 'image/folder.png' },
            { name: '图片', type: 'folder', image: 'image/folder.png' },
            { name: '音乐', type: 'folder', image: 'image/folder.png' },
            { name: '视频', type: 'folder', image: 'image/folder.png' }
        ],
        '应用程序': [
            { name: 'Safari', type: 'app', image: 'image/Safari.png' },
            { name: '邮件', type: 'app', image: 'image/mail.png' },
            { name: '信息', type: 'app', image: 'image/messages.png' },
            { name: '照片', type: 'app', image: 'image/photos.png' },
            { name: '备忘录', type: 'app', image: 'image/notes.png' },
            { name: '计算器', type: 'app', image: 'image/Calculator.png' },
            { name: '终端', type: 'app', image: 'image/terminal.png' },
            { name: '系统设置', type: 'app', image: 'image/Settings.png' }
        ],
        '桌面': [
            { name: '未命名文件夹', type: 'folder', image: 'image/folder.png' },
            { name: '项目文档.pdf', type: 'file', icon: 'document' }
        ],
        '文稿': [
            { name: '工作文件', type: 'folder', image: 'image/folder.png' },
            { name: '个人文件', type: 'folder', image: 'image/folder.png' },
            { name: '报告.docx', type: 'file', icon: 'document' },
            { name: '演示文稿.pptx', type: 'file', icon: 'document' }
        ],
        '下载': [
            { name: 'macOS安装包.dmg', type: 'file', icon: 'disk' },
            { name: '图片素材.zip', type: 'file', icon: 'archive' },
            { name: '文档.pdf', type: 'file', icon: 'document' }
        ],
        '图片': [
            { name: '2024年照片', type: 'folder', image: 'image/folder.png' },
            { name: '截图', type: 'folder', image: 'image/folder.png' },
            { name: 'IMG_001.jpg', type: 'file', icon: 'image' },
            { name: 'IMG_002.jpg', type: 'file', icon: 'image' }
        ],
        '音乐': [
            { name: '我的播放列表', type: 'folder', image: 'image/folder.png' },
            { name: '歌曲1.mp3', type: 'file', icon: 'music' },
            { name: '歌曲2.mp3', type: 'file', icon: 'music' }
        ],
        '视频': [
            { name: '电影', type: 'folder', image: 'image/folder.png' },
            { name: '录屏', type: 'folder', image: 'image/folder.png' },
            { name: '视频1.mp4', type: 'file', icon: 'video' }
        ],
        'iCloud 云盘': [
            { name: '文稿', type: 'folder', image: 'image/folder.png' },
            { name: '桌面', type: 'folder', image: 'image/folder.png' }
        ],
        '磁盘': [
            { name: 'Macintosh HD', type: 'disk', icon: 'disk', size: '500 GB' },
            { name: 'Time Machine', type: 'disk', icon: 'disk', size: '1 TB' }
        ],
        'Macintosh HD': [
            { name: '应用程序', type: 'folder', image: 'image/folder.png' },
            { name: '系统', type: 'folder', image: 'image/folder.png' },
            { name: '用户', type: 'folder', image: 'image/folder.png' },
            { name: '资源库', type: 'folder', image: 'image/folder.png' }
        ],
        'Time Machine': [
            { name: '备份 2024-11-20', type: 'folder', image: 'image/folder.png' },
            { name: '备份 2024-11-19', type: 'folder', image: 'image/folder.png' },
            { name: '备份 2024-11-18', type: 'folder', image: 'image/folder.png' }
        ],
        '未命名文件夹': [],
        '工作文件': [
            { name: '项目A', type: 'folder', image: 'image/folder.png' },
            { name: '会议记录.docx', type: 'file', icon: 'document' }
        ],
        '个人文件': [
            { name: '照片', type: 'folder', image: 'image/folder.png' },
            { name: '笔记.txt', type: 'file', icon: 'document' }
        ],
        '2024年照片': [
            { name: 'IMG_003.jpg', type: 'file', icon: 'image' },
            { name: 'IMG_004.jpg', type: 'file', icon: 'image' }
        ],
        '截图': [
            { name: '截屏2024-11-20.png', type: 'file', icon: 'image' }
        ],
        '我的播放列表': [
            { name: '歌曲3.mp3', type: 'file', icon: 'music' }
        ],
        '电影': [
            { name: '电影1.mp4', type: 'file', icon: 'video' }
        ],
        '录屏': [
            { name: '录屏2024-11-20.mov', type: 'file', icon: 'video' }
        ],
        '废纸篓': []
    };

    // SVG 图标
    function getIconSVG(iconType) {
        const icons = {
            document: '<svg viewBox="0 0 64 64" fill="none"><path d="M16 8C14.8954 8 14 8.89543 14 10V54C14 55.1046 14.8954 56 16 56H48C49.1046 56 50 55.1046 50 54V20L38 8H16Z" fill="white"/><path d="M38 8V18C38 19.1046 38.8954 20 40 20H50L38 8Z" fill="#E8E8E8"/><path d="M16 8C14.8954 8 14 8.89543 14 10V54C14 55.1046 14.8954 56 16 56H48C49.1046 56 50 55.1046 50 54V20L38 8H16Z" stroke="#007AFF" stroke-width="2"/><line x1="20" y1="28" x2="44" y2="28" stroke="#007AFF" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="36" x2="44" y2="36" stroke="#007AFF" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="44" x2="36" y2="44" stroke="#007AFF" stroke-width="2" stroke-linecap="round"/></svg>',
            image: '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="8" width="48" height="48" rx="4" fill="url(#imageGradient)"/><circle cx="22" cy="22" r="6" fill="white" opacity="0.9"/><path d="M8 48L20 36L32 44L44 32L56 44V52C56 54.2091 54.2091 56 52 56H12C9.79086 56 8 54.2091 8 52V48Z" fill="white" opacity="0.8"/><defs><linearGradient id="imageGradient" x1="32" y1="8" x2="32" y2="56"><stop stop-color="#FF6B9D"/><stop offset="1" stop-color="#C44569"/></linearGradient></defs></svg>',
            music: '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="8" width="48" height="48" rx="4" fill="url(#musicGradient)"/><path d="M42 16V38C42 41.3137 39.3137 44 36 44C32.6863 44 30 41.3137 30 38C30 34.6863 32.6863 32 36 32C37.1046 32 38.1362 32.2929 39.0278 32.8056L42 34V22L26 26V44C26 47.3137 23.3137 50 20 50C16.6863 50 14 47.3137 14 44C14 40.6863 16.6863 38 20 38C21.1046 38 22.1362 38.2929 23.0278 38.8056L26 40V20L42 16Z" fill="white"/><defs><linearGradient id="musicGradient" x1="32" y1="8" x2="32" y2="56"><stop stop-color="#FF6B9D"/><stop offset="1" stop-color="#FE5196"/></linearGradient></defs></svg>',
            video: '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="8" width="48" height="48" rx="4" fill="url(#videoGradient)"/><path d="M26 22L42 32L26 42V22Z" fill="white"/><defs><linearGradient id="videoGradient" x1="32" y1="8" x2="32" y2="56"><stop stop-color="#A29BFE"/><stop offset="1" stop-color="#6C5CE7"/></linearGradient></defs></svg>',
            disk: '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" fill="url(#diskGradient)"/><circle cx="32" cy="32" r="8" fill="white" opacity="0.9"/><circle cx="32" cy="32" r="4" fill="url(#diskGradient)"/><defs><linearGradient id="diskGradient" x1="32" y1="8" x2="32" y2="56"><stop stop-color="#DFE6E9"/><stop offset="1" stop-color="#B2BEC3"/></linearGradient></defs></svg>',
            archive: '<svg viewBox="0 0 64 64" fill="none"><path d="M16 8C14.8954 8 14 8.89543 14 10V54C14 55.1046 14.8954 56 16 56H48C49.1046 56 50 55.1046 50 54V10C50 8.89543 49.1046 8 48 8H16Z" fill="url(#archiveGradient)"/><rect x="26" y="12" width="12" height="4" fill="white" opacity="0.8"/><rect x="26" y="20" width="12" height="4" fill="white" opacity="0.8"/><rect x="26" y="28" width="12" height="4" fill="white" opacity="0.8"/><path d="M26 36H38V48H26V36Z" fill="white" opacity="0.9"/><defs><linearGradient id="archiveGradient" x1="32" y1="8" x2="32" y2="56"><stop stop-color="#FDCB6E"/><stop offset="1" stop-color="#E17055"/></linearGradient></defs></svg>'
        };
        return icons[iconType] || '';
    }
    
    // 应用视图样式
    function applyViewStyle() {
        const fileGrid = finderFiles?.querySelector('.file-grid');
        if (!fileGrid) return;
        
        if (currentView === 'grid') {
            fileGrid.classList.remove('list-mode');
            fileGrid.classList.add('grid-mode');
            finderFiles.classList.remove('list-view');
            finderFiles.classList.add('grid-view');
            
            fileGrid.style.display = 'grid';
            fileGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(90px, 1fr))';
            fileGrid.style.gap = '16px';
            fileGrid.style.flexDirection = '';
            const fileItems = fileGrid.querySelectorAll('.file-item');
            fileItems.forEach(item => {
                item.style.flexDirection = 'column';
                item.style.padding = '12px';
                item.style.alignItems = 'center';
                item.style.gap = '8px';
                item.style.borderRadius = '12px';
                item.style.borderBottom = 'none';
                item.style.minHeight = '';
                item.style.background = '';
                const icon = item.querySelector('.file-icon, .file-icon-svg');
                if (icon) {
                    icon.style.width = '64px';
                    icon.style.height = '64px';
                }
                const img = item.querySelector('img');
                if (img) {
                    img.style.width = '64px';
                    img.style.height = '64px';
                }
                const name = item.querySelector('.file-name');
                if (name) {
                    name.style.textAlign = 'center';
                    name.style.flex = '';
                    name.style.fontSize = '12px';
                }
            });
        } else {
            fileGrid.classList.remove('grid-mode');
            fileGrid.classList.add('list-mode');
            finderFiles.classList.remove('grid-view');
            finderFiles.classList.add('list-view');
            
            fileGrid.style.display = 'flex';
            fileGrid.style.flexDirection = 'column';
            fileGrid.style.gap = '0';
            fileGrid.style.gridTemplateColumns = '';
            const fileItems = fileGrid.querySelectorAll('.file-item');
            fileItems.forEach((item, index) => {
                item.style.flexDirection = 'row';
                item.style.padding = '2px 12px';
                item.style.alignItems = 'center';
                item.style.gap = '8px';
                item.style.borderRadius = '0';
                item.style.borderBottom = 'none';
                item.style.minHeight = '24px';
                // 斑马纹：奇数行白色，偶数行灰色
                item.style.background = index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.03)';
                const icon = item.querySelector('.file-icon, .file-icon-svg');
                if (icon) {
                    icon.style.width = '20px';
                    icon.style.height = '20px';
                }
                const img = item.querySelector('img');
                if (img) {
                    img.style.width = '20px';
                    img.style.height = '20px';
                }
                const name = item.querySelector('.file-name');
                if (name) {
                    name.style.textAlign = 'left';
                    name.style.flex = '1';
                    name.style.fontSize = '12px';
                }
            });
        }
    }
    
    // 渲染文件
    function renderFiles(folderName) {
        const files = folderContents[folderName] || [];
        const fileGrid = finderFiles?.querySelector('.file-grid');
        if (!fileGrid) return;
        
        if (files.length === 0 && folderName !== '废纸篓') {
            fileGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #86868b;">此文件夹为空</div>';
            return;
        }
        
        if (folderName === '废纸篓' && files.length === 0) {
            fileGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #86868b;">废纸篓为空</div>';
            return;
        }
        
        fileGrid.innerHTML = files.map(file => `
            <div class="file-item" data-name="${file.name}" data-type="${file.type}">
                ${file.image ? 
                    `<div class="file-icon"><img src="${file.image}" alt="${file.name}"></div>` : 
                    `<div class="file-icon-svg">${getIconSVG(file.icon)}</div>`
                }
                <div class="file-name">${file.name}</div>
                ${file.size ? `<div class="file-size">${file.size}</div>` : ''}
            </div>
        `).join('');
        
        applyViewStyle();
        
        // 双击打开文件夹或磁盘
        fileGrid.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('dblclick', function() {
                const fileName = this.dataset.name;
                const fileType = this.dataset.type;
                
                // 如果是文件夹或磁盘，尝试打开
                if ((fileType === 'folder' || fileType === 'disk') && folderContents[fileName] !== undefined) {
                    openFolder(fileName);
                }
            });
        });
    }
    
    // 打开文件夹
    function openFolder(folderName) {
        // 检查是否在侧边栏中
        const targetItem = Array.from(sidebarItems).find(
            si => si.textContent.trim() === folderName
        );
        
        if (targetItem) {
            targetItem.click();
        } else {
            // 不在侧边栏，直接打开
            if (finderTitle) finderTitle.textContent = folderName;
            
            if (history[historyIndex] !== folderName) {
                history = history.slice(0, historyIndex + 1);
                history.push(folderName);
                historyIndex = history.length - 1;
                updateNavigationButtons();
            }
            renderFiles(folderName);
        }
    }
    
    // 移到废纸篓
    function moveToTrash(fileName, fromFolder) {
        const files = folderContents[fromFolder];
        const fileIndex = files.findIndex(f => f.name === fileName);
        
        if (fileIndex !== -1) {
            const file = files.splice(fileIndex, 1)[0];
            file.originalFolder = fromFolder; // 记录原始位置
            folderContents['废纸篓'].push(file);
            renderFiles(fromFolder);
        }
    }
    
    // 从废纸篓恢复
    function restoreFromTrash(fileName) {
        const trashFiles = folderContents['废纸篓'];
        const fileIndex = trashFiles.findIndex(f => f.name === fileName);
        
        if (fileIndex !== -1) {
            const file = trashFiles.splice(fileIndex, 1)[0];
            const originalFolder = file.originalFolder || '桌面';
            delete file.originalFolder;
            
            if (!folderContents[originalFolder]) {
                folderContents[originalFolder] = [];
            }
            folderContents[originalFolder].push(file);
            renderFiles('废纸篓');
        }
    }
    
    // 永久删除
    function deletePermananently(fileName) {
        if (confirm(`确定要永久删除"${fileName}"吗？此操作无法撤销。`)) {
            const trashFiles = folderContents['废纸篓'];
            const fileIndex = trashFiles.findIndex(f => f.name === fileName);
            
            if (fileIndex !== -1) {
                trashFiles.splice(fileIndex, 1);
                renderFiles('废纸篓');
            }
        }
    }

    // 侧边栏点击
    let history = ['个人收藏'];
    let historyIndex = 0;
    
    sidebarItems?.forEach(item => {
        item.addEventListener('click', function() {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const folderName = this.querySelector('span').textContent;
            if (finderTitle) finderTitle.textContent = folderName;
            
            if (history[historyIndex] !== folderName) {
                history = history.slice(0, historyIndex + 1);
                history.push(folderName);
                historyIndex = history.length - 1;
                updateNavigationButtons();
            }
            renderFiles(folderName);
        });
    });
    
    // 导航按钮
    const backBtn = finderWindow?.querySelector('.finder-titlebar-left .finder-toolbar .toolbar-btn:nth-child(1)');
    const forwardBtn = finderWindow?.querySelector('.finder-titlebar-left .finder-toolbar .toolbar-btn:nth-child(2)');
    const newFolderBtn = finderWindow?.querySelector('.new-folder-btn');
    
    function updateNavigationButtons() {
        if (backBtn) {
            backBtn.disabled = historyIndex <= 0;
            backBtn.style.opacity = historyIndex <= 0 ? '0.3' : '1';
        }
        if (forwardBtn) {
            forwardBtn.disabled = historyIndex >= history.length - 1;
            forwardBtn.style.opacity = historyIndex >= history.length - 1 ? '0.3' : '1';
        }
    }
    
    backBtn?.addEventListener('click', function() {
        if (historyIndex > 0) {
            historyIndex--;
            const folderName = history[historyIndex];
            const targetItem = Array.from(sidebarItems).find(
                item => item.querySelector('span').textContent === folderName
            );
            if (targetItem) {
                sidebarItems.forEach(i => i.classList.remove('active'));
                targetItem.classList.add('active');
                if (finderTitle) finderTitle.textContent = folderName;
                renderFiles(folderName);
                updateNavigationButtons();
            }
        }
    });
    
    forwardBtn?.addEventListener('click', function() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            const folderName = history[historyIndex];
            const targetItem = Array.from(sidebarItems).find(
                item => item.querySelector('span').textContent === folderName
            );
            if (targetItem) {
                sidebarItems.forEach(i => i.classList.remove('active'));
                targetItem.classList.add('active');
                if (finderTitle) finderTitle.textContent = folderName;
                renderFiles(folderName);
                updateNavigationButtons();
            }
        }
    });
    
    // 新建文件夹
    newFolderBtn?.addEventListener('click', function() {
        const currentFolder = finderTitle?.textContent || '个人收藏';
        
        // 不允许在某些特殊文件夹中新建
        if (['个人收藏', '应用程序', 'iCloud 云盘', '磁盘', '废纸篓'].includes(currentFolder)) {
            alert('无法在此位置创建文件夹');
            return;
        }
        
        // 生成新文件夹名称
        let folderNum = 1;
        let newFolderName = '未命名文件夹';
        const files = folderContents[currentFolder] || [];
        
        while (files.some(f => f.name === newFolderName)) {
            folderNum++;
            newFolderName = `未命名文件夹 ${folderNum}`;
        }
        
        // 添加新文件夹
        const newFolder = {
            name: newFolderName,
            type: 'folder',
            image: 'image/folder.png'
        };
        
        files.push(newFolder);
        folderContents[newFolderName] = []; // 创建空文件夹内容
        renderFiles(currentFolder);
    });
    
    // 视图切换
    const iconViewBtn = finderWindow?.querySelector('.view-btn-grid');
    const listViewBtn = finderWindow?.querySelector('.view-btn-list');
    
    iconViewBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentView === 'grid') return; // 已经是图标视图，不重复操作
        currentView = 'grid';
        iconViewBtn.classList.add('active');
        listViewBtn?.classList.remove('active');
        applyViewStyle();
    });
    
    listViewBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentView === 'list') return; // 已经是列表视图，不重复操作
        currentView = 'list';
        listViewBtn.classList.add('active');
        iconViewBtn?.classList.remove('active');
        applyViewStyle();
    });
    
    // 排序下拉菜单
    const sortBtn = finderWindow?.querySelector('.sort-btn');
    const sortMenu = finderWindow?.querySelector('.finder-sort-menu');
    const sortMenuItems = finderWindow?.querySelectorAll('.sort-menu-item');
    let sortOrder = 'name-asc';
    
    // 点击排序按钮显示/隐藏菜单
    sortBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        sortMenu?.classList.toggle('show');
    });
    
    // 点击菜单项
    sortMenuItems?.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            sortOrder = this.dataset.sort;
            
            // 更新激活状态
            sortMenuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 排序文件
            const currentFolder = finderTitle?.textContent || '个人收藏';
            const files = [...(folderContents[currentFolder] || [])];
            
            if (sortOrder === 'name-asc') {
                files.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
            } else if (sortOrder === 'name-desc') {
                files.sort((a, b) => b.name.localeCompare(a.name, 'zh-CN'));
            } else if (sortOrder === 'type') {
                files.sort((a, b) => {
                    if (a.type === b.type) return a.name.localeCompare(b.name, 'zh-CN');
                    return a.type.localeCompare(b.type);
                });
            } else if (sortOrder === 'date') {
                // 日期排序（这里简单按名称排序，实际应该按日期）
                files.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
            }
            
            folderContents[currentFolder] = files;
            renderFiles(currentFolder);
            sortMenu?.classList.remove('show');
        });
    });
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', function() {
        sortMenu?.classList.remove('show');
    });
    
    // 搜索功能 - 点击展开/收起
    const searchContainer = finderWindow?.querySelector('.finder-titlebar-search');
    const searchToggleBtn = finderWindow?.querySelector('.search-toggle-btn');
    const searchInput = finderWindow?.querySelector('.search-input');
    
    // 初始化为收起状态
    searchContainer?.classList.add('collapsed');
    
    // 点击搜索按钮展开/收起
    searchToggleBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        if (searchContainer?.classList.contains('collapsed')) {
            searchContainer.classList.remove('collapsed');
            searchContainer.classList.add('expanded');
            setTimeout(() => searchInput?.focus(), 300);
        } else {
            searchContainer.classList.remove('expanded');
            searchContainer.classList.add('collapsed');
            searchInput.value = '';
            const currentFolder = finderTitle?.textContent || '个人收藏';
            renderFiles(currentFolder);
        }
    });
    
    // 搜索输入
    searchInput?.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const currentFolder = finderTitle?.textContent || '个人收藏';
        
        if (!searchTerm) {
            renderFiles(currentFolder);
            return;
        }
        
        const files = folderContents[currentFolder] || [];
        const filteredFiles = files.filter(file => 
            file.name.toLowerCase().includes(searchTerm)
        );
        
        const fileGrid = finderFiles?.querySelector('.file-grid');
        if (!fileGrid) return;
        
        if (filteredFiles.length === 0) {
            fileGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #86868b;">未找到匹配项</div>';
        } else {
            fileGrid.innerHTML = filteredFiles.map(file => `
                <div class="file-item" data-name="${file.name}">
                    ${file.image ? 
                        `<div class="file-icon"><img src="${file.image}" alt="${file.name}"></div>` : 
                        `<div class="file-icon-svg">${getIconSVG(file.icon)}</div>`
                    }
                    <div class="file-name">${file.name}</div>
                    ${file.size ? `<div class="file-size">${file.size}</div>` : ''}
                </div>
            `).join('');
            applyViewStyle();
        }
    });
    
    // ESC键收起搜索
    searchInput?.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchContainer?.classList.remove('expanded');
            searchContainer?.classList.add('collapsed');
            this.value = '';
            const currentFolder = finderTitle?.textContent || '个人收藏';
            renderFiles(currentFolder);
            this.blur();
        }
    });
    
    // 初始化
    renderFiles('个人收藏');
    updateNavigationButtons();
    // 默认激活图标视图
    iconViewBtn?.classList.add('active');
    // 默认激活名称升序排序
    sortMenuItems?.forEach(item => {
        if (item.dataset.sort === 'name-asc') {
            item.classList.add('active');
        }
    });
    
    // 导出函数供右键菜单使用
    window.finderActions = {
        openFolder: openFolder,
        moveToTrash: moveToTrash,
        restoreFromTrash: restoreFromTrash,
        deletePermananently: deletePermananently,
        createNewFolder: function() {
            newFolderBtn?.click();
        }
    };
});
