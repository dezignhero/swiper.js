/*
swiper.js

Full page slider for touch enabled devices. 

Requires: jQuery or Zepto
Author URL: https://github.com/dezignhero

*/

var Swiper = function(selector, options) {

	/*------- Globals -------*/

	var viewportWidth = 0,
		frameWidth = 0,
		animating = false,
		numSlides = 0,
		limitEnd = 0,
		goTo = 0,
		currentSlide = 0,
		orientation = 0;

	// Swiping
	var swipe = {
		started : false,
		startX : 0,
		endX : 0,
		at : 0,
		strength : 0
	};

	// Settings
	var settings = {
		ease : 0.3,
		swipeMin : 40,
		preventAdvance : false,
		container : '.container',
		frame : '.page',
		frameWidth : false,  // accepts a number in pixels
		controls : '.control',
		clickEvent : 'click',
		updateEvent : 'update',
		controlsOnly : false,
	};

	/*------- Handles -------*/
	
	var el = selector,
		$parent = $(el),
		$container, $controls, $frame, $prevCtrl, $nextCtrl;
	
	/*------- Methods -------*/

	var init = function(options) {
		// Exit if element doesn't exist
		if ( $(el).length == 0 ) return;

		// Merge settings
		settings = $.extend(settings, options || {});

		// Initialize handles
		$container = $(settings.container, el);
		$controls = $(settings.controls, el);
		$frame = $(settings.frame, el);

		// Assign Ids to frames
		$frame.each(function(i){
			$(this).attr('data-id', i);
			numSlides++;
		});

		// Add initial class
		$($frame.selector+'[data-id=0]', el).addClass('current');

		// Set Dimensions
		resize();

		// Setup CSS
		$container.css({
			'-webkit-transition' : 'all '+settings.ease+'s ease-out',
			'-webkit-transform' : 'translate3d(0,0,0)',  // Performance optimization, put onto own layer for faster start
			'left' : 0
		});

		// Monitoring controls if they exist
		if ( $controls.length > 0 ) {
			// Determine whether or not to use click event
			if ('ontouchstart' in document.documentElement) {
				settings.clickEvent = 'touchstart';
			}

			// Create handlers
			$prevCtrl = $(settings.controls+'[data-action=prev]');
			$nextCtrl = $(settings.controls+'[data-action=next]');

			// Bind behavior
			$controls.on(settings.clickEvent, function(){
				var self = $(this),
					action = self.attr('data-action');

				// Ensure action defined
				if ( typeof action == 'undefined' ) return;

				if ( action == 'next' && currentSlide < numSlides - 1 ) {
					goTo = currentSlide + 1;
				} else if ( action == 'prev' && currentSlide > 0 ) {
					goTo = currentSlide - 1;
				}

				// Move container
				jumpTo(goTo);
			});
		}

		// Display controls correctly
		if ( settings.preventAdvance ) {
			disableSliding();
		} else {
			updateControls();
		}

		// Swiping
		if ( !settings.controlsOnly ) {
			$container[0].addEventListener('touchstart', function(e) { touchStart(e); }, false);
			$container[0].addEventListener('touchmove', function(e) { touchMove(e); }, false);
			$container[0].addEventListener('touchend', function(e) { touchEnd(e); }, false);
			// Desktop
			$container[0].addEventListener('mousedown', function(e) { touchStart(e); }, false);
			$container[0].addEventListener('mousemove', function(e) { if (e.which==1) { touchMove(e); } }, false);
			$container[0].addEventListener('mouseup', function(e) { touchEnd(e); }, false);
		}

		// Prevent anchor tags from getting in the way
		$('a', el).on('touchstart click', function(){
			return swipe.started ? false : true;
		});

		// Prevent image dragging on getting in the way
		$('img', el).on('dragstart', function(){
			return false;
		});

		// Check if Android
		var ua = navigator.userAgent.toLowerCase(),
			isAndroid = ua.indexOf("android") > -1;

		// Orientation Change
		orientation = window.orientation;
		var supportsOrientationChange = "onorientationchange" in window,
			orientationEvent = (supportsOrientationChange && !isAndroid) ? "orientationchange" : "resize";

		// Listener for orientation changes
		window.addEventListener(orientationEvent, function() {
			// Prevent 'fake' orientation calls
			if ( orientation != window.orientation ) {
				orientation = window.orientation;
				resize(function(){
					jumpTo(currentSlide);
				});
			}
		}, false);
	},

	resize = function(callback){
		viewportWidth = $parent.width();
		frameWidth = ( settings.frameWidth ) ? settings.frameWidth : viewportWidth;

		// Apply new sizes
		$frame.width(frameWidth);
		$container.width(frameWidth*numSlides);

		// Set end limit
		limitEnd = settings.frameWidth ? viewportWidth/frameWidth : numSlides;

		// callback
		if ( typeof callback == 'function' ) {
			callback();
		}
	},

	touchStart = function(e) {
		swipe.at = getPosition();  // for touch move
		// Get start point
		swipe.startX = e.touches ? e.touches[0].pageX : e.pageX;
		swipe.startY = e.touches ? e.touches[0].pageY : e.pageY;
		swipe.endX = swipe.startX;  // prevent click swiping when touchMove doesn't fire
	},
	
	touchEnd = function(e) {
		swipe.started = false;

		// Nullify event
		e.preventDefault();

		if ( animating ) return;
		
		var moved = swipe.endX - swipe.startX,
			threshold = frameWidth / 3;

		goTo = currentSlide;

		// Figure out closest slide
		if ( Math.abs(moved) > threshold || swipe.strength > settings.swipeMin ) {
			if ( moved > 0 && currentSlide > 0 ) {
				goTo--;
			} else if ( moved < 0 && currentSlide < limitEnd-1 ) {
				goTo++;
			}
		}
		
		// Jump to closest        
		jumpTo(goTo);
	},
	
	touchMove = function(e) {
		if ( !$parent.hasClass('disabled') ) {
			swipe.started = true;
			var touchX = e.touches ? e.touches[0].pageX : e.pageX,
				touchY = e.touches ? e.touches[0].pageY : e.pageY,
				dX = touchX - swipe.startX,
				dY = touchY - swipe.startY;

			swipe.strength = Math.abs(touchX - swipe.endX);
			swipe.endX = touchX;
			
			// Escape if motion wrong
			if ( Math.abs(dX) < Math.abs(dY) ) return;

			e.preventDefault();

			// Always run this so that hit the ends
			animate(swipe.at+dX, false);
		}
	},

	getPosition = function() {
		// Get current point and Stay there
		var style = document.defaultView.getComputedStyle($container[0], null),
			transform = new WebKitCSSMatrix(style.webkitTransform);

		// Return position based on direction
		return transform.m41;
	},
	
	animate = function(scrollTo, ease) {
		// Momentum Effect or Not
		$container[0].style.webkitTransition = ( ease ) ? 'all '+settings.ease+'s ease-out' : 'none';
		$container[0].style.webkitTransform = 'translate3d('+scrollTo+'px,0,0)';

		// Allow animating again
		if ( ease ) {
			animating = true;
			window.setTimeout(function(){
				animating = false;
			}, settings.ease*1000);
		}
	},

	jumpTo = function(num, ease) {
		// Keep within range
		if ( num >= 0 && num < limitEnd ) {

			// Animate
			var hasEase = ( typeof ease !== 'undefined' ) ? ease : true;
			animate(-num*frameWidth, hasEase);

			// If new slide
			if ( num != currentSlide ) {
				// Update current slide
				currentSlide = num;

				// Update current slide
				$frame.removeClass('current');
				$($frame.selector+'[data-id='+currentSlide+']').addClass('current');

				// Update parent to trigger update event and new slide
				$parent.trigger(settings.updateEvent, [ currentSlide, Math.floor(limitEnd) ]);

				// Control Buttons
				updateControls();

				// Disable Again
				if ( settings.preventAdvance ) {
					disableSliding();
				}
			}
		}
	},

	updateControls = function() {
		// Only run if controls exist
		if ( $controls.length == 0 ) return;

		if ( currentSlide >= 0 && currentSlide < limitEnd ) {
			$controls.show();
			if ( currentSlide == 0 ) {
				$prevCtrl.hide();
			} else if ( currentSlide == limitEnd-1 ) {
				$nextCtrl.hide();
			}   
		} else {
			$controls.hide();
		}
	},

	disableSliding = function() {
		// Hide Controls
		$('.control', el).hide();
		// Add disabled flag
		$parent.addClass('disabled');
	},

	enableSliding = function() {
		// Enable control buttons
		updateControls();
		// Remove disabled flag
		$parent.removeClass('disabled');
	};

	// Initialize the object
	init(options);

	return {

		element : $parent,

		jumpTo : jumpTo,

		swiping : function() {
			return swipe.started;
		},

		disableSliding : disableSliding,

		enableSliding : enableSliding,

		status : function() {
			return {
				'current' : currentSlide+1,
				'total' : numSlides
			}
		},

		next : function() {
			jumpTo(currentSlide+1);
		},

		prev : function() {
			jumpTo(currentSlide-1);  
		}
	};

}