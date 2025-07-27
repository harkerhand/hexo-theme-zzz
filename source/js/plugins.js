/* global Travel, CONFIG */

HTMLElement.prototype.wrap = function(wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  this.parentNode.removeChild(this);
  wrapper.appendChild(this);
};

Travel.plugins = {

  /**
   * 打字机效果
   */
  typing: function(text) {
    if (!('Typed' in window)) { return; }

    var typed = new window.Typed('#subtitle', {
      strings: [
        '  ',
        text
      ],
      cursorChar: CONFIG.typing && CONFIG.typing.cursorChar || '_',
      typeSpeed: CONFIG.typing && CONFIG.typing.typeSpeed || 70,
      loop: CONFIG.typing && CONFIG.typing.loop || false
    });
    typed.stop();
    var subtitle = document.getElementById('subtitle');
    if (subtitle) {
      subtitle.innerText = '';
    }
    Travel.utils.listenDOMLoaded(function() {
      typed.start();
    });
  },

  /**
   * 图片缩放
   */
  fancyBox: function(selector) {
    if (!CONFIG.image_zoom || !CONFIG.image_zoom.enable || !window.Fancybox) { return; }

    var images = Travel.utils.getElements(selector || '.post-content img, .markdown-body img');
    
    images.forEach(function(img) {
      var imageUrl = img.getAttribute('data-src') || img.getAttribute('src') || '';
      if (CONFIG.image_zoom.img_url_replace) {
        var rep = CONFIG.image_zoom.img_url_replace;
        var r1 = rep[0] || '';
        var r2 = rep[1] || '';
        if (r1) {
          if (/^re:/.test(r1)) {
            r1 = r1.replace(/^re:/, '');
            var reg = new RegExp(r1, 'gi');
            imageUrl = imageUrl.replace(reg, r2);
          } else {
            imageUrl = imageUrl.replace(r1, r2);
          }
        }
      }
      
      if (!img.parentNode.classList.contains('fancybox')) {
        var link = document.createElement('a');
        link.href = imageUrl;
        link.setAttribute('data-fancybox', 'gallery');
        link.className = 'fancybox';
        
        if (img.classList.contains('group-image-container')) {
          link.setAttribute('data-fancybox', 'group');
          link.setAttribute('rel', 'group');
        } else {
          link.setAttribute('data-fancybox', 'default');
          link.setAttribute('rel', 'default');
        }

        var imageTitle = img.getAttribute('title') || img.getAttribute('alt');
        if (imageTitle) {
          link.setAttribute('title', imageTitle);
          link.setAttribute('data-caption', imageTitle);
        }
        
        img.parentNode.insertBefore(link, img);
        link.appendChild(img);
      }
    });

    if (window.Fancybox) {
      window.Fancybox.bind('[data-fancybox]', {
        Hash: false,
        loop: true
      });
    }
  },

  /**
   * 图片标题
   */
  imageCaption: function(selector) {
    if (!CONFIG.image_caption || !CONFIG.image_caption.enable) { return; }

    var images = Travel.utils.getElements(selector || '.post-content img, .markdown-body img');
    
    images.forEach(function(img) {
      if (img.alt && !img.parentNode.classList.contains('image-caption')) {
        var figcaption = img.nextElementSibling;
        if (figcaption && figcaption.tagName === 'FIGCAPTION') {
          figcaption.classList.add('image-caption');
        } else {
          var imageTitle = img.getAttribute('title') || img.getAttribute('alt');
          if (imageTitle) {
            var caption = document.createElement('figcaption');
            caption.className = 'image-caption';
            caption.setAttribute('aria-hidden', 'true');
            caption.innerHTML = imageTitle;
            img.parentNode.insertBefore(caption, img.nextSibling);
          }
        }
      }
    });
  },

  /**
   * 代码块增强
   */
  codeWidget: function() {
    var enableLang = CONFIG.code_language && CONFIG.code_language.enable && CONFIG.code_language.default;
    var enableCopy = CONFIG.copy_btn && 'ClipboardJS' in window;
    if (!enableLang && !enableCopy) {
      return;
    }

    function getBgClass(ele) {
      return Travel.utils.getBackgroundLightness(ele) >= 0 ? 'code-widget-light' : 'code-widget-dark';
    }

    var copyTmpl = '';
    copyTmpl += '<div class="code-widget';
    copyTmpl += ' BGCLASS';
    if (enableCopy) {
      copyTmpl += ' copy-btn" data-clipboard-snippet><i class="iconfont icon-copy"></i>';
    } else {
      copyTmpl += '">';
    }
    copyTmpl += 'LANG</div>';

    var codeBlocks = Travel.utils.getElements('.post-content pre, .markdown-body pre');
    
    codeBlocks.forEach(function(pre) {
      if (pre.querySelector('code.mermaid') || pre.querySelector('span.line') || pre.classList.contains('code-widget-processed')) {
        return;
      }

      var lang = '';
      if (enableLang) {
        lang = CONFIG.code_language.default || 'TEXT';
        var code = pre.querySelector('code');
        if (code && code.classList.length >= 2 && code.classList.contains('hljs')) {
          lang = code.classList[1];
        } else if (pre.getAttribute('data-language')) {
          lang = pre.getAttribute('data-language');
        } else if (pre.parentNode.classList.contains('sourceCode') && code && code.classList.length >= 2) {
          lang = code.classList[1];
          pre.parentNode.classList.add('code-wrapper');
        } else if (pre.parentNode.classList.contains('post-content') && pre.classList.length === 0) {
          var wrapper = document.createElement('div');
          wrapper.className = 'code-wrapper';
          pre.parentNode.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);
        }
        lang = lang.toUpperCase().replace('NONE', CONFIG.code_language.default || 'TEXT');
      }

      var widget = copyTmpl
        .replace('LANG', lang)
        .replace('BGCLASS', getBgClass(pre));
      
      pre.insertAdjacentHTML('beforeend', widget);
      pre.classList.add('code-widget-processed');

      if (enableCopy) {
        var clipboard = new ClipboardJS('.copy-btn', {
          target: function(trigger) {
            var nodes = trigger.parentNode.childNodes;
            for (var i = 0; i < nodes.length; i++) {
              if (nodes[i].tagName === 'CODE') {
                return nodes[i];
              }
            }
          }
        });
        clipboard.on('success', function(e) {
          e.clearSelection();
          e.trigger.innerHTML = e.trigger.innerHTML.replace('icon-copy', 'icon-check');
          setTimeout(function() {
            e.trigger.innerHTML = e.trigger.innerHTML.replace('icon-check', 'icon-copy');
          }, 2000);
        });
      }
    });
  },

  /**
   * 搜索功能
   */
  localSearch: function() {
    var searchInput = Travel.utils.getElement('#search-input');
    var searchResults = Travel.utils.getElement('#search-results');
    
    if (!searchInput || !searchResults) return;
    
    let searchData = null;
    
    // 加载搜索数据
    fetch(CONFIG.search_path)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        const entries = xml.querySelectorAll('entry');
        
        searchData = Array.from(entries).map(entry => ({
          title: entry.querySelector('title').textContent,
          content: entry.querySelector('content').textContent,
          url: entry.querySelector('url').textContent
        }));
      });
    
    // 搜索功能
    const performSearch = Travel.utils.debounce((query) => {
      if (!searchData || !query.trim()) {
        searchResults.innerHTML = '';
        return;
      }
      
      const results = searchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (CONFIG.include_content_in_search && item.content.toLowerCase().includes(query.toLowerCase()))
      );
      
      if (results.length === 0) {
        searchResults.innerHTML = '<p class="search-no-result">没有找到相关内容</p>';
        return;
      }
      
      const html = results.map(item => `
        <div class="search-result-item">
          <h3><a href="${item.url}">${item.title}</a></h3>
          <p>${item.content.substring(0, 150)}...</p>
        </div>
      `).join('');
      
      searchResults.innerHTML = html;
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  },

  /**
   * 锚点增强
   */
  anchorjs: function() {
    if (!CONFIG.anchorjs || !CONFIG.anchorjs.enable || !window.AnchorJS) { return; }
    
    var anchors = new AnchorJS();
    anchors.options = {
      element: CONFIG.anchorjs.element || 'h1,h2,h3,h4,h5,h6',
      placement: CONFIG.anchorjs.placement || 'left',
      visible: CONFIG.anchorjs.visible || 'hover',
      icon: CONFIG.anchorjs.icon || '#'
    };
    anchors.add();
  },

  /**
   * 进度条
   */
  progressbar: function() {
    if (!CONFIG.progressbar || !CONFIG.progressbar.enable || !window.NProgress) { return; }
    
    NProgress.configure(CONFIG.progressbar.options || {});
    
    var timer = null;
    var progressStep = function() {
      var documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var progress = Math.min(scrollTop / documentHeight, 1);
      
      NProgress.set(progress);
      
      if (progress >= 1) {
        setTimeout(() => NProgress.done(), 200);
      } else {
        timer = requestAnimationFrame(progressStep);
      }
    };
    
    Travel.utils.listenScroll(function() {
      if (timer) {
        cancelAnimationFrame(timer);
      }
      timer = requestAnimationFrame(progressStep);
    });
  }
};
