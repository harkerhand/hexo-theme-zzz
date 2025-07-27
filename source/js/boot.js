/* global Travel */

Travel.boot = {};

Travel.boot.registerEvents = function() {
  Travel.events.billboard();
  Travel.events.registerNavbarEvent();
  Travel.events.registerScrollDownArrowEvent();
  Travel.events.registerScrollTopArrowEvent();
  Travel.events.registerImageLoadedEvent();
  Travel.events.registerSearchEvent();
};

Travel.boot.refresh = function() {
  Travel.plugins.fancyBox();
  Travel.plugins.imageCaption();
  Travel.plugins.codeWidget();
  Travel.plugins.anchorjs();
  Travel.plugins.progressbar();
  Travel.events.refresh();
};

Travel.boot.init = function() {
  // 初始化插件
  Travel.plugins.localSearch();
  Travel.plugins.progressbar();
  
  // 注册事件
  Travel.boot.registerEvents();
  
  // 首次刷新
  Travel.boot.refresh();
};

document.addEventListener('DOMContentLoaded', function() {
  Travel.boot.init();
});
