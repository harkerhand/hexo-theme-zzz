/* global Travel, CONFIG */

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

Travel.utils = {
  
  /**
   * 获取元素
   */
  getElement: function(selector) {
    return document.querySelector(selector);
  },

  /**
   * 获取所有元素
   */
  getElements: function(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * 滚动事件监听
   */
  listenScroll: function(callback) {
    var dbc = new Debouncer(callback);
    window.addEventListener('scroll', dbc, false);
    dbc.handleEvent();
    return dbc;
  },

  unlistenScroll: function(callback) {
    window.removeEventListener('scroll', callback);
  },

  /**
   * 监听DOM加载完成
   */
  listenDOMLoaded: function(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        callback();
      });
    }
  },

  /**
   * 滚动到指定元素 - 移除视差效果
   */
  scrollToElement: function(target, offset) {
    var element = typeof target === 'string' ? this.getElement(target) : target;
    if (element) {
      var rect = element.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var targetY = rect.top + scrollTop + (offset || 0);
      
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  },

  /**
   * 检查元素是否可见
   */
  elementVisible: function(element, offsetFactor) {
    offsetFactor = offsetFactor && offsetFactor >= 0 ? offsetFactor : 0;
    var rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return (
      (rect.top >= 0 && rect.top <= viewportHeight * (1 + offsetFactor) + rect.height / 2) ||
      (rect.bottom >= 0 && rect.bottom <= viewportHeight * (1 + offsetFactor) + rect.height / 2)
    );
  },

  /**
   * 等待元素可见
   */
  waitElementVisible: function(selectorOrElement, callback, offsetFactor) {
    var runningOnBrowser = typeof window !== 'undefined';
    var isBot = (runningOnBrowser && !('onscroll' in window))
      || (typeof navigator !== 'undefined' && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent));
    if (!runningOnBrowser || isBot) {
      return;
    }

    offsetFactor = offsetFactor && offsetFactor >= 0 ? offsetFactor : 0;

    function waitInViewport(element) {
      Travel.utils.listenDOMLoaded(function() {
        if (Travel.utils.elementVisible(element, offsetFactor)) {
          callback();
          return;
        }
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function(entries, ob) {
            if (entries[0].isIntersecting) {
              callback();
              ob.disconnect();
            }
          }, {
            threshold: [0],
            rootMargin: (window.innerHeight || document.documentElement.clientHeight) * offsetFactor + 'px'
          });
          io.observe(element);
        } else {
          var wrapper = Travel.utils.listenScroll(function() {
            if (Travel.utils.elementVisible(element, offsetFactor)) {
              Travel.utils.unlistenScroll(wrapper);
              callback();
            }
          });
        }
      });
    }

    if (typeof selectorOrElement === 'string') {
      this.waitElementLoaded(selectorOrElement, function(element) {
        waitInViewport(element);
      });
    } else {
      waitInViewport(selectorOrElement);
    }
  },

  /**
   * 等待元素加载
   */
  waitElementLoaded: function(selector, callback) {
    var runningOnBrowser = typeof window !== 'undefined';
    var isBot = (runningOnBrowser && !('onscroll' in window))
      || (typeof navigator !== 'undefined' && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent));
    if (!runningOnBrowser || isBot) {
      return;
    }

    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function(records, ob) {
        var ele = document.querySelector(selector);
        if (ele) {
          callback(ele);
          ob.disconnect();
        }
      });
      mo.observe(document, { childList: true, subtree: true });
    } else {
      Travel.utils.listenDOMLoaded(function() {
        var waitLoop = function() {
          var ele = document.querySelector(selector);
          if (ele) {
            callback(ele);
          } else {
            setTimeout(waitLoop, 100);
          }
        };
        waitLoop();
      });
    }
  },

  /**
   * 创建并加载脚本
   */
  createScript: function(url, onload) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('charset', 'UTF-8');
    s.async = false;
    if (typeof onload === 'function') {
      if (window.attachEvent) {
        s.onreadystatechange = function() {
          var e = s.readyState;
          if (e === 'loaded' || e === 'complete') {
            s.onreadystatechange = null;
            onload();
          }
        };
      } else {
        s.onload = onload;
      }
    }
    var ss = document.getElementsByTagName('script');
    var e = ss.length > 0 ? ss[ss.length - 1] : document.head || document.documentElement;
    e.parentNode.insertBefore(s, e.nextSibling);
  },

  /**
   * 创建并加载CSS
   */
  createCssLink: function(url) {
    var l = document.createElement('link');
    l.setAttribute('rel', 'stylesheet');
    l.setAttribute('type', 'text/css');
    l.setAttribute('href', url);
    var e = document.getElementsByTagName('link')[0]
      || document.getElementsByTagName('head')[0]
      || document.head || document.documentElement;
    e.parentNode.insertBefore(l, e);
  },

  /**
   * 加载评论系统
   */
  loadComments: function(selector, loadFunc) {
    var ele = document.querySelector('#comments[lazyload]');
    if (ele) {
      var callback = function() {
        loadFunc();
        ele.removeAttribute('lazyload');
      };
      Travel.utils.waitElementVisible(selector, callback, CONFIG.lazyload && CONFIG.lazyload.offset_factor || 2);
    } else {
      loadFunc();
    }
  },

  /**
   * 获取背景亮度
   */
  getBackgroundLightness: function(selectorOrElement) {
    var ele = selectorOrElement;
    if (typeof selectorOrElement === 'string') {
      ele = document.querySelector(selectorOrElement);
    }
    var view = ele.ownerDocument.defaultView;
    if (!view) {
      view = window;
    }
    var rgbArr = view.getComputedStyle(ele).backgroundColor.replace(/rgba*\(/, '').replace(')', '').split(/,\s*/);
    if (rgbArr.length < 3) {
      return 0;
    }
    var colorCast = (0.213 * rgbArr[0]) + (0.715 * rgbArr[1]) + (0.072 * rgbArr[2]);
    return colorCast === 0 || colorCast > 255 / 2 ? 1 : -1;
  },

  /**
   * 重试机制
   */
  retry: function(handler, interval, times) {
    if (times <= 0) {
      return;
    }
    var next = function() {
      if (--times >= 0 && !handler()) {
        setTimeout(next, interval);
      }
    };
    setTimeout(next, interval);
  },

  /**
   * 防抖函数
   */
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 节流函数 - 移除视差相关用法
   */
  throttle: function(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

/**
 * 防抖处理器
 */
function Debouncer(callback) {
  this.callback = callback;
  this.ticking = false;
}

Debouncer.prototype = {
  constructor: Debouncer,

  update: function() {
    this.callback && this.callback();
    this.ticking = false;
  },

  requestTick: function() {
    if (!this.ticking) {
      requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this)));
      this.ticking = true;
    }
  },

  handleEvent: function() {
    this.requestTick();
  }
};
