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

	// Initialize accordion
	initAccordion();

})();
