// macOS 26 Web 模拟器交互脚本

// 更新时间
function updateTime() {
    const now = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[now.getDay()];
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? '下午' : '上午';
    const displayHours = hours % 12 || 12;
    
    const timeString = `${weekday} ${month}月${date}日 ${period}${displayHours}:${minutes}`;
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// 初始化时间并每分钟更新
updateTime();
setInterval(updateTime, 60000);