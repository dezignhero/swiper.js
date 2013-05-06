# swiper.js

**Requires jQuery/Zepto**

Full page slider for touch enabled devices.  Currently supports WebKit devices only.  [Check out the demo](http://dezignhero.github.io/swiper/).

## Introduction

swiper.js takes a slider or a full page and allows it to be touch enabled.  This is perfect for full-page slideshows on mobile devices, and utilizes CSS3 properties for a smooth swipe.  The goal is a quick and smooth swiping experience on modern browsers.  I took advantage of -webkit-transition and -webkit-transform: translate3d(x,0,0) to achieve this.  Translate3d is graphically accelerated, which is why it is smoother than using absolute positioning and left/right properties.

## Features

* Smooth sliding transitions
* Swipe detection on mobile devices
* Moderate Size
* Configurable animating settings

## Usage

Make sure you are using either jQuery or Zepto.  Swiper.js expects your slider container to have certain CSS properties.  You can also check out this [example](http://dezignhero.github.io/swiper/).


**HTML**

	<div id="Pages">
		<ul class="container">
			<li class="page">1</li>
			<li class="page">2</li>
			<li class="page">3</li>
		</ul>
	</div>

**CSS**

	<style>
		html, body { width: 100%; height: 100%; }
		#Pages { width: 100%; height: 100%; overflow: hidden; }
			#Pages .container,
			#Pages .page { float: left; width: 100%; height: 100%; background: #f3f3f3; }
			#Pages .page { list-style: none; }
	</style>

**Javascript**

	<script>
		var s = new Swiper('#Pages', options);
	</script>

## Settings

Below are the default values used in the settings of the framework which can be altered if desired.

	<script>
		var s = new Swiper('#Pages', {
			ease : 0.3,
			swipeMin : 40,
			preventAdvance : false,
			container : '.container',
			controls : '.control',
			page : '.page'
		});
	</script>

* ease - This is the webkit transition property, and the time it takes for the slide to ease-out when you let go.  Default is 0.3s.
* swipeMin - How many pixel differences between touchMove events for a gesture to be considered a "swipe".  A swipe will trigger the next slide.  Default is 40 (pixels).
* preventAdvance - A function to disable and hide the prev/next controls. 
* container - The element that contains all the slides.  Default markup expects '.container'.
* controls - The selector used for jQuery/Zepto to grab and identify controls.  Default is '.control'.
* page : The selector used for jQuery/Zepto to grab and identify individual pages.  Default is '.page'.