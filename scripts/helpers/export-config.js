/* global hexo */

'use strict';

const url = require('url');

/**
 * 统一的URL处理函数
 * 对于本地路径，指向根目录
 * 对于网络路径（以http或https开头），保持原样
 */
hexo.extend.helper.register('url_handler', function (path) {
  if (!path) return '';
  
  // 如果是网络路径（以http或https开头），直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // 对于本地路径，确保以根目录开头
  const { config } = this;
  return config.root + (path.startsWith('/') ? path.slice(1) : path);
});

/**
 * Export theme config to js
 */
hexo.extend.helper.register('export_config', function () {
  let { config, theme } = this;
  const exportConfig = {
    hostname: url.parse(config.url).hostname || config.url,
    root: config.root,
    version: '1.0.0',
    copy_btn: theme.code && theme.code.copy_btn || false,
    image_zoom: theme.image_zoom || { enable: false },
    lazyload: theme.lazyload || { enable: false },
    search_path: config.root + (theme.search && theme.search.path || 'local-search.xml'),
    include_content_in_search: theme.search && theme.search.content || false,
  };
  
  return `<script id="zzz-configs">
    var ZZZ = window.ZZZ || {};
    ZZZ.ctx = Object.assign({}, ZZZ.ctx);
    var CONFIG = ${JSON.stringify(exportConfig)};
  </script>`;
});
