'use strict';

const mergeConfigs = require('./lib/merge-configs');

hexo.extend.filter.register('before_generate', function() {
  mergeConfigs(hexo);
});
