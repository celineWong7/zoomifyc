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
	allImage: null, // 所有图片对象（jq对象列表）
	_img: null, // #zoomifycWrap弹窗显示的图片对象
	_content: null, // #zoomifycWrap弹窗的content
	_zoomed: false, // 是否在放大状态
	rotate: 0, // 旋转角度
	scale: 1, // 放大倍数
	// translateX: 0, // 水平平移
	// translateY: 0, // 垂直平移
	isGrag: false, // 可以拖拽
	init: function(ele) {
		zoomifyc.createWrap();

		zoomifyc.allImage = ele;

		ele.addClass('zoomifyc').on('click',function(e){
			zoomifyc.curImage = $(this);
			zoomifyc.curIndex = zoomifyc.allImage.index(zoomifyc.curImage);
			zoomifyc.showWrap(zoomifyc.curImage.attr('src'));
		});
		$(window).on('resize', function () { zoomifyc.reposition(); });
		$(document).on('scroll', function () { zoomifyc.reposition(); });//页面滚动时重绘，保证放大的图片在页面中央
		$(window).on('keyup', function (e) { 
			if (e.keyCode == 27) zoomifyc.hideWrap(); // esc按键-缩小效果
		});


		//键盘左右方向键
		$(document).on('keydown', function(e){
			e = e || window.event;
			zoomifyc._preventDefault(e); // 阻止上下键的默认滚动事件
			if (e.keyCode) {
				console.log(e.keyCode);
				if(e.keyCode == 37 ){ //left
					zoomifyc.prev();
				}
				if(e.keyCode == 39 ){ //right
					zoomifyc.next();
				}
				if(e.keyCode == 38 ){ //top
					zoomifyc.biggerImage();
				}
				if(e.keyCode == 40 ){ //down
					zoomifyc.smallerImage();
				}
			}
		})

		
		zoomifyc.initMouseScroll(); // 滚轴-放大缩小
		zoomifyc.initGrap(); // 初始化拖拽
	},
	reset: function(){
		zoomifyc._zoomed = false;
		zoomifyc.setTransform(1,0); // scale-1 rotate-0
		zoomifyc._img.css({
			'top': 0,
			'left': 0
		});
	},
	createWrap: function() {
		if ($('#zoomifycWrap').length > 0) return;

		var $wrap = $('<div id="zoomifycWrap" style="display:none;"></div>'),
			$shadow = $('<div class="zoomifyc-shadow"></div>'),
			$content = $('<div class="zoomifyc-content"></div>'),
			$close = $('<span class="zoomifyc-close">x</span>'),
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
			$close2 = $('<span title="关闭">x</span>');

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
			zoomifyc._img.css({
				'top': 0,
				'left': 0
			});
			zoomifyc.rotate -= 90;
			zoomifyc.setTransform(1);
		});
		$rightRotate.on('click', function() {
			zoomifyc._img.css({
				'top': 0,
				'left': 0
			});
			zoomifyc.rotate += 90;
			zoomifyc.setTransform(1);
		});
	},
	hideWrap: function() {
		$('#zoomifycWrap').hide();
		$('#zoomifycWrap .zoomifyc-img').attr('src', '');

	},
	showWrap: function(imgSrc) {
		zoomifyc.reset();
		zoomifyc._zoomed = true;
		$('#zoomifycWrap').show();
		$('#zoomifycWrap .zoomifyc-img').attr('src', imgSrc);

		// 设置内容块位置
		zoomifyc.calSizeAndPosition();

		// prev/next 是否显示
		zoomifyc.curIndex == 0 ? $('.zoomifyc-switch .prev').hide() : $('.zoomifyc-switch .prev').show();
		zoomifyc.curIndex == zoomifyc.allImage.length - 1 ? $('.zoomifyc-switch .next').hide() : $('.zoomifyc-switch .next').show();

	},
	reposition: function(){
		if (!zoomifyc._zoomed) return;
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
		var v = 'scale(' + zoomifyc.scale + ') rotate(' + zoomifyc.rotate + 'deg)';
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
			// 向上滚动
			if (_delta > 0) {
				zoomifyc.biggerImage();
			}
			// 向下滚动
			else {
				zoomifyc.smallerImage();
			}
		}
	},
	biggerImage: function(){
		zoomifyc._img = $('.zoomifyc-img');
		// console.log(scale);
		zoomifyc.scale += 0.1;
		if (zoomifyc.scale >= 15)  {
			zoomifyc.scale = 15;
			return;
		}

		zoomifyc.setTransform();

		// console.log(zoomifyc.scale, zoomifyc._img.height()*zoomifyc.scale, zoomifyc._img[0].getBoundingClientRect().height);
		if ($(window).height() <= zoomifyc._img.height()*zoomifyc.scale || $(window).width() <= zoomifyc._img.width()*zoomifyc.scale) {
			// zoomifyc._img.css('cursor', 'grab') //grabbing
			// canGrag = true;
			// drag();
		}
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
		var _this = {};
		_this.params = {
			// zoomVal: 1, // 初始缩放比例
			// minZoomVal: 0.2, // 最小缩放比例
			left: 0, // 初始左边距
			top: 0, // 初始上边距
			currentX: 0, // 鼠标X坐标
			currentY: 0, // 鼠标Y坐标
			// moveVal: 50, // 上下左右移动距离
			// wheelVal: 1200, // 放大缩小的值
			flag: false // 是否开始拖拽
		};


		_this.bar = $('.zoomifyc-img');
		_this.ele = $('.zoomifyc-img');
		var _that = _this;
		_this.ele.css('position', 'absolute');
		if (getCss("left") !== "auto") {
			_this.params.left = getCss("left")
		}
		if (getCss("top") !== "auto") {
			_this.params.top = getCss("top")
		}
		// o是移动对象
		_this.bar.on("mousedown", function (event) {
			_that.params.flag = true;
			if (!event) {
				event = window.event;
		//防止IE文字选中
		_that.bar.onselectstart = function () {
			return false;
		}
		}
		var e = event;
		_that.params.currentX = e.clientX;
		_that.params.currentY = e.clientY;
		});
		document.onmouseup = function () {
			_that.params.flag = false;
			if (getCss("left") !== "auto") {
				_that.params.left = getCss("left");
			}
			if (getCss("top") !== "auto") {
				_that.params.top = getCss("top");
			}
		};
		document.onmousemove = function (event) {
			var e = event ? event : window.event;
			if (_that.params.flag) {
				var nowX = e.clientX;
				var nowY = e.clientY;
				var disX = nowX - _that.params.currentX;
				var disY = nowY - _that.params.currentY;

				_that.ele.css("left", parseInt(_that.params.left) + disX + "px");
				_that.ele.css("top", parseInt(_that.params.top) + disY + "px");

				if (typeof callback == "function") {
					callback((parseInt(_that.params.left) || 0) + disX, (parseInt(_that.params.top) || 0) + disY);
				}
				if (event.preventDefault) {
					event.preventDefault();
				}
				return false;
			}
		}
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
