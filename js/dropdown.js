// 下拉菜单交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 只处理顶部菜单栏的菜单（menu-bar 内的），不处理设置窗口内的
    const menuBar = document.querySelector('.menu-bar');
    const menuWrappers = menuBar ? menuBar.querySelectorAll('.menu-item-wrapper') : [];
    let currentOpenMenu = null;

    menuWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.menu-trigger');
        const dropdown = wrapper.querySelector('.dropdown-menu');

        if (!trigger || !dropdown) return;

        // 点击触发器切换菜单
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 如果点击的是当前打开的菜单，关闭它
            if (currentOpenMenu === wrapper) {
                closeMenu(wrapper);
                currentOpenMenu = null;
            } else {
                // 关闭之前打开的菜单
                if (currentOpenMenu) {
                    closeMenu(currentOpenMenu);
                }
                // 打开新菜单
                openMenu(wrapper);
                currentOpenMenu = wrapper;
            }
        });

        // 鼠标悬停时，如果有其他菜单打开，切换到当前菜单
        trigger.addEventListener('mouseenter', function() {
            if (currentOpenMenu && currentOpenMenu !== wrapper) {
                closeMenu(currentOpenMenu);
                openMenu(wrapper);
                currentOpenMenu = wrapper;
            }
        });
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (currentOpenMenu && !currentOpenMenu.contains(e.target)) {
            closeMenu(currentOpenMenu);
            currentOpenMenu = null;
        }
    });

    // 按 ESC 键关闭菜单
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentOpenMenu) {
            closeMenu(currentOpenMenu);
            currentOpenMenu = null;
        }
    });

    function openMenu(wrapper) {
        wrapper.classList.add('active');
        const dropdown = wrapper.querySelector('.dropdown-menu');
        if (dropdown) {
            dropdown.classList.add('show');
        }
    }

    function closeMenu(wrapper) {
        wrapper.classList.remove('active');
        const dropdown = wrapper.querySelector('.dropdown-menu');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
});
