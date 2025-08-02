# 绝区零主题（Zenless Zone Zero Theme）

ZZZ 是一个基于绝区零游戏风格的简洁、美观且响应式的 Hexo 主题。采用深色设计风格，配合科技感UI元素，为您的博客带来独特的视觉体验。

![ZZZ 主题截图](source/images/screenshot.png)

## 主题特色

- 🎮 **绝区零风格设计** - 深色主题配合游戏风格的UI元素
- 📱 **完全响应式** - 支持各种设备和屏幕尺寸
- 🎬 **视频背景支持** - 首页支持视频背景展示
- ⚡ **快速加载** - 优化的CSS和JavaScript，确保快速加载
- 🌈 **动效丰富** - 流畅的动画效果和悬停交互
- 📝 **Markdown友好** - 完美支持Markdown语法

## 主题安装

### 从 Github 安装

在你的 Hexo 站点的 `/themes` 目录下运行以下命令：

```sh
git clone https://github.com/harkerhand/hexo-theme-zzz
```

### 从 npm 安装

在你的 Hexo 站点的根目录下运行一下命令：

```sh
npm install hexo-theme-zzz --save
```

### 配置主题

然后更新博客的主 `_config.yml` 文件，将主题设置为 `hexo-theme-zzz`：

```yaml
# 扩展
## 插件: http://hexo.io/plugins/
## 主题: http://hexo.io/themes/
theme: hexo-theme-zzz
```

## 主题配置

### 默认设置

```yaml
# 默认文章封面图（绝区零风格）
default_cover_image: images/zzz-loading.webp
# 默认文章标题
default_post_title: '无标题文档'
# 首页视频下方文字
info_text: '欢迎来到绝区零世界 ↓'
# 网站根目录（兼容性）
url_root: '/'
```
```

### 头部菜单

```yaml
# 绝区零主题示例菜单
menu:
  '归档': /archives
  '关于': /about
  '角色': /characters
  '空洞调查协会': https://zenless.hoyoverse.com/
```

注意：如果使用内部链接，需要在 `/source` 文件夹下新建同名文件夹及其 `index.md`

### 页脚信息

#### 联系方式

```yaml
foot_about:
  phone: '空洞调查协会热线'
  address: '新艾利都市'
```

#### 社交媒体

```yaml
media:
  - icon: iconfont icon-github
    link: 'https://github.com/harkerhand'
    tip: 'GitHub'
  - icon: iconfont icon-mail
    link: 'mailto:contact@example.com'
    tip: '邮箱'
  - icon: iconfont icon-game
    link: 'https://zenless.hoyoverse.com/'
    tip: '绝区零官网'
```

注意：图标用法参考下文 Iconfont

### Iconfont 字体图标

```yaml
iconfont:
- //at.alicdn.com/t/c/font_1736178_k526ubmyhba.css
- //at.alicdn.com/t/c/font_4823232_6grnmuy6d4c.css
```

## 文章配置

对于每篇文章，需要在 [Front Matter](https://hexo.io/docs/front-matter.html) 中指定额外的信息。

### 文章标题

使用 `title` 指定文章的标题。

```yaml
title: 安比·德玛拉的冒险故事
```

### 文章封面图

本主题的每篇文章都需要一个封面图。如果没有提供封面图，将使用默认的绝区零加载动画图。可以通过以下方式指定自己的封面图。

```yaml
cover_image: /images/anby-demara.webp
```

### 文章分类

```yaml
categories:
  - 绝区零
  - 角色介绍
```

## 主题亮点

### 🎨 视觉设计
- 深色主题，符合绝区零游戏风格
- 科技感UI元素和动效
- 精心设计的配色方案（绿色主调 + 黄色点缀）

### 🚀 性能优化
- CSS Grid 布局，响应式瀑布流
- 图片懒加载
- 优化的动画性能

### 📱 移动端友好
- 完全响应式设计
- 触摸友好的交互
- 移动端优化的导航

## 许可证

GPL-V3

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 基于绝区零游戏风格设计
- 完全重新设计为绝区零风格
- 新增视频背景支持
- 优化移动端体验
- 添加动画效果

## 主题作者

此主题由 [何山](http://www.harkerhand.cn/) 设计并创建。

## 反馈与问题

如果你有任何问题、功能请求或需要修复的 Bug，请[点击这里](https://github.com/harkerhand/hexo-theme-zzz/issues/new)提交问题。

