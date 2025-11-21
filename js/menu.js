// 菜单功能脚本

document.addEventListener('DOMContentLoaded', function() {
    const finderWindow = document.getElementById('finder-window');
    
    // 获取所有菜单项
    const menuItems = document.querySelectorAll('.dropdown-item:not(.disabled)');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.textContent.trim().split('\n')[0].trim();
            handleMenuAction(text);
            // 关闭菜单
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        });
    });
    
    function handleMenuAction(action) {
        const closeBtn = finderWindow?.querySelector('.control-btn.close');
        const minimizeBtn = finderWindow?.querySelector('.control-btn.minimize');
        const maximizeBtn = finderWindow?.querySelector('.control-btn.maximize');
        const backBtn = finderWindow?.querySelector('.finder-toolbar .toolbar-btn:nth-child(1)');
        const forwardBtn = finderWindow?.querySelector('.finder-toolbar .toolbar-btn:nth-child(2)');
        const iconViewBtn = finderWindow?.querySelector('.finder-toolbar-right .toolbar-btn:nth-child(1)');
        const listViewBtn = finderWindow?.querySelector('.finder-toolbar-right .toolbar-btn:nth-child(2)');
        const sidebarItems = finderWindow?.querySelectorAll('.sidebar-item');
        const sidebar = finderWindow?.querySelector('.finder-sidebar');
        
        switch(action) {
            // 文件菜单
            case '新建访达窗口':
            case '新建标签页':
                if (finderWindow && finderWindow.style.display === 'none') {
                    const finderDockItem = document.querySelector('.dock-item[data-app="Finder"]');
                    finderDockItem?.click();
                }
                break;
                
            case '新建文件夹':
                showNotification('新建文件夹功能');
                break;
                
            case '关闭窗口':
                closeBtn?.click();
                break;
                
            case '获取信息':
                showNotification('显示文件信息');
                break;
                
            case '重命名':
                showNotification('重命名功能');
                break;
                
            // 显示菜单
            case '作为图标':
                iconViewBtn?.click();
                break;
                
            case '作为列表':
                listViewBtn?.click();
                break;
                
            case '隐藏边栏':
            case '显示边栏':
                if (sidebar) {
                    if (sidebar.style.display === 'none') {
                        sidebar.style.display = 'block';
                        this.textContent = '隐藏边栏';
                    } else {
                        sidebar.style.display = 'none';
                        this.textContent = '显示边栏';
                    }
                }
                break;
                
            // 前往菜单
            case '返回':
                backBtn?.click();
                break;
                
            case '前进':
                forwardBtn?.click();
                break;
                
            case '个人收藏':
            case '桌面':
            case '文稿':
            case '下载':
            case '图片':
            case '音乐':
            case '视频':
            case '应用程序':
                const targetItem = Array.from(sidebarItems || []).find(
                    item => item.textContent.trim() === action
                );
                if (targetItem) {
                    targetItem.click();
                    // 确保窗口打开
                    if (finderWindow && finderWindow.style.display === 'none') {
                        const finderDockItem = document.querySelector('.dock-item[data-app="Finder"]');
                        finderDockItem?.click();
                    }
                }
                break;
                
            // 窗口菜单
            case '最小化':
                minimizeBtn?.click();
                break;
                
            case '缩放':
                maximizeBtn?.click();
                break;
                
            // 访达菜单
            case '隐藏访达':
                closeBtn?.click();
                break;
                
            case '关于访达':
                showAboutDialog();
                break;
                
            // Apple 菜单
            case '关于本机':
                showAboutMac();
                break;
                
            case '系统设置...':
                showNotification('打开系统设置');
                break;
                
            case '锁定屏幕':
                showNotification('锁定屏幕');
                break;
                
            default:
                console.log('菜单操作:', action);
        }
    }
    
    // 显示通知
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
    
    // 关于访达对话框
    function showAboutDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'about-dialog';
        dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <img src="image/Finder.png" alt="Finder" style="width: 64px; height: 64px;">
                    <h2>访达</h2>
                    <p>版本 26.0</p>
                </div>
                <div class="dialog-body">
                    <p>macOS 26 Web Simulator</p>
                    <p style="font-size: 11px; color: #86868b; margin-top: 8px;">© 2024 模拟器项目</p>
                </div>
                <div class="dialog-footer">
                    <button class="dialog-btn">好</button>
                </div>
            </div>
        `;
        
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .dialog-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
            }
            .dialog-content {
                position: relative;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(40px);
                border-radius: 12px;
                padding: 24px;
                min-width: 300px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                text-align: center;
            }
            .dialog-header h2 {
                margin: 12px 0 4px 0;
                font-size: 18px;
                font-weight: 600;
            }
            .dialog-header p {
                margin: 0;
                font-size: 12px;
                color: #86868b;
            }
            .dialog-body {
                margin: 16px 0;
                font-size: 13px;
            }
            .dialog-footer {
                margin-top: 20px;
            }
            .dialog-btn {
                background: #007AFF;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 6px 24px;
                font-size: 13px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .dialog-btn:hover {
                background: #0051D5;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(dialog);
        
        dialog.querySelector('.dialog-btn').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.querySelector('.dialog-overlay').addEventListener('click', () => {
            dialog.remove();
        });
    }
    
    // 关于本机对话框
    function showAboutMac() {
        const dialog = document.createElement('div');
        dialog.className = 'about-dialog';
        dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <img src="image/Apple logo light.png" alt="Apple" style="width: 48px; height: 48px;">
                    <h2>macOS 26</h2>
                    <p>版本 26.0</p>
                </div>
                <div class="dialog-body">
                    <p>Web Simulator</p>
                    <p style="font-size: 11px; color: #86868b; margin-top: 8px;">这是一个 macOS 网页模拟器</p>
                </div>
                <div class="dialog-footer">
                    <button class="dialog-btn">好</button>
                </div>
            </div>
        `;
        
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(dialog);
        
        dialog.querySelector('.dialog-btn').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.querySelector('.dialog-overlay').addEventListener('click', () => {
            dialog.remove();
        });
    }
});
