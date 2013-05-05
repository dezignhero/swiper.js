swiper.js
=========

**Requires jQuery/Zepto**

Full page slider for touch enabled devices.  Currently supports WebKit devices only. 

## Introduction

swiper.js takes a slider or a full page and allows it to be touch enabled.  This is perfect for full-page slideshows on mobile devices, and utilizes CSS3 properties for a smooth swipe.  The goal is a quick and smooth swiping experience on modern browsers.  I took advantage of -webkit-transition and -webkit-transform: translate3d() to achieve this.  Translate3d is graphically accelerated, which is why it is smoother than using absolute positioning and left/right properties.

## Features

* Smooth sliding transitions
* Swipe detection on mobile devices
* Moderate Size
* Configurable animating settings

## Usage

Make sure you are using either jQuery or Zepto.  Swiper.js expects your slider container to have certain CSS properties.

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
		#Pages { width: 100%; height: 100%; overflow: hidden; }
			#Pages .container,
			#Pages .page { float: left; width: 100%; height: 100%; background: #f3f3f3; }
			#Pages .page { list-style: none; }
	</style>

**Javascript**

	<script>
		var s = new Swiper('#SliderId', options);
	</script>

## Settings

Below are the default values used in the settings of the framework which can be altered if desired.

	<script>
		var s = new Swiper('#SliderId', {
			ease : 0.2,
			sensitivity : 3,
			preventAdvance : false,
			container : '.container',
			controls : '.control',
			page : '.page'
		});
	</script>

* ease - This is the webkit transition property, and the time it takes for the slide to ease-out when you let go.  Default is 0.2s.
* sensitivity - How far across the screen a user needs to swipe before slider.js considers it the next slide.  Default is 3.  A value of 3 means that you have to pass 1/3 of the page width to be considered a full swipe.
* preventAdvance - A function to disable and hide the prev/next controls. 
* container - The element that contains all the slides.  Default markup expects '.container'.
* controls - The selector used for jQuery/Zepto to grab and identify controls.  Default is '.control'.
* page : The selector used for jQuery/Zepto to grab and identify individual pages.  Default is '.page'.