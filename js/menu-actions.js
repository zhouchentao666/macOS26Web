// 菜单功能实现

document.addEventListener('DOMContentLoaded', function() {
    
    // 为所有菜单项添加点击事件
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            
            const text = this.textContent.trim().split('\n')[0].trim();
            handleMenuAction(text);
        });
    });
    
    /**
     * 处理菜单动作
     */
    function handleMenuAction(action) {
        console.log('菜单动作:', action);
        
        switch(action) {
            // 文件夹菜单
            case '新建访达窗口':
                openNewFinderWindow();
                break;
            case '关闭窗口':
                closeFinderWindow();
                break;
                
            // 窗口菜单
            case '最小化':
                minimizeFinderWindow();
                break;
            case '缩放':
                toggleMaximizeFinderWindow();
                break;
                
            // 访达菜单
            case '隐藏访达':
                hideFinderWindow();
                break;
            case '全部显示':
                showFinderWindow();
                break;
                
            default:
                console.log('未实现的功能:', action);
        }
    }
    
    /**
     * 打开新的访达窗口
     */
    function openNewFinderWindow() {
        const finderWindow = document.getElementById('finder-window');
        if (finderWindow) {
            finderWindow.style.display = 'flex';
            finderWindow.style.opacity = '0';
            finderWindow.style.transform = 'translateX(-50%) scale(0.9)';
            finderWindow.offsetHeight;
            finderWindow.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease';
            finderWindow.style.transform = 'translateX(-50%) scale(1)';
            finderWindow.style.opacity = '1';
            
            // 稍微偏移位置，模拟新窗口
            const currentTop = parseInt(finderWindow.style.top) || 60;
            const currentLeft = parseInt(finderWindow.style.left) || window.innerWidth / 2;
            finderWindow.style.top = (currentTop + 30) + 'px';
            finderWindow.style.left = (currentLeft + 30) + 'px';
            finderWindow.style.transform = 'none';
            
            setTimeout(() => {
                finderWindow.style.transition = '';
            }, 300);
        }
    }
    
    /**
     * 关闭访达窗口
     */
    function closeFinderWindow() {
        const finderWindow = document.getElementById('finder-window');
        const closeBtn = finderWindow?.querySelector('.control-btn.close');
        if (closeBtn) {
            closeBtn.click();
        }
    }
    
    /**
     * 最小化访达窗口
     */
    function minimizeFinderWindow() {
        const finderWindow = document.getElementById('finder-window');
        const minimizeBtn = finderWindow?.querySelector('.control-btn.minimize');
        if (minimizeBtn) {
            minimizeBtn.click();
        }
    }
    
    /**
     * 切换最大化/还原访达窗口
     */
    function toggleMaximizeFinderWindow() {
        const finderWindow = document.getElementById('finder-window');
        const maximizeBtn = finderWindow?.querySelector('.control-btn.maximize');
        if (maximizeBtn) {
            maximizeBtn.click();
        }
    }
    
    /**
     * 隐藏访达窗口
     */
    function hideFinderWindow() {
        const finderWindow = document.getElementById('finder-window');
        if (finderWindow && finderWindow.style.display !== 'none') {
            finderWindow.style.transition = 'opacity 0.2s ease';
            finderWindow.style.opacity = '0';
            setTimeout(() => {
                finderWindow.style.display = 'none';
                finderWindow.style.opacity = '1';
                finderWindow.style.transition = '';
            }, 200);
        }
    }
    
    /**
     * 显示访达窗口
     */
    function showFinderWindow() {
        const finderWindow = document.getElementById('finder-window');
        if (finderWindow && finderWindow.style.display === 'none') {
            finderWindow.style.display = 'flex';
            finderWindow.style.opacity = '0';
            finderWindow.offsetHeight;
            finderWindow.style.transition = 'opacity 0.2s ease';
            finderWindow.style.opacity = '1';
            setTimeout(() => {
                finderWindow.style.transition = '';
            }, 200);
        }
    }
});
