# Zoomifyc


Zoomifyc is a jQuery plugin for simple Image with zoom effect.

Check out the examples page: [http://indrimuska.github.io/zoomify](http://indrimuska.github.io/zoomify).

![Zoomify: jQuery Plugin for lightboxes](http://indrimuska.github.io/zoomify/img/zoomify-preview.png)

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