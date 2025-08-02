/**
 * 绝区零风格瀑布流布局
 */
class ZZZMasonry {
    constructor(container, options = {}) {
        this.container = container;
        this.items = [];
        this.columns = [];
        this.columnCount = 0;
        this.columnWidth = 320;
        this.gutter = 25;
        
        this.options = {
            columnWidth: options.columnWidth || 320,
            gutter: options.gutter || 25,
            fitWidth: options.fitWidth || true,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.updateLayout();
        this.bindEvents();
        
        // 监听图片加载完成
        this.waitForImages().then(() => {
            this.layout();
        });
    }
    
    updateLayout() {
        const containerWidth = this.container.offsetWidth;
        const totalWidth = this.options.columnWidth + this.options.gutter;
        
        this.columnCount = Math.floor((containerWidth + this.options.gutter) / totalWidth) || 1;
        
        // 如果启用了 fitWidth，调整容器宽度
        if (this.options.fitWidth) {
            const fitWidth = this.columnCount * totalWidth - this.options.gutter;
            this.container.style.width = fitWidth + 'px';
        }
        
        // 初始化列高度数组
        this.columns = new Array(this.columnCount).fill(0);
        
        // 获取所有卡片
        this.items = Array.from(this.container.children);
    }
    
    layout() {
        this.items.forEach((item, index) => {
            
            const shortestColumn = this.getShortestColumn();
            const x = shortestColumn * (this.options.columnWidth + this.options.gutter);
            const y = this.columns[shortestColumn];
            
            // 设置位置
            item.style.left = x + 'px';
            item.style.top = y + 'px';
            
            // 更新列高度
            this.columns[shortestColumn] += item.offsetHeight + this.options.gutter;
        });
        
        // 设置容器高度
        const maxHeight = Math.max(...this.columns);
        this.container.style.height = maxHeight + 'px';
    }
    
    getShortestColumn() {
        let shortest = 0;
        let shortestHeight = this.columns[0];
        
        for (let i = 1; i < this.columns.length; i++) {
            if (this.columns[i] < shortestHeight) {
                shortest = i;
                shortestHeight = this.columns[i];
            }
        }
        
        return shortest;
    }
    
    waitForImages() {
        const images = this.container.querySelectorAll('img');
        const promises = Array.from(images).map(img => {
            return new Promise(resolve => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = resolve;
                    img.onerror = resolve;
                }
            });
        });
        
        return Promise.all(promises);
    }
    
    bindEvents() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateLayout();
                this.layout();
            }, 250);
        });
    }
    
    // 添加新卡片时调用
    append(elements) {
        const newItems = Array.isArray(elements) ? elements : [elements];
        newItems.forEach(item => {
            this.container.appendChild(item);
        });
        
        this.items = Array.from(this.container.children);
        this.layout();
    }
    
    // 重新布局
    relayout() {
        this.updateLayout();
        this.layout();
    }
}

// 页面加载完成后初始化瀑布流
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.item-container');
    if (container) {
        // 等待一小段时间确保CSS加载完成，不影响banner
        setTimeout(() => {
            window.zzzMasonry = new ZZZMasonry(container, {
                columnWidth: 320,
                gutter: 25,
                fitWidth: true
            });
        }, 100);
    }
    
    // 确保banner不受瀑布流影响
    const banner = document.querySelector('.banner');
    if (banner) {
        banner.style.transform = 'none';
        banner.style.willChange = 'auto';
    }
});
