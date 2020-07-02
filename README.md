# Zoomifyc


Zoomifyc is a jQuery plugin for simple Image with zoom effect.

<!-- Check out the examples page: [http://celineWong7.github.io/zoomifyc](http://celineWong7.github.io/zoomifyc). -->


## Installation

```html
	<script type="text/javascript" src="jquery-3.5.0.min.js"></script>
	<script type="text/javascript" src="zoomifyc.js"></script>
	<link rel="stylesheet" type="text/css" href="zoomifyc.css">
```

## Usage

Enable zoomify via JavaScript:

```javascript
$(document).ready(function(){
	zoomifyc.init($('#imgBox img'));
});
```

## Version
* v0.1.0
1. 单击图片显示原图（大图会缩放成适配窗口大小）
2. 左右按钮切换图片

* v0.1.1
1. 添加旋转功能

* v0.1.2
1. 显示原图原来采用transform的scale方式，改成直接设定图片宽度方式。
2. 新增滚轴缩放图片
3. 新增键盘方向键功能（上-放大；下-缩小；左-上一张；右-下一张）


* v0.2.0
1. 新增图片拖拽（translate方式）；
2. 新增WSADR按键事件监听；
3. esc按键：缩放/平移/旋转状态下，恢复初始值；若在初始值，则退出图片弹窗

* v0.2.1
1. 修复翻转时没有重置平移为0
2. 修复翻转后拖拽时坐标不一致问题：改变translate和rotate的应用顺序。

* v0.2.2
1. 修复关闭按钮使用字母x，改用doc文档的打叉符号。
2. 替换左旋转右旋转图标
3. fix bug：zoomifyc阻止键盘默认事件，需要在图片图层打开才生效。（避免导致全局页面失效）
4. 新增isAdaptSize方法，判断是否适配初始大小
5. 新增显示左上角按钮
6. 替换左右切换按钮图标
7. 没有前/后一张图片时，按钮置灰（原来是隐藏）。







??UNDO
1. 多次初始化zoomifyc，会导致一些事件重复绑定，最终会多次触发。

<!-- ## Options

Property | Type | Default | Description
---|---|---|---
duration | `integer` | `200` | Transition duration in milliseconds.
easing | `string` | `"linear"` | Transition property name.
scale | `float` | `0.9` | If the image is bigger than the size of the page, it represent the maximum zoom scale according to page width/height (from 0 to 1).

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-duration=""`.

## Methods

Method | Description
---|---
zoom | Starts a zoom-in or a zoom-out transformation depending on the state of the image.
zoomIn | Starts a zoom-in transformation.
zoomOut | Starts a zoom-out transformation.
reposition | Calculates the correct position of the image and moves it at the center of the visible part of page.

Example of call the `zoomIn()` method:
```javascript
$('#myImage').zoomify('zoomIn');
```

## Events

Event | Description
---|---
zoom-in.zoomify | Fired before each zoom-in transformation.
zoom-in-complete.zoomify | Fired after each zoom-in transformation.
zoom-out.zoomify | Fired before each zoom-out transformation.
zoom-out-complete.zoomify | Fired after each zoom-out transformation.

```javascript
$('#myImage').on('zoom-in.zoomify', function () {
    // do something...
});
``` -->

## License

Copyright (c) 2020 Wang Xiaolin. Licensed under the MIT license.