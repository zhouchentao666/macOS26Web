// 自适应颜色系统 - 根据背景自动调整文字颜色

// 缓存canvas和背景图片数据
let cachedCanvas = null;
let cachedImageData = null;
let cachedBgSrc = null;

/**
 * 初始化或更新canvas缓存
 */
function initCanvasCache() {
    const bg = document.querySelector('.bg img');
    if (!bg || !bg.complete) return false;
    
    // 如果背景图片没变，使用缓存
    if (cachedBgSrc === bg.src && cachedCanvas && cachedImageData) {
        return true;
    }
    
    try {
        // 创建缩小版的canvas以提高性能
        const scale = 0.25; // 缩小到25%
        cachedCanvas = document.createElement('canvas');
        const ctx = cachedCanvas.getContext('2d', { willReadFrequently: true });
        
        cachedCanvas.width = (bg.naturalWidth || bg.width) * scale;
        cachedCanvas.height = (bg.naturalHeight || bg.height) * scale;
        
        // 绘制缩小的背景图片
        ctx.drawImage(bg, 0, 0, cachedCanvas.width, cachedCanvas.height);
        
        // 缓存整个图片数据
        cachedImageData = ctx.getImageData(0, 0, cachedCanvas.width, cachedCanvas.height);
        cachedBgSrc = bg.src;
        
        return true;
    } catch (e) {
        console.warn('无法初始化canvas缓存:', e);
        return false;
    }
}

/**
 * 检测元素背景的亮度（优化版）
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @returns {number} 亮度值 (0-255)
 */
function getBackgroundBrightness(x, y) {
    try {
        // 初始化缓存
        if (!initCanvasCache()) {
            return 128; // 默认中等亮度
        }
        
        // 获取背景图片
        const bg = document.querySelector('.bg img');
        const rect = bg.getBoundingClientRect();
        
        // 计算相对位置
        const relX = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        const relY = Math.max(0, Math.min(1, (y - rect.top) / rect.height));
        
        // 计算在缓存图片中的像素位置
        const pixelX = Math.floor(relX * cachedCanvas.width);
        const pixelY = Math.floor(relY * cachedCanvas.height);
        
        // 从缓存的图片数据中获取像素
        const index = (pixelY * cachedCanvas.width + pixelX) * 4;
        const r = cachedImageData.data[index];
        const g = cachedImageData.data[index + 1];
        const b = cachedImageData.data[index + 2];
        
        // 计算亮度 (使用感知亮度公式)
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
        
        return brightness;
    } catch (e) {
        console.warn('无法检测背景亮度:', e);
        return 128; // 默认中等亮度
    }
}

/**
 * 根据亮度设置菜单颜色主题
 * @param {HTMLElement} menu - 菜单元素
 * @param {number} brightness - 背景亮度
 */
function setMenuTheme(menu, brightness) {
    // 亮度阈值：低于此值使用亮色文字，高于此值使用暗色文字
    const threshold = 128;
    
    if (brightness < threshold) {
        // 深色背景 - 使用亮色文字
        menu.classList.add('dark-bg');
        menu.classList.remove('light-bg');
    } else {
        // 浅色背景 - 使用暗色文字
        menu.classList.add('light-bg');
        menu.classList.remove('dark-bg');
    }
}

/**
 * 为下拉菜单应用自适应颜色
 */
function applyAdaptiveColorToDropdowns() {
    let isProcessing = false;
    
    // 使用MutationObserver监听菜单的显示
    const observer = new MutationObserver(function(mutations) {
        if (isProcessing) return; // 防止重复处理
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const dropdown = mutation.target;
                if (dropdown.classList.contains('dropdown-menu') && dropdown.classList.contains('show')) {
                    isProcessing = true;
                    requestAnimationFrame(() => {
                        const rect = dropdown.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        
                        const brightness = getBackgroundBrightness(centerX, centerY);
                        setMenuTheme(dropdown, brightness);
                        
                        setTimeout(() => { isProcessing = false; }, 100);
                    });
                }
            }
        });
    });
    
    // 监听所有下拉菜单
    document.querySelectorAll('.dropdown-menu').forEach(function(dropdown) {
        observer.observe(dropdown, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
}

/**
 * 为右键菜单应用自适应颜色
 */
function applyAdaptiveColorToContextMenu() {
    let isProcessing = false;
    
    document.addEventListener('contextmenu', function(e) {
        if (isProcessing) return;
        isProcessing = true;
        
        requestAnimationFrame(() => {
            const contextMenu = document.querySelector('.context-menu.show');
            if (contextMenu) {
                const rect = contextMenu.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const brightness = getBackgroundBrightness(centerX, centerY);
                setMenuTheme(contextMenu, brightness);
            }
            setTimeout(() => { isProcessing = false; }, 100);
        });
    });
}

/**
 * 为访达排序菜单应用自适应颜色
 */
function applyAdaptiveColorToSortMenu() {
    let isProcessing = false;
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.sort-btn')) {
            if (isProcessing) return;
            isProcessing = true;
            
            requestAnimationFrame(() => {
                const sortMenu = document.querySelector('.finder-sort-menu.show');
                if (sortMenu) {
                    const rect = sortMenu.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const brightness = getBackgroundBrightness(centerX, centerY);
                    setMenuTheme(sortMenu, brightness);
                }
                setTimeout(() => { isProcessing = false; }, 100);
            });
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 等待背景图片加载完成
    const bgImg = document.querySelector('.bg img');
    if (bgImg) {
        if (bgImg.complete) {
            applyAdaptiveColorToDropdowns();
            applyAdaptiveColorToContextMenu();
            applyAdaptiveColorToSortMenu();
        } else {
            bgImg.addEventListener('load', function() {
                applyAdaptiveColorToDropdowns();
                applyAdaptiveColorToContextMenu();
                applyAdaptiveColorToSortMenu();
            });
        }
    }
});
