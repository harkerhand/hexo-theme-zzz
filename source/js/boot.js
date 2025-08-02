/* global ZZZ */

ZZZ.boot = {};

ZZZ.boot.registerEvents = function() {
  ZZZ.events.billboard();
  ZZZ.events.registerNavbarEvent();
  ZZZ.events.registerScrollDownArrowEvent();
  ZZZ.events.registerScrollTopArrowEvent();
  ZZZ.events.registerImageLoadedEvent();
  ZZZ.events.registerSearchEvent();
};

ZZZ.boot.refresh = function() {
  ZZZ.plugins.fancyBox();
  ZZZ.plugins.codeWidget();
  ZZZ.plugins.anchorjs();
  ZZZ.plugins.progressbar();
  ZZZ.events.refresh();
};

ZZZ.boot.init = function() {
  // 初始化插件
  ZZZ.plugins.localSearch();
  ZZZ.plugins.progressbar();
  
  // 注册事件
  ZZZ.boot.registerEvents();
  
  // 首次刷新
  ZZZ.boot.refresh();
};

document.addEventListener('DOMContentLoaded', function() {
  ZZZ.boot.init();
});
