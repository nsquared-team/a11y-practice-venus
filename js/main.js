/**
 * Discover Venus - Main JavaScript
 * Global functionality for the site
 */

(function () {
	'use strict';

	//
	// Variables
	//

	var siteNav = document.querySelector('.site-navigation');
	var navContainer = document.querySelector('.nav-container');

	//
	// Methods
	//

	var handleToggle = function (event) {
		navContainer.classList.toggle('open');
	};

	/**
	 * FAQ Accordion
	 * Handles expand/collapse functionality for FAQ items
	 */
	var initAccordion = function () {
		var faqList = document.querySelector('.faq-list');

		if (!faqList) return;

		faqList.addEventListener('click', function (e) {
			// Find the button that was clicked (or its parent if icon was clicked)
			var button = e.target.closest('.faq-question button');

			if (!button) return;

			// Get the current expanded state
			var isExpanded = button.getAttribute('aria-expanded') === 'true';

			// Get the associated answer panel
			var answerId = button.getAttribute('aria-controls');
			var answer = document.getElementById(answerId);

			if (!answer) return;

			// Toggle the state
			button.setAttribute('aria-expanded', !isExpanded);

			if (isExpanded) {
				// Collapse: add hidden attribute
				answer.setAttribute('hidden', '');
			} else {
				// Expand: remove hidden attribute
				answer.removeAttribute('hidden');
			}
		});
	};

	//
	// Inits & Event Listeners
	//

	if (siteNav) {
		siteNav.addEventListener('click', function (e) {
			var el = e.target;
			while (el != this) {
				if (el && el.classList.contains('nav-toggle')) {
					handleToggle(e);
				}
				if (el && el.nodeName == 'A' && navContainer.classList.contains('open')) {
					handleToggle(e);
				}
				el = el.parentNode;
			}
		});
	}

	/**
	 * Scroll Animations
	 * Uses IntersectionObserver to trigger animations when elements enter viewport
	 */
	var initScrollAnimations = function () {
		// Check for IntersectionObserver support
		if (!('IntersectionObserver' in window)) {
			// Fallback: just show all elements
			var elements = document.querySelectorAll('.scroll-animate, .scroll-animate--left, .scroll-animate--right, .scroll-animate--scale, .scroll-animate-stagger');
			elements.forEach(function (el) {
				el.classList.add('is-visible');
			});
			return;
		}

		// Configuration for the observer
		var observerOptions = {
			root: null, // viewport
			rootMargin: '0px 0px -50px 0px', // trigger slightly before element is fully visible
			threshold: 0.1 // trigger when 10% of element is visible
		};

		// Callback function when elements intersect
		var observerCallback = function (entries, observer) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					// Once animated, stop observing (animation only plays once)
					observer.unobserve(entry.target);
				}
			});
		};

		// Create the observer
		var observer = new IntersectionObserver(observerCallback, observerOptions);

		// Select all elements with scroll animation classes
		var animatedElements = document.querySelectorAll(
			'.scroll-animate, .scroll-animate--left, .scroll-animate--right, .scroll-animate--scale, .scroll-animate-stagger'
		);

		// Observe each element
		animatedElements.forEach(function (el) {
			observer.observe(el);
		});
	};

	/**
	 * Page Load Animations
	 * Adds animation classes to key page elements on load
	 */
	var initPageLoadAnimations = function () {
		// Animate hero content on page load
		var heroContent = document.querySelector('.hero-text');
		if (heroContent) {
			heroContent.classList.add('animate-fade-in-up');
		}

		// Animate page headers
		var pageHeader = document.querySelector('.page-header');
		if (pageHeader) {
			pageHeader.classList.add('animate-fade-in');
		}
	};

	//
	// Inits & Event Listeners
	//

	// Initialize accordion
	initAccordion();

	// Initialize scroll animations
	initScrollAnimations();

	// Initialize page load animations
	initPageLoadAnimations();

})();
