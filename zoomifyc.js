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
	_zoomed: false, // 是否在放大状态
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
		$imgbox.append($close,$img);
		$switchBtn.append($prev, $next);
		$content.append($switchBtn, $imgbox);
		$wrap.append($shadow, $content);
		$('body').append($wrap);

		$shadow.on('click', function () { zoomifyc.hideWrap(); })
		$close.on('click', function () { zoomifyc.hideWrap(); })

		$prev.on('click', function() {
			if (zoomifyc.curIndex == 0) return;
			zoomifyc.allImage.eq(zoomifyc.curIndex - 1).trigger('click');
		});
		$next.on('click', function() {
			if (zoomifyc.curIndex == zoomifyc.allImage.length - 1) return;
			zoomifyc.allImage.eq(zoomifyc.curIndex + 1).trigger('click');
		});
	},
	hideWrap: function() {
		zoomifyc._zoomed = false;
		$('#zoomifycWrap').hide();
		$('#zoomifycWrap .zoomifyc-img').attr('src', '');

	},
	showWrap: function(imgSrc) {
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
	calSizeAndPosition: function(){
		var $image = zoomifyc.curImage;
		var	nWidth  = $image[0].naturalWidth || +Infinity,
			nHeight = $image[0].naturalHeight || +Infinity,
			wWidth  = $(window).width(),
			wHeight = $(window).height(),
			aWidth  = Math.min(nWidth, wWidth * 0.95),
			aHeight = Math.min(nHeight, wHeight * 0.95)
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
		$('#zoomifycWrap .zoomifyc-img').css({
			'-webkit-transform': s,
			'-moz-transform': s,
			'-ms-transform': s,
			'-o-transform': s,
			'transform': s,
			'transform-origin': '0 0'
		});
		$('#zoomifycWrap .zoomifyc-content').css({
			'height': $(window).height(),
			'top': $(document).scrollTop()
			// 'top': $(window).height()/2 + $(document).scrollTop()
		});
	},
}
