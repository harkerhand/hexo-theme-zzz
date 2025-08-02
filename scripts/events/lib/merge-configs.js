'use strict';

const fs = require('fs');
const path = require('path');

function isNotEmptyObject(obj) {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}

function merge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

module.exports = (hexo) => {
  const isZh = hexo.theme.i18n.languages[0].search(/zh-CN/i) !== -1;

  let dataConfig = {};

  if (hexo.locals.get instanceof Function) {
    const data = hexo.locals.get('data');
    if (data && isNotEmptyObject(data.zzz_config)) {
      dataConfig = data.zzz_config;
    }
  }

  if (isNotEmptyObject(hexo.config.theme_config)) {
    hexo.theme.config = merge({}, hexo.theme.config, hexo.config.theme_config);
    if (isZh) {
      hexo.log.debug('[ZZZ] 读取 _config.yml 中 theme_config 配置项覆盖主题配置');
    } else {
      hexo.log.debug('[ZZZ] Merge theme config from theme_config in _config.yml');
    }
  }

  if (isNotEmptyObject(dataConfig)) {
    hexo.theme.config = merge({}, hexo.theme.config, dataConfig);
    if (isZh) {
      hexo.log.debug('[ZZZ] 读取 source/_data/zzz_config.yml 文件覆盖主题配置');
    } else {
      hexo.log.debug('[ZZZ] Merge theme config from source/_data/zzz_config.yml');
    }
  }

  hexo.log.debug('[ZZZ] Output theme config:\n', JSON.stringify(hexo.theme.config, undefined, 2));
};
