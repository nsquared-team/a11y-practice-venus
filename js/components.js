/**
 * Discover Venus - Reusable Components JavaScript
 * Handles interactive components (accordions, carousels, modals, etc.)
 */

(function () {
	'use strict';

	//
	// Modal Component
	//

	/**
	 * Modal - Accessible modal dialog component
	 *
	 * Features:
	 * - Opens via data-modal-open="modal-id" attribute
	 * - Closes via data-modal-close attribute, Escape key, or overlay click
	 * - Traps focus within modal when open
	 * - Returns focus to trigger element on close
	 * - Prevents body scroll when open
	 *
	 * Intentional Accessibility Issues (for testing):
	 * - data-a11y-issue="no-focus-trap" - Disables focus trapping
	 * - data-a11y-issue="no-escape" - Disables Escape key closing
	 * - Missing aria-labelledby on some modals
	 */

	var Modal = {
		// Store reference to the element that opened the modal
		triggerElement: null,

		// Store focusable elements within modal
		focusableElements: null,

		// Currently open modal
		currentModal: null,

		/**
		 * Initialize modal functionality
		 */
		init: function () {
			// Handle modal open triggers
			document.addEventListener('click', function (e) {
				var openTrigger = e.target.closest('[data-modal-open]');
				if (openTrigger) {
					e.preventDefault();
					var modalId = openTrigger.getAttribute('data-modal-open');
					var modal = document.getElementById(modalId);
					if (modal) {
						Modal.open(modal, openTrigger);
					}
				}

				// Handle modal close triggers
				var closeTrigger = e.target.closest('[data-modal-close]');
				if (closeTrigger && Modal.currentModal) {
					e.preventDefault();
					Modal.close();
				}
			});

			// Handle Escape key
			document.addEventListener('keydown', function (e) {
				if (e.key === 'Escape' && Modal.currentModal) {
					// Intentional a11y issue: Check if escape is disabled
					if (Modal.currentModal.hasAttribute('data-a11y-issue') &&
						Modal.currentModal.getAttribute('data-a11y-issue').includes('no-escape')) {
						// Do nothing - intentionally broken for testing
						return;
					}
					Modal.close();
				}
			});
		},

		/**
		 * Open a modal
		 * @param {HTMLElement} modal - The modal element to open
		 * @param {HTMLElement} trigger - The element that triggered the modal
		 */
		open: function (modal, trigger) {
			if (!modal) return;

			// Store trigger element for focus return
			this.triggerElement = trigger;
			this.currentModal = modal;

			// Show modal
			modal.removeAttribute('hidden');
			document.body.classList.add('modal-open');

			// Set up focus trap (unless intentionally disabled for testing)
			var hasNoFocusTrap = modal.hasAttribute('data-a11y-issue') &&
				modal.getAttribute('data-a11y-issue').includes('no-focus-trap');

			if (!hasNoFocusTrap) {
				this.setupFocusTrap(modal);
			}

			// Focus the first focusable element or the modal itself
			var firstFocusable = modal.querySelector(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			if (firstFocusable) {
				firstFocusable.focus();
			} else {
				modal.setAttribute('tabindex', '-1');
				modal.focus();
			}

			// Dispatch custom event
			modal.dispatchEvent(new CustomEvent('modal:open', { bubbles: true }));
		},

		/**
		 * Close the current modal
		 */
		close: function () {
			if (!this.currentModal) return;

			var modal = this.currentModal;

			// Hide modal
			modal.setAttribute('hidden', '');
			document.body.classList.remove('modal-open');

			// Remove focus trap
			this.removeFocusTrap();

			// Return focus to trigger element
			if (this.triggerElement) {
				this.triggerElement.focus();
			}

			// Dispatch custom event
			modal.dispatchEvent(new CustomEvent('modal:close', { bubbles: true }));

			// Clean up
			this.currentModal = null;
			this.triggerElement = null;
		},

		/**
		 * Set up focus trap within modal
		 * @param {HTMLElement} modal - The modal element
		 */
		setupFocusTrap: function (modal) {
			var focusableSelectors = [
				'button:not([disabled])',
				'[href]',
				'input:not([disabled])',
				'select:not([disabled])',
				'textarea:not([disabled])',
				'[tabindex]:not([tabindex="-1"])'
			].join(', ');

			this.focusableElements = modal.querySelectorAll(focusableSelectors);

			if (this.focusableElements.length === 0) return;

			var firstFocusable = this.focusableElements[0];
			var lastFocusable = this.focusableElements[this.focusableElements.length - 1];

			// Store the handler so we can remove it later
			this.focusTrapHandler = function (e) {
				if (e.key !== 'Tab') return;

				if (e.shiftKey) {
					// Shift + Tab
					if (document.activeElement === firstFocusable) {
						e.preventDefault();
						lastFocusable.focus();
					}
				} else {
					// Tab
					if (document.activeElement === lastFocusable) {
						e.preventDefault();
						firstFocusable.focus();
					}
				}
			};

			modal.addEventListener('keydown', this.focusTrapHandler);
		},

		/**
		 * Remove focus trap
		 */
		removeFocusTrap: function () {
			if (this.currentModal && this.focusTrapHandler) {
				this.currentModal.removeEventListener('keydown', this.focusTrapHandler);
			}
			this.focusTrapHandler = null;
			this.focusableElements = null;
		}
	};

	//
	// Carousel Component
	//

	/**
	 * Carousel - Auto-advancing slide carousel with navigation
	 *
	 * Features:
	 * - Auto-advances slides at configurable interval
	 * - Previous/Next arrow buttons
	 * - Dot indicators for slide position
	 * - Pause on hover
	 * - Keyboard navigation
	 *
	 * Intentional Accessibility Issues (for testing):
	 * - data-a11y-issue="no-pause" - No pause button for auto-play
	 * - data-a11y-issue="focusable-hidden" - Hidden slides remain focusable
	 * - data-a11y-issue="no-live-region" - No announcements for slide changes
	 * - Dot indicators may not be keyboard accessible
	 */

	var Carousel = {
		instances: [],

		/**
		 * Initialize all carousels on the page
		 */
		init: function() {
			var carousels = document.querySelectorAll('[data-carousel]');
			carousels.forEach(function(carousel) {
				Carousel.create(carousel);
			});
		},

		/**
		 * Create a carousel instance
		 * @param {HTMLElement} element - The carousel container element
		 */
		create: function(element) {
			var instance = {
				element: element,
				slides: element.querySelectorAll('[data-carousel-slide]'),
				prevBtn: element.querySelector('[data-carousel-prev]'),
				nextBtn: element.querySelector('[data-carousel-next]'),
				dotsContainer: element.querySelector('[data-carousel-dots]'),
				dots: [],
				currentIndex: 0,
				autoplayInterval: null,
				autoplayDelay: parseInt(element.getAttribute('data-carousel-delay')) || 5000,
				isPaused: false
			};

			if (instance.slides.length === 0) return;

			// Create dots if container exists
			if (instance.dotsContainer) {
				Carousel.createDots(instance);
			}

			// Set initial slide
			Carousel.goToSlide(instance, 0);

			// Previous button
			if (instance.prevBtn) {
				instance.prevBtn.addEventListener('click', function() {
					Carousel.prev(instance);
				});
			}

			// Next button
			if (instance.nextBtn) {
				instance.nextBtn.addEventListener('click', function() {
					Carousel.next(instance);
				});
			}

			// Keyboard navigation
			element.addEventListener('keydown', function(e) {
				if (e.key === 'ArrowLeft') {
					e.preventDefault();
					Carousel.prev(instance);
				} else if (e.key === 'ArrowRight') {
					e.preventDefault();
					Carousel.next(instance);
				}
			});

			// Pause on hover (unless intentionally disabled for testing)
			var hasNoPause = element.hasAttribute('data-a11y-issue') &&
				element.getAttribute('data-a11y-issue').includes('no-pause');

			if (!hasNoPause) {
				element.addEventListener('mouseenter', function() {
					instance.isPaused = true;
					Carousel.stopAutoplay(instance);
				});

				element.addEventListener('mouseleave', function() {
					instance.isPaused = false;
					Carousel.startAutoplay(instance);
				});

				// Also pause on focus within
				element.addEventListener('focusin', function() {
					instance.isPaused = true;
					Carousel.stopAutoplay(instance);
				});

				element.addEventListener('focusout', function(e) {
					// Only resume if focus left the carousel entirely
					if (!element.contains(e.relatedTarget)) {
						instance.isPaused = false;
						Carousel.startAutoplay(instance);
					}
				});
			}

			// Start autoplay if enabled
			if (element.hasAttribute('data-carousel-autoplay')) {
				Carousel.startAutoplay(instance);
			}

			// Handle hidden slide focusability
			var hasFocusableHidden = element.hasAttribute('data-a11y-issue') &&
				element.getAttribute('data-a11y-issue').includes('focusable-hidden');

			if (!hasFocusableHidden) {
				Carousel.updateFocusability(instance);
			}

			// Store instance
			Carousel.instances.push(instance);

			return instance;
		},

		/**
		 * Create dot indicators
		 * @param {Object} instance - Carousel instance
		 */
		createDots: function(instance) {
			instance.dotsContainer.innerHTML = '';

			for (var i = 0; i < instance.slides.length; i++) {
				var dot = document.createElement('button');
				dot.className = 'carousel-dot';
				// Intentional a11y issue: vague aria-label
				dot.setAttribute('aria-label', 'Slide ' + (i + 1));
				dot.setAttribute('data-slide-index', i);

				if (i === 0) {
					dot.classList.add('active');
					dot.setAttribute('aria-current', 'true');
				}

				dot.addEventListener('click', (function(index) {
					return function() {
						Carousel.goToSlide(instance, index);
					};
				})(i));

				instance.dotsContainer.appendChild(dot);
				instance.dots.push(dot);
			}
		},

		/**
		 * Go to a specific slide
		 * @param {Object} instance - Carousel instance
		 * @param {number} index - Target slide index
		 */
		goToSlide: function(instance, index) {
			// Wrap around
			if (index < 0) {
				index = instance.slides.length - 1;
			} else if (index >= instance.slides.length) {
				index = 0;
			}

			instance.currentIndex = index;

			// Update slides
			instance.slides.forEach(function(slide, i) {
				slide.classList.toggle('active', i === index);
				slide.setAttribute('aria-hidden', i !== index);
			});

			// Update dots
			instance.dots.forEach(function(dot, i) {
				dot.classList.toggle('active', i === index);
				if (i === index) {
					dot.setAttribute('aria-current', 'true');
				} else {
					dot.removeAttribute('aria-current');
				}
			});

			// Update focusability (unless intentionally broken)
			var hasFocusableHidden = instance.element.hasAttribute('data-a11y-issue') &&
				instance.element.getAttribute('data-a11y-issue').includes('focusable-hidden');

			if (!hasFocusableHidden) {
				Carousel.updateFocusability(instance);
			}

			// Announce change (unless intentionally broken)
			var hasNoLiveRegion = instance.element.hasAttribute('data-a11y-issue') &&
				instance.element.getAttribute('data-a11y-issue').includes('no-live-region');

			if (!hasNoLiveRegion) {
				// Dispatch custom event for announcements
				instance.element.dispatchEvent(new CustomEvent('carousel:change', {
					bubbles: true,
					detail: { index: index, total: instance.slides.length }
				}));
			}
		},

		/**
		 * Go to previous slide
		 * @param {Object} instance - Carousel instance
		 */
		prev: function(instance) {
			Carousel.goToSlide(instance, instance.currentIndex - 1);
		},

		/**
		 * Go to next slide
		 * @param {Object} instance - Carousel instance
		 */
		next: function(instance) {
			Carousel.goToSlide(instance, instance.currentIndex + 1);
		},

		/**
		 * Start autoplay
		 * @param {Object} instance - Carousel instance
		 */
		startAutoplay: function(instance) {
			if (instance.autoplayInterval) return;

			instance.autoplayInterval = setInterval(function() {
				if (!instance.isPaused) {
					Carousel.next(instance);
				}
			}, instance.autoplayDelay);
		},

		/**
		 * Stop autoplay
		 * @param {Object} instance - Carousel instance
		 */
		stopAutoplay: function(instance) {
			if (instance.autoplayInterval) {
				clearInterval(instance.autoplayInterval);
				instance.autoplayInterval = null;
			}
		},

		/**
		 * Update focusability of slides
		 * @param {Object} instance - Carousel instance
		 */
		updateFocusability: function(instance) {
			instance.slides.forEach(function(slide, i) {
				var focusableElements = slide.querySelectorAll(
					'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);

				focusableElements.forEach(function(el) {
					if (i === instance.currentIndex) {
						el.removeAttribute('tabindex');
					} else {
						el.setAttribute('tabindex', '-1');
					}
				});
			});
		}
	};

	//
	// Initialize all components
	//

	// Initialize Modal
	Modal.init();

	// Initialize Carousel
	Carousel.init();

	// Expose components to window for programmatic use
	window.DiscoverVenusModal = Modal;
	window.DiscoverVenusCarousel = Carousel;

})();
