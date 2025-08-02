/* global ZZZ, CONFIG */

ZZZ.plugins = {
  
  /**
   * 代码语言标识
   */
  codeWidget: function() {
    var codeBlocks = ZZZ.utils.getElements('pre');
    codeBlocks.forEach(function(pre) {
      if (pre.hasAttribute('data-lang')) return;
      
      // 添加语言标识
      var codeElement = pre.querySelector('code');
      if (codeElement) {
        var lang = codeElement.className.match(/language-(\w+)/);
        if (lang) {
          pre.setAttribute('data-lang', lang[1].toUpperCase());
        } else {
          pre.setAttribute('data-lang', 'CODE');
        }
      }
    });
  },

  /**
   * 图片缩放功能
   */
  fancyBox: function() {
    if (!CONFIG.image_zoom || !CONFIG.image_zoom.enable) return;
    
    var images = ZZZ.utils.getElements('img');
    images.forEach(function(img) {
      if (!img.closest('a')) {
        var link = document.createElement('a');
        link.href = img.src;
        link.setAttribute('data-fancybox', 'gallery');
        img.parentNode.insertBefore(link, img);
        link.appendChild(img);
      }
    });
  },

  /**
   * 本地搜索功能
   */
  localSearch: function() {
    if (!CONFIG.search_path) return;
    
    var searchInput = ZZZ.utils.getElement('#search-input');
    var searchResults = ZZZ.utils.getElement('#search-results');
    
    if (!searchInput || !searchResults) return;
    
    var searchData = null;
    
    // 加载搜索数据
    fetch(CONFIG.search_path)
      .then(response => response.text())
      .then(data => {
        var parser = new DOMParser();
        var xml = parser.parseFromString(data, 'text/xml');
        var entries = xml.querySelectorAll('entry');
        
        searchData = Array.from(entries).map(function(entry) {
          return {
            title: entry.querySelector('title').textContent,
            content: entry.querySelector('content').textContent,
            url: entry.querySelector('url').textContent
          };
        });
      });
    
    // 搜索功能
    var searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function() {
        var keyword = searchInput.value.trim().toLowerCase();
        if (!keyword || !searchData) {
          searchResults.innerHTML = '';
          return;
        }
        
        var results = searchData.filter(function(item) {
          return item.title.toLowerCase().includes(keyword) ||
                 item.content.toLowerCase().includes(keyword);
        });
        
        if (results.length === 0) {
          searchResults.innerHTML = '<div class="no-results">未找到相关内容</div>';
          return;
        }
        
        var html = results.slice(0, 10).map(function(item) {
          return `<div class="search-result-item">
            <h3><a href="${item.url}">${item.title}</a></h3>
            <p>${item.content.substring(0, 150)}...</p>
          </div>`;
        }).join('');
        
        searchResults.innerHTML = html;
      }, 300);
    });
  }
};
