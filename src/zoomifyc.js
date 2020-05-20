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
	scale: 1,
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
			if (e.keyCode == 27) // esc按键-缩小效果
				zoomifyc.hideWrap();
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

		// 滚轴-放大缩小
		zoomifyc.initMouseScroll();
	},
	reset: function(){
		zoomifyc._zoomed = false;
		zoomifyc.rotate = 0;
		zoomifyc.rotateCss();
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
			$img = $('<img class="zoomifyc-img" src="" >');
			$tools = $('<div class="zoomifyc-tools"></div>');
			$prev2 = $('<span class="prev" title="上一张">&lt;</span>'),
			$next2 = $('<span class="next" title="下一张">&gt;</span>'),
			$leftRotate = $('<span class="left-rotate" title="左旋90°"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAUCAYAAABroNZJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABJUlEQVQ4y6WRsSuEcRjHP897KEqmK5NSJ4tISdkswmJQJhOjyWJisZoNyj8gpbNYLP4Hug2L4VJM5wYpH4M3vXfdubv3vuPzfJ/P7/k+P+ggdbiTp6PUO3VPHegHcu+vKupaL4OJupRuULVRF+pg1p80DYe6C9wCy8Az8JGxlIGjiPhq9/qQeqnuZ/OncSrqSjcRztXVFvWNro6qrqvHua+fQq7V0bzziVoEahFRyw0BZoCHfpIkwAiN35gL8gqM5xlWD9XFJI0ym3OJBaCSRMQn8KaWetxiEqhHRP2voJbVQpeAUK/UqebGlnrWCaQW1FN1u51hU71R59v059L+TrYeLYwTwAEwDTwC78AYUAKegJOIePkXks3N79cXU1A1Ir5beX8AuajeueMcwmIAAAAASUVORK5CYII="></span>');
			$rightRotate = $('<span class="right-rotate" title="右旋90°"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAUCAYAAABroNZJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABJUlEQVQ4y6WRsSuEcRjHP897KEqmK5NSJ4tISdkswmJQJhOjyWJisZoNyj8gpbNYLP4Hug2L4VJM5wYpH4M3vXfdubv3vuPzfJ/P7/k+P+ggdbiTp6PUO3VPHegHcu+vKupaL4OJupRuULVRF+pg1p80DYe6C9wCy8Az8JGxlIGjiPhq9/qQeqnuZ/OncSrqSjcRztXVFvWNro6qrqvHua+fQq7V0bzziVoEahFRyw0BZoCHfpIkwAiN35gL8gqM5xlWD9XFJI0ym3OJBaCSRMQn8KaWetxiEqhHRP2voJbVQpeAUK/UqebGlnrWCaQW1FN1u51hU71R59v059L+TrYeLYwTwAEwDTwC78AYUAKegJOIePkXks3N79cXU1A1Ir5beX8AuajeueMcwmIAAAAASUVORK5CYII="></span>');

		$imgbox.append($close,$img);
		$switchBtn.append($prev, $next);
		$tools.append($prev2, $next2, $leftRotate, $rightRotate);
		$content.append($switchBtn, $tools, $imgbox);
		$wrap.append($shadow, $content);
		$('body').append($wrap);
		zoomifyc._content = $content;
		zoomifyc._img = $img;

		$shadow.on('click', zoomifyc.hideWrap)
		$close.on('click', zoomifyc.hideWrap)
		$prev.on('click', zoomifyc.prev);
		$prev2.on('click', zoomifyc.prev);
		$next.on('click', zoomifyc.next);
		$next2.on('click', zoomifyc.next);

		$leftRotate.on('click', function() {
			zoomifyc.rotate -= 90;
			zoomifyc.rotateCss();
		});
		$rightRotate.on('click', function() {
			zoomifyc.rotate += 90;
			zoomifyc.rotateCss();
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
	calSizeAndPosition: function(){
		var $image = zoomifyc.curImage;
		var	nWidth  = $image[0].naturalWidth || +Infinity,
			nHeight = $image[0].naturalHeight || +Infinity,
			wWidth  = $(window).width(),
			wHeight = $(window).height(),
			aWidth  = Math.min(nWidth, wWidth * 0.98),
			aHeight = Math.min(nHeight, wHeight * 0.98),
			scaleX  = aWidth / nWidth,
			scaleY  = aHeight / nHeight,
			scale   = Math.min(scaleX, scaleY);

		// console.log('nheight,wHeight,aHeight',nHeight,wHeight,aHeight);
		// console.log('nwidth,wWidth,aWidth',nWidth,wWidth,aWidth);
		zoomifyc.setCss('scale(' + scale + ')',  nWidth * scale , nHeight * scale);

	},
	setCss: function (s, w, h) {
		$('#zoomifycWrap .zoomifyc-imgbox').css({
			'width': w,
			'height': h
		});
		$('#zoomifycWrap .zoomifyc-content').css({
			'height': $(window).height(),
			'top': $(document).scrollTop()
		});
	},
	setImgScale: function(n){
		if (n) zoomifyc.scale = n;
		zoomifyc._img.css({
			'transform': 'scale(' + zoomifyc.scale + ')',
			'transform-origin': 'center center'
		});
	},
	rotateCss: function(){
		zoomifyc.setImgScale(1);
		// console.log(zoomifyc.rotate)
		var s = 'rotate(' + zoomifyc.rotate + 'deg)';
		$('#zoomifycWrap .zoomifyc-imgbox').css({
			'-webkit-transform': s,
			'-moz-transform': s,
			'-ms-transform': s,
			'-o-transform': s,
			'transform': s,
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

		zoomifyc.setImgScale();

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

		zoomifyc.setImgScale();
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
	}


}
