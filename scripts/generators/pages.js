/* global hexo */

'use strict';

const fs = require('fs');
const path = require('path');

// generate 404 page
if (!fs.existsSync(path.join(hexo.source_dir, '404.html'))) {
  hexo.extend.generator.register('_404', function(locals) {
    if (this.theme.config.page404 && this.theme.config.page404.enable !== false) {
      return {
        path  : '404.html',
        data  : locals.theme,
        layout: '404'
      };
    }
  });
}

// generate tags Page
hexo.extend.generator.register('_tags', function(locals) {
  if (this.theme.config.tag && this.theme.config.tag.enable !== false) {
    return {
      path  : 'tags/index.html',
      data  : locals.theme,
      layout: 'tags'
    };
  }
});

// generate categories Page
hexo.extend.generator.register('_categories', function(locals) {
  if (this.theme.config.category && this.theme.config.category.enable !== false) {
    return {
      path  : 'categories/index.html',
      data  : locals.theme,
      layout: 'categories'
    };
  }
});

// generate links page
hexo.extend.generator.register('_links', function(locals) {
  if (this.theme.config.links && this.theme.config.links.enable !== false) {
    return {
      path  : 'links/index.html',
      data  : locals.theme,
      layout: 'links'
    };
  }
});

// generate about page
hexo.extend.generator.register('_about', function(locals) {
  if (this.theme.config.about && this.theme.config.about.enable !== false) {
    return {
      path  : 'about/index.html',
      data  : locals.theme,
      layout: 'about'
    };
  }
});
