swiper.js
=========

Full page slider for touch enabled devices.  Currently supports WebKit devices only. 

**Requires jQuery/Zepto**

## Introduction

swiper.js takes a slider or a full page and allows it to be touch enabled.  This is perfect for full-page slideshows on mobile devices, and utilizes CSS3 properties for a smooth swipe.  The goal is a quick and smooth swiping experience on modern browsers.  I took advantage of -webkit-transition and -webkit-transform: translate3d() to achieve this.  Translate3d is graphically accelerated, which is why it is smoother than using absolute positioning and left/right properties.

## Features

* Smooth sliding transitions
* Swipe detection on mobile devices
* Moderate Size
* Configurable animating settings

## Usage

	<script>
		var s = new Swiper('#SliderId');
	</script>

## Settings

* ease - This is the webkit transition property, and the time it takes for the slide to ease-out when you let go.  Default is 0.2s.
* sensitivity - How far across the screen a user needs to swipe before slider.js considers it the next slide.  Default is 3.  A value of 3 means that you have to pass 1/3 of the page width to be considered a full swipe.
* preventAdvance - A function to disable and hide the prev/next controls. 
* container - The element that contains all the slides.  Default markup expects '.container'.
* controls - The selector used for jQuery/Zepto to grab and identify controls.  Default is '.control'.
* page : The selector used for jQuery/Zepto to grab and identify individual pages.  Default is '.page'.