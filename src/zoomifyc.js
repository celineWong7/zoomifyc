/**
 * Zoomifyc
 * A jQuery plugin for img zoom effect.
 * http://celineWong7.github.io/zoomifyc
 *
 * (c) 2020 Wang Xiaolin - MIT
 */
var zoomifyc = {};

zoomifyc = {
	curImage: null, //  当前点击的图片（jq对象）
	curIndex: 0, // 当前点击图片的索引
	allImage: null, // $('#demo img') - 所有图片对象（jq对象列表）
	_img: null, // $(#zoomifycWrap .zoomifyc-img) - 弹窗显示的图片对象
	_content: null, // $(#zoomifycWrap .zoomifyc-content)
	isShow: false, // 弹窗已打开
	rotate: 0, // 旋转角度
	scale: 1, // 放大倍数
	grabbing: false, // 是否拖拽中
	translateX: 0, // 水平平移 - 拖拽
	translateY: 0, // 垂直平移 - 拖拽
	init: function(ele) {
		zoomifyc.createWrap();

		zoomifyc.allImage = ele;
		ele.addClass('zoomifyc').on('click',function(e){
			zoomifyc.curImage = $(this);
			zoomifyc.curIndex = zoomifyc.allImage.index(zoomifyc.curImage);
			zoomifyc.showWrap(zoomifyc.curImage.attr('src'));
		});
		
		zoomifyc.initMouseScroll(); // 初始化滚轴-放大缩小
		zoomifyc.initGrap(); // 初始化拖拽
		zoomifyc.initPageEvent(); // 初始化页面监听事件
	},
	reset: function(){
		zoomifyc.setTransform(1,0,0,0); // scale-1 rotate-0  translateX-0  translateY-0
	},
	createWrap: function() {
		if ($('#zoomifycWrap').length > 0) return;

		var $wrap = $('<div id="zoomifycWrap" style="display:none;"></div>'),
			$shadow = $('<div class="zoomifyc-shadow"></div>'),
			$content = $('<div class="zoomifyc-content"></div>'),
			$close = $('<span class="zoomifyc-close">×</span>'),
			$switchBtn = $('<div class="zoomifyc-switch"></div>'),
			$prev = $('<span class="prev">&lt;</span>'),
			$next = $('<span class="next">&gt;</span>'),
			$imgbox = $('<div class="zoomifyc-imgbox"></div>'),
			$img = $('<img class="zoomifyc-img" src="" >'),
			$tools = $('<div class="zoomifyc-tools"></div>'),
			$prev2 = $('<span class="prev" title="上一张">&lt;</span>'),
			$next2 = $('<span class="next" title="下一张">&gt;</span>'),
			$leftRotate = $('<span class="left-rotate" title="左旋90°"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAUCAYAAABroNZJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABJUlEQVQ4y6WRsSuEcRjHP897KEqmK5NSJ4tISdkswmJQJhOjyWJisZoNyj8gpbNYLP4Hug2L4VJM5wYpH4M3vXfdubv3vuPzfJ/P7/k+P+ggdbiTp6PUO3VPHegHcu+vKupaL4OJupRuULVRF+pg1p80DYe6C9wCy8Az8JGxlIGjiPhq9/qQeqnuZ/OncSrqSjcRztXVFvWNro6qrqvHua+fQq7V0bzziVoEahFRyw0BZoCHfpIkwAiN35gL8gqM5xlWD9XFJI0ym3OJBaCSRMQn8KaWetxiEqhHRP2voJbVQpeAUK/UqebGlnrWCaQW1FN1u51hU71R59v059L+TrYeLYwTwAEwDTwC78AYUAKegJOIePkXks3N79cXU1A1Ir5beX8AuajeueMcwmIAAAAASUVORK5CYII="></span>'),
			$rightRotate = $('<span class="right-rotate" title="右旋90°"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAUCAYAAABroNZJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABJUlEQVQ4y6WRsSuEcRjHP897KEqmK5NSJ4tISdkswmJQJhOjyWJisZoNyj8gpbNYLP4Hug2L4VJM5wYpH4M3vXfdubv3vuPzfJ/P7/k+P+ggdbiTp6PUO3VPHegHcu+vKupaL4OJupRuULVRF+pg1p80DYe6C9wCy8Az8JGxlIGjiPhq9/qQeqnuZ/OncSrqSjcRztXVFvWNro6qrqvHua+fQq7V0bzziVoEahFRyw0BZoCHfpIkwAiN35gL8gqM5xlWD9XFJI0ym3OJBaCSRMQn8KaWetxiEqhHRP2voJbVQpeAUK/UqebGlnrWCaQW1FN1u51hU71R59v059L+TrYeLYwTwAEwDTwC78AYUAKegJOIePkXks3N79cXU1A1Ir5beX8AuajeueMcwmIAAAAASUVORK5CYII="></span>'),
			$close2 = $('<span title="关闭">×</span>');

		$imgbox.append($close,$img);
		$switchBtn.append($prev, $next);
		$tools.append($prev2, $next2, $leftRotate, $rightRotate, $close2);
		$content.append($switchBtn, $tools, $imgbox);
		$wrap.append($shadow, $content);
		$('body').append($wrap);
		zoomifyc._content = $content;
		zoomifyc._img = $img;

		$shadow.on('click', zoomifyc.hideWrap);
		$close.on('click', zoomifyc.hideWrap);
		$close2.on('click', zoomifyc.hideWrap);
		$prev.on('click', zoomifyc.prev);
		$prev2.on('click', zoomifyc.prev);
		$next.on('click', zoomifyc.next);
		$next2.on('click', zoomifyc.next);

		$leftRotate.on('click', function() {
			zoomifyc.rotate -= 90;
			zoomifyc.setTransform(1,null,0,0);
		});
		$rightRotate.on('click', function() {
			zoomifyc.rotate += 90;
			zoomifyc.setTransform(1,null,0,0);
		});
	},
	hideWrap: function() {
		zoomifyc.isShow = false;
		$('#zoomifycWrap').hide();
		$('#zoomifycWrap .zoomifyc-img').attr('src', '');

	},
	showWrap: function(imgSrc) {
		zoomifyc.isShow = true;
		zoomifyc.reset();
		$('#zoomifycWrap').show();
		$('#zoomifycWrap .zoomifyc-img').attr('src', imgSrc);

		// 设置内容块位置
		zoomifyc.calSizeAndPosition();

		// prev/next 是否显示
		zoomifyc.curIndex == 0 ? $('.zoomifyc-switch .prev').hide() : $('.zoomifyc-switch .prev').show();
		zoomifyc.curIndex == zoomifyc.allImage.length - 1 ? $('.zoomifyc-switch .next').hide() : $('.zoomifyc-switch .next').show();

	},
	reposition: function(){
		if (!zoomifyc.isShow) return;
		zoomifyc.calSizeAndPosition();
	},
	prev: function(){
		if (zoomifyc.curIndex == 0) return;
		zoomifyc.allImage.eq(zoomifyc.curIndex - 1).trigger('click');
	},
	next: function(){
		if (zoomifyc.curIndex == zoomifyc.allImage.length - 1) return;
		zoomifyc.allImage.eq(zoomifyc.curIndex + 1).trigger('click');
	},
	calSizeAndPosition: function(d){
		var $image = zoomifyc.curImage;
		var	nWidth_  = $image[0].naturalWidth || +Infinity, // 图片本身宽度 nature
			nHeight_ = $image[0].naturalHeight || +Infinity,// 图片本身高度
			nWidth = d == 'odd' ? nHeight_ : nWidth_, // 图片展示时的宽度（主要是旋转情况下，90*odd时宽高翻转）
			nHeight = d == 'odd' ? nWidth_ : nHeight_, // 图片展示时的高度
			wWidth  = $(window).width(), // 窗口宽度
			wHeight = $(window).height(),// 窗口高度
			aWidth  = Math.min(nWidth, wWidth * 0.98), // 适配窗口的宽度（大于窗口宽度则取98%，否则取图片本身宽度）
			aHeight = Math.min(nHeight, wHeight * 0.98), // 适配窗口的高度 adapt
			scaleX  = aWidth / nWidth,
			scaleY  = aHeight / nHeight,
			scale   = Math.min(scaleX, scaleY); // 取小的倍数，确保宽高都不会超出窗口

		// console.log('nheight,wHeight,aHeight',nHeight,wHeight,aHeight);
		// console.log('nwidth,wWidth,aWidth',nWidth,wWidth,aWidth);
		$('#zoomifycWrap .zoomifyc-imgbox').css({
			'width': nWidth * scale,
			'height': nHeight * scale
		});
		$('#zoomifycWrap .zoomifyc-content').css({
			'height': $(window).height(),
			'top': $(document).scrollTop()
		});
	},
	setTransform: function(s, r, x, y){
		if (s) zoomifyc.scale = s;
		if (r != undefined || r != null ) zoomifyc.rotate = r;
		if (x != undefined || x != null) zoomifyc.translateX = x;
		if (y != undefined || y != null) zoomifyc.translateY = y;

		var v = 'scale(' + zoomifyc.scale + ') translateX(' + zoomifyc.translateX + 'px) translateY(' + zoomifyc.translateY + 'px) rotate(' + zoomifyc.rotate + 'deg)';
		// console.log(v);
		zoomifyc._img.css({
			'-webkit-transform': v,
			'-moz-transform': v,
			'-ms-transform': v,
			'-o-transform': v,
			'transform': v,
			'transform-origin': 'center center'
		});
	},
	initMouseScroll: function(){
		var isFirefox = navigator.userAgent.indexOf("Firefox") > -1 ;
		var MOUSEWHEEL_EVENT = isFirefox ? "DOMMouseScroll" : "mousewheel";

		if(document.attachEvent){
			zoomifyc._content[0].attachEvent("on"+MOUSEWHEEL_EVENT, function(e){
				mouseWheelScroll(e);
			});
		} else if(document.addEventListener){
			zoomifyc._content[0].addEventListener(MOUSEWHEEL_EVENT, function(e){
				mouseWheelScroll(e);
			}, false);
		}


		function mouseWheelScroll(e){
			zoomifyc._preventDefault(e); // 阻止默认的页面滚动
			var _delta = parseInt(e.wheelDelta || -e.detail);

			if (_delta > 0) {// 向上滚动
				zoomifyc.biggerImage();
			}
			else {// 向下滚动
				zoomifyc.smallerImage();
			}
		}
	},
	biggerImage: function(){
		zoomifyc.scale += 0.1;
		if (zoomifyc.scale >= 15)  {
			zoomifyc.scale = 15;
			return;
		}

		zoomifyc.setTransform();

		// 图片放大到超出窗口时，初始化拖拽效果
		// if ($(window).height() <= zoomifyc._img.height()*zoomifyc.scale || $(window).width() <= zoomifyc._img.width()*zoomifyc.scale) {
		// 	zoomifyc._img.css('cursor', 'grab') //grabbing
		// 	initGrap();
		// }
	},
	smallerImage: function(){
		zoomifyc.scale -= 0.1;
		if (zoomifyc.scale <= 0.1)  {
			zoomifyc.scale = 0.1;
			return;
		}

		zoomifyc.setTransform();
	},
	initGrap: function(){
		var startX = 0, // 当前鼠标x坐标
			startY  = 0, // 当前鼠标y坐标
			translateX_ = 0, // 拖拽开始时图片的水平平移
			translateY_ = 0, // 拖拽开始时图片的垂直平移
			bar = zoomifyc._img, // 触发拖拽的指定区域
			ele = zoomifyc._img; // 拖拽移动的元素

		// 鼠标按下时触发
		bar.on('mousedown', function (e) {
			zoomifyc.grabbing = true;
			if (!e) {
				e = window.e;
				bar.onselectstart = function () { // 阻止IE文字选中默认事件
					return false;
				}
			}
			startX = e.clientX;
			startY = e.clientY;
			translateX_ = zoomifyc.translateX;
			translateY_ = zoomifyc.translateY;
		});
		// 鼠标松开时触发
		$(document).on('mouseup', function () {
			zoomifyc.grabbing = false;
			translateX_ = zoomifyc.translateX;
			translateY_ = zoomifyc.translateY;
		});
		// 鼠标按下移动时触发
		$(document).on('mousemove', function (event) {
			var e = event ? event : window.event;
			if (zoomifyc.grabbing) {
				var nowX = e.clientX; // 当前鼠标坐标
				var nowY = e.clientY; // 当前鼠标坐标
				var disX = nowX - startX;
				var disY = nowY - startY;

				zoomifyc.translateX = translateX_ + disX;
				zoomifyc.translateY = translateY_ + disY;
				// console.log(translateX_, disX, zoomifyc.translateX);
				zoomifyc.setTransform();

				zoomifyc._preventDefault();
				return false;
			}
		});
	},
	initPageEvent: function(){
		// 调整窗口 - 缩放图片进行适配
		$(window).on('resize', zoomifyc.reposition);

		// 页面滚动 - 保证放大的图片在当前可视区域的中央
		$(document).on('scroll', zoomifyc.reposition);

		// 监听键盘按键
		$(document).on('keydown', function(e){
			e = e || window.event;
			zoomifyc._preventDefault(e); // 阻止上下键的默认滚动事件
			if (e.keyCode && zoomifyc.isShow) {
				// console.log(e.keyCode);

				//键盘左右方向键 和 wasd字母按键
				if(e.keyCode == 37 || e.keyCode == 65 ){ // left A
					zoomifyc.prev();
				}
				if(e.keyCode == 39 || e.keyCode == 68 ){ // right D
					zoomifyc.next();
				}
				if(e.keyCode == 38 || e.keyCode == 87 ){ // top W
					zoomifyc.biggerImage();
				}
				if(e.keyCode == 40 || e.keyCode == 83 ){ // down S
					zoomifyc.smallerImage();
				}

				// esc按键
				if (e.keyCode == 27) {
					if (zoomifyc.isShow) {
						// 若处于缩放、旋转、平移时，恢复初始值
						if (zoomifyc.scale != 1 || zoomifyc.rotate != 0 || zoomifyc.translateX != 0 || zoomifyc.translateY != 0) {
							zoomifyc.reset();
						}
						// 退出图片弹窗
						else {
							zoomifyc.hideWrap();
						}
					}
				}
				// 字母r按键 - 旋转
				if (e.keyCode == 82) {
					zoomifyc.rotate += 90;
					zoomifyc.setTransform(1,null,0,0);
				}
			}
		});
	},
	/** 阻止默认事件（兼容ie） */
	_preventDefault: function(e){
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		else { // ie
			window.event.returnValue = false;
		}
		return false;
	},


}


var Util = {};
Util = {
	oddOReven: function(n){
		n = parseInt(n)
		if (n%2 == 0) return 'even';
		else return 'odd';
	}
}

function getCss(key) {
    return $('.zoomifyc-img').css(key);
}
