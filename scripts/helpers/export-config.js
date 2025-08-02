/* global hexo */

'use strict';

const url = require('url');

/**
 * Export theme config to js
 */
hexo.extend.helper.register('export_config', function () {
  let { config, theme } = this;
  const exportConfig = {
    hostname: url.parse(config.url).hostname || config.url,
    root: config.root,
    version: '1.0.0',
    typing: theme.fun_features && theme.fun_features.typing || { enable: false },
    anchorjs: theme.fun_features && theme.fun_features.anchorjs || { enable: false },
    progressbar: theme.fun_features && theme.fun_features.progressbar || { enable: false },
    code_language: theme.code && theme.code.language || { enable: false },
    copy_btn: theme.code && theme.code.copy_btn || false,
    image_caption: theme.image_caption || { enable: false },
    image_zoom: theme.image_zoom || { enable: false },
    toc: theme.post && theme.post.toc || { enable: false },
    lazyload: theme.lazyload || { enable: false },
    banner: theme.banner || { parallax: false },
    search_path: config.root + (theme.search && theme.search.path || 'local-search.xml'),
    include_content_in_search: theme.search && theme.search.content || false,
  };
  
  return `<script id="zzz-configs">
    var ZZZ = window.ZZZ || {};
    ZZZ.ctx = Object.assign({}, ZZZ.ctx);
    var CONFIG = ${JSON.stringify(exportConfig)};
  </script>`;
});
