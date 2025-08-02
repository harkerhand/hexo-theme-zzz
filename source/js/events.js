/* global ZZZ, CONFIG */

ZZZ.events = {

  /**
   * 首屏加载事件
   */
  billboard: function() {
    var billboard = ZZZ.utils.getElement('.banner');
    if (!billboard) return;

    // 打字机效果
    var subtitle = ZZZ.utils.getElement('#subtitle');
    if (subtitle && CONFIG.typing && CONFIG.typing.enable) {
      var text = subtitle.getAttribute('data-typed-text') || subtitle.textContent;
      if (text) {
        ZZZ.plugins.typing(text);
      }
    }
  },

  /**
   * 导航栏事件
   */
  registerNavbarEvent: function() {
    var navbar = ZZZ.utils.getElement('.navbar');
    if (!navbar) return;

    // 导航栏滚动透明度变化
    ZZZ.utils.listenScroll(ZZZ.utils.throttle(function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 0) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }, 16));

    // 移动端菜单切换
    var navbarToggler = ZZZ.utils.getElement('.navbar-toggler');
    var navbarMenu = ZZZ.utils.getElement('.navbar-menu');
    if (navbarToggler && navbarMenu) {
      navbarToggler.addEventListener('click', function() {
        navbarMenu.classList.toggle('show');
        navbarToggler.classList.toggle('active');
      });

      // 点击菜单项关闭菜单
      var menuItems = ZZZ.utils.getElements('.navbar-menu a');
      menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
          navbarMenu.classList.remove('show');
          navbarToggler.classList.remove('active');
        });
      });
    }
  },

  /**
   * 滚动箭头事件
   */
  registerScrollDownArrowEvent: function() {
    var scrollDownArrow = ZZZ.utils.getElement('.scroll-down-arrow');
    if (!scrollDownArrow) return;

    // 点击滚动到下一屏
    scrollDownArrow.addEventListener('click', function(e) {
      e.preventDefault();
      var banner = ZZZ.utils.getElement('.banner');
      if (banner) {
        ZZZ.utils.scrollToElement(banner.nextElementSibling, -80);
      }
    });

    // 滚动时隐藏箭头
    ZZZ.utils.listenScroll(ZZZ.utils.throttle(function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > window.innerHeight * 0.8) {
        scrollDownArrow.style.opacity = '0';
      } else {
        scrollDownArrow.style.opacity = '1';
      }
    }, 16));
  },

  /**
   * 回到顶部事件
   */
  registerScrollTopArrowEvent: function() {
    var scrollTopArrow = ZZZ.utils.getElement('.scroll-top-arrow');
    if (!scrollTopArrow) return;

    // 点击回到顶部
    scrollTopArrow.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // 滚动显示/隐藏
    ZZZ.utils.listenScroll(ZZZ.utils.throttle(function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > window.innerHeight) {
        scrollTopArrow.style.display = 'block';
        scrollTopArrow.style.opacity = '1';
      } else {
        scrollTopArrow.style.opacity = '0';
        setTimeout(() => {
          if (scrollTop <= window.innerHeight) {
            scrollTopArrow.style.display = 'none';
          }
        }, 300);
      }
    }, 16));
  },

  /**
   * 图片加载事件
   */
  registerImageLoadedEvent: function() {
    if (!CONFIG.lazyload || !CONFIG.lazyload.enable) return;

    var images = ZZZ.utils.getElements('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '100px'
      });

      images.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      // 降级处理
      images.forEach(function(img) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      });
    }
  },

  /**
   * 搜索事件
   */
  registerSearchEvent: function() {
    var searchToggle = ZZZ.utils.getElement('.search-toggle');
    var searchOverlay = ZZZ.utils.getElement('.search-overlay');
    var searchClose = ZZZ.utils.getElement('.search-close');
    var searchInput = ZZZ.utils.getElement('#search-input');

    if (searchToggle && searchOverlay) {
      searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.classList.add('show');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 300);
        }
      });
    }

    if (searchClose && searchOverlay) {
      searchClose.addEventListener('click', function() {
        searchOverlay.classList.remove('show');
      });
    }

    if (searchOverlay) {
      searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
          searchOverlay.classList.remove('show');
        }
      });
    }

    // ESC 键关闭搜索
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('show')) {
        searchOverlay.classList.remove('show');
      }
    });
  },

  /**
   * 初始化事件刷新
   */
  refresh: function() {
    // 刷新插件
    ZZZ.plugins.fancyBox();
    ZZZ.plugins.codeWidget();
    ZZZ.plugins.anchorjs();
    
    // 重新初始化瀑布流
    if (window.zzzMasonry) {
      window.zzzMasonry.relayout();
    }
  }
};
