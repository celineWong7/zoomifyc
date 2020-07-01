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
			$close = $('<span class="btn zoomifyc-close">×</span>'),
			$switchBtn = $('<div class="zoomifyc-switch"></div>'),
			$prev = $('<span class="btn prev"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR8VX200DMRCcqQA6gA6ADkIFiApIOkgqgA5IKiBUAB1AB4ROoIJFI60l6+SLH+cL/ooulmd21ju7JmZaZnYN4M2PvyH5k4LiHPhmtnDwcz//luTnSQiY2RLASwT2SlLfkqurArXgYtSNgJk9AXiMwtyQ3OZS3IWAme0BPERgK5L6ll2TCQzAfwGsS8EnpcDMdMM/AKjctAS+IHnIhh1taFKgF3iTAmZ26TUeIv8GsKyNPIhQpYC7m2QPBiNwyZ50uZJUFBOYA7w4BW4wz1HkR92tJPLiFLS4WzcCCfAdyXUNQG7v6B3wnH+1uFsONP6/hoAcbldzeMneo1WQSMGe5Krk4NI92TKcm0SWgCLxCecdwJlHpt/qeM0GVFyGYaNfSo1VgYSajkatSSSKFBiQUPQX/m0yiSoCng71ASlx5SSkgJSoasPVKYhvtbfjLiSqFYjSISU0dt1FStyPjd9jZdlMICLSPA8Wd8OcqfzrUBopMXyQbElucuQnp2BwOYckstbdlYCXqUjoQRIM6yiJ7gSchAbW2DVP9zhNuKaManRw/QPwia0hA1RXCwAAAABJRU5ErkJggg=="></span>'),
			$next = $('<span class="btn next"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABmklEQVRYR72X0U0DMRBEZyqADqADoAOoAKiApAJCBdABpAKSCqADUgJ0QAlJBYtG2pOsU+7Oa/vYr+iSaN6Oz+M1MVBmdg7gy7++J/k99Nua5xwBuE4A9gBu5oAYBBCYmW0APDikIJ5I6lmzGgU4AqFHy5YQkwAO8QLgOWl7RXLdwoYsAIdYAHhPRDckl7UQ2QBzQYQAHEK74xPAiXe/A6Btqpc0XGEAh7gEIOEOQhmhbRqGKAJIIOTEmbctCDnxG7GhGMAhTt2JiyQrQoFVBdACohoggXjrpaYCS0s0Wk0AOoVedGelZlMAd0NOPCZtj0Z3c4CBwLoaOknnAuifHf8HEH0PmjoQFddyNQEwMwXSBwCdE6qDPudMUNUALq7ZUedDSLzaAR9c1Xkn/gNgkdN5t02LHTAziapz2a+SuGwPnYhFAK3Ei5bAzDSavSadbwFoRgx1XrQELp7OhVuSAiqu7CU4Ir4muSpW9j9mAZQETC7YJMCc4pMvoZlpoLhNAuaOpIbRZpV7Oc2O1ijZGIACpruSq/NZrud/4iWwIX3+yBAAAAAASUVORK5CYII="></span>'),
			$imgbox = $('<div class="zoomifyc-imgbox"></div>'),
			$img = $('<img class="zoomifyc-img" src="" >'),
			$tools = $('<div class="zoomifyc-tools"></div>'),
			$prev2 = $('<span class="btn prev" title="上一张"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqElEQVRYR8VX200DMRCcqQA6gA6ADkIFiApIOkgqgA5IKiBUAB1AB4ROoIJFI60l6+SLH+cL/ooulmd21ju7JmZaZnYN4M2PvyH5k4LiHPhmtnDwcz//luTnSQiY2RLASwT2SlLfkqurArXgYtSNgJk9AXiMwtyQ3OZS3IWAme0BPERgK5L6ll2TCQzAfwGsS8EnpcDMdMM/AKjctAS+IHnIhh1taFKgF3iTAmZ26TUeIv8GsKyNPIhQpYC7m2QPBiNwyZ50uZJUFBOYA7w4BW4wz1HkR92tJPLiFLS4WzcCCfAdyXUNQG7v6B3wnH+1uFsONP6/hoAcbldzeMneo1WQSMGe5Krk4NI92TKcm0SWgCLxCecdwJlHpt/qeM0GVFyGYaNfSo1VgYSajkatSSSKFBiQUPQX/m0yiSoCng71ASlx5SSkgJSoasPVKYhvtbfjLiSqFYjSISU0dt1FStyPjd9jZdlMICLSPA8Wd8OcqfzrUBopMXyQbElucuQnp2BwOYckstbdlYCXqUjoQRIM6yiJ7gSchAbW2DVP9zhNuKaManRw/QPwia0hA1RXCwAAAABJRU5ErkJggg=="></span>'),
			$next2 = $('<span class="btn next" title="下一张"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABmklEQVRYR72X0U0DMRBEZyqADqADoAOoAKiApAJCBdABpAKSCqADUgJ0QAlJBYtG2pOsU+7Oa/vYr+iSaN6Oz+M1MVBmdg7gy7++J/k99Nua5xwBuE4A9gBu5oAYBBCYmW0APDikIJ5I6lmzGgU4AqFHy5YQkwAO8QLgOWl7RXLdwoYsAIdYAHhPRDckl7UQ2QBzQYQAHEK74xPAiXe/A6Btqpc0XGEAh7gEIOEOQhmhbRqGKAJIIOTEmbctCDnxG7GhGMAhTt2JiyQrQoFVBdACohoggXjrpaYCS0s0Wk0AOoVedGelZlMAd0NOPCZtj0Z3c4CBwLoaOknnAuifHf8HEH0PmjoQFddyNQEwMwXSBwCdE6qDPudMUNUALq7ZUedDSLzaAR9c1Xkn/gNgkdN5t02LHTAziapz2a+SuGwPnYhFAK3Ei5bAzDSavSadbwFoRgx1XrQELp7OhVuSAiqu7CU4Ir4muSpW9j9mAZQETC7YJMCc4pMvoZlpoLhNAuaOpIbRZpV7Oc2O1ijZGIACpruSq/NZrud/4iWwIX3+yBAAAAAASUVORK5CYII="></span>'),
			$leftRotate = $('<span class="btn left-rotate" title="左旋90°"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACG0lEQVRYR8VX0TUEQRCsigARIAJkQARk4C4CRIAIEAEiIANE4ERACERQXp2ZfWPM7s2ue3v93v3c9UxXV9d09xErNq44Pv4AkLQPQAC+SM7aACZ+cxeSL0OSKQFwcNsLSYOZm6R1AMcAJgB2W4IZ8COAe5IfNYCqAEg6BXAOwCBq7RrAJcnPrgOdAAAcAXgA0DARLrsH4AxjllsA/LH/WhLQwQ+6StkF4C1oIdL9BeACwF1XVpJcIvttJkCmJO9KTHQBSP0NZtKVSX65JAe0ZqLtlc7XAHDmW4tqWcousHEbfnM5tvN7agCktY5xzmrZyJi4IWlBN1YDoJSchfVc+xwkOYmoCbPQPNGxAFiYsRR+mhbp3EZrxZKsAT/RGcm9VQBwhzycZ002iY/JgGl3N7U1GhoTgNV/1QogTLen4NDauWqVX2hMvQD8UurQoOk5SYtLICmOYo9TP52lmaTFIpTkeb4D4JPkxtKi/+wT8Rm+kWz2iV8izGhamg6ymdDeiCR5pr+HzD9Ibi+Dhb6tOB2jnv3T/4AYMoy8dnlYxM1mcCky6otjvdiIJFkkr0nmvZkYvJDEoBl6f21WLkh6H2y1cM4t13qKVr+SZc3DTHju54um33S+lNrXy2u6OZv2/V5LaaGF+kJ3sZOeYrwJjPVby9uChCfq7ujV282qZF5ezY41M+yPSW2WYXg17n1WtDTGaOO4LbGVA/gGRjEFMCYhR1AAAAAASUVORK5CYII="></span>'),
			$rightRotate = $('<span class="btn right-rotate" title="右旋90°"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACQUlEQVRYR8VX21EbQRDsjsA4AkME4AiMIzCOwBABZACOwEUEhgycARABJgJLGUAETbVq9lit9k57J8lMlT4k7aOn59VLvLPxne/HZACSjgEoOUDyoc8ZSUcAPvj/cl0zAEn7AH4AOAHgA2v2F8ANgFuSz2mBpHsAXwLA0p1rAUjaA/ALwOmIcPnyK5LX3jMZQFB3B8Agkr0A+ANgFh//bnYSQzlOe/491o9jQJI9/p2dNg+vTHHVgi3vM2PJHBYzfdgcgvD8MTvEMW0OQew30MWluZEczoHw4l9G+xnJXq/XsOEwLbI/WQsAX+ZstzV7Hl7n1Oe50QYgSs3e2+YknVhNFn3BCTtogwxIugJwGSeMon5bAJyxTpwXknnprXNs8v9LGSkptdbm2E++OTZ2AAoKf5J0OHZufQBGxX8TlP8NgKSLrEN+Jek2/TaOdx2CosJWARjNLpNQkgfYt4XXWTsuqyCV4TPJj5vEttwrySPabfmJZKcnSgCTG9EQ2GKyLlVYCcCtN7XiGcmDbbAgyUPpU5x1QNLfF7aiiCTlw+iG5NkmIIrzrkm6GjqrAXALzsfo5J5QUG8ltZ9rxSoDUQ1OklyQjGai8NzHfibpJF+yXlFakWRmxULztiHhPFHzUd7L4qAqDpHhjpWrGpdTTZSaNb8VSgF7XPO8Nwkr9esDXZ7nI5PRktyMde+D2v6174K0KdSShakfJitiM9Y9BTvOma7UhoA3A6gwY7rfyimGy0iWpr8Nx17Ut34yA9sC8Aq4/fQh78hMGQAAAABJRU5ErkJggg=="></span>'),
			$close2 = $('<span class="btn" title="关闭">×</span>');

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

		// prev/next按钮 是否显示
		zoomifyc.curIndex == 0 ? $('#zoomifycWrap .prev').addClass('disabled') : $('#zoomifycWrap .prev').removeClass('disabled');
		zoomifyc.curIndex == zoomifyc.allImage.length - 1 ? $('#zoomifycWrap .next').addClass('disabled') : $('#zoomifycWrap .next').removeClass('disabled');

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

		// 右上角的关闭按钮
		if (zoomifyc.isAdaptSize()) {
			$('#zoomifycWrap .zoomifyc-close').show();
		} else {
			$('#zoomifycWrap .zoomifyc-close').hide();
		}
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
						if (!zoomifyc.isAdaptSize()) {
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
	isAdaptSize: function(){
		return zoomifyc.scale == 1 && zoomifyc.rotate%360 == 0 && zoomifyc.translateX == 0 && zoomifyc.translateY == 0;
	},
	/** 阻止默认事件（兼容ie） */
	_preventDefault: function(e){
		// 图片层未显示，则不阻止默认事件
		if (!zoomifyc.isShow) {
			return;
		}

		if (e && e.preventDefault) {
			e.preventDefault();
		}
		else { // ie
			window.event.returnValue = false;
		}
		return false;
	},

}
