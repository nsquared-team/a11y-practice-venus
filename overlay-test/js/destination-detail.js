/**
 * Destination Detail Page Interactions
 * Handles gallery, lightbox, read more toggle, and other interactive elements
 */

(function() {
	'use strict';

	// DOM Elements
	const readMoreToggle = document.querySelector('.read-more-toggle');
	const readMoreContent = document.getElementById('description-extended');
	const thumbnailButtons = document.querySelectorAll('.gallery-thumbnails .thumbnail');
	const mainGalleryImage = document.querySelector('.gallery-main-image');
	const galleryOpenButton = document.querySelector('[data-gallery-open]');

	// Lightbox Elements
	const lightboxModal = document.getElementById('gallery-lightbox-modal');
	const lightboxImage = document.getElementById('lightbox-current-image');
	const lightboxPrev = document.querySelector('[data-lightbox-prev]');
	const lightboxNext = document.querySelector('[data-lightbox-next]');
	const lightboxCurrentSpan = document.querySelector('.lightbox-current');
	const lightboxTotalSpan = document.querySelector('.lightbox-total');

	// Gallery state
	let currentGalleryIndex = 0;

	// Gallery image data with full-size URLs
	const galleryImages = [
		{
			thumb: 'https://picsum.photos/150/150?random=1',
			full: 'https://picsum.photos/1200/800?random=1',
			alt: 'Maxwell Montes main view - towering peaks against Venusian sky'
		},
		{
			thumb: 'https://picsum.photos/150/150?random=2',
			full: 'https://picsum.photos/1200/800?random=2',
			alt: 'Base camp facilities at Maxwell Montes'
		},
		{
			thumb: 'https://picsum.photos/150/150?random=3',
			full: 'https://picsum.photos/1200/800?random=3',
			// Intentional A11y Issue: Missing alt text
			alt: ''
		},
		{
			thumb: 'https://picsum.photos/150/150?random=4',
			full: 'https://picsum.photos/1200/800?random=4',
			alt: 'Panoramic vista from Maxwell Montes summit'
		}
	];

	/**
	 * Initialize Read More Toggle
	 */
	function initReadMore() {
		if (!readMoreToggle || !readMoreContent) return;

		readMoreToggle.addEventListener('click', function() {
			const isExpanded = this.getAttribute('aria-expanded') === 'true';
			const moreText = this.querySelector('.more-text');
			const lessText = this.querySelector('.less-text');
			const icon = this.querySelector('i');

			// Toggle expanded state
			this.setAttribute('aria-expanded', !isExpanded);
			readMoreContent.hidden = isExpanded;

			// Toggle text visibility
			if (moreText) moreText.hidden = !isExpanded;
			if (lessText) lessText.hidden = isExpanded;

			// Rotate icon
			if (icon) {
				icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
			}

			// If expanding, scroll content into view
			if (!isExpanded) {
				readMoreContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		});
	}

	/**
	 * Initialize Gallery Thumbnails
	 */
	function initGallery() {
		if (!thumbnailButtons.length || !mainGalleryImage) return;

		thumbnailButtons.forEach((button, index) => {
			button.addEventListener('click', function() {
				selectGalleryImage(index);
			});

			// Keyboard navigation between thumbnails
			button.addEventListener('keydown', function(e) {
				let targetIndex = index;

				if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
					e.preventDefault();
					targetIndex = (index + 1) % thumbnailButtons.length;
				} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
					e.preventDefault();
					targetIndex = (index - 1 + thumbnailButtons.length) % thumbnailButtons.length;
				} else if (e.key === 'Home') {
					e.preventDefault();
					targetIndex = 0;
				} else if (e.key === 'End') {
					e.preventDefault();
					targetIndex = thumbnailButtons.length - 1;
				}

				if (targetIndex !== index) {
					thumbnailButtons[targetIndex].focus();
					thumbnailButtons[targetIndex].click();
				}
			});
		});

		// Initialize gallery open button (main image click)
		if (galleryOpenButton) {
			galleryOpenButton.addEventListener('click', function() {
				openLightbox(currentGalleryIndex);
			});
		}
	}

	/**
	 * Select a gallery image by index
	 */
	function selectGalleryImage(index) {
		if (index < 0 || index >= galleryImages.length) return;

		currentGalleryIndex = index;

		// Update active state on all thumbnails
		thumbnailButtons.forEach((btn, i) => {
			btn.classList.toggle('active', i === index);
			btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
		});

		// Update main image
		if (mainGalleryImage && galleryImages[index]) {
			// Use medium size for main gallery view
			mainGalleryImage.src = 'https://picsum.photos/800/500?random=' + (index + 1);
			mainGalleryImage.alt = galleryImages[index].alt;
		}

		// Announce change to screen readers
		if (galleryImages[index].alt) {
			announceToScreenReader('Showing ' + galleryImages[index].alt);
		} else {
			announceToScreenReader('Showing image ' + (index + 1) + ' of ' + galleryImages.length);
		}
	}

	/**
	 * Initialize Lightbox
	 */
	function initLightbox() {
		if (!lightboxModal || !lightboxImage) return;

		// Update total count
		if (lightboxTotalSpan) {
			lightboxTotalSpan.textContent = galleryImages.length;
		}

		// Previous button
		if (lightboxPrev) {
			lightboxPrev.addEventListener('click', function() {
				navigateLightbox(-1);
			});
		}

		// Next button
		if (lightboxNext) {
			lightboxNext.addEventListener('click', function() {
				navigateLightbox(1);
			});
		}

		// Keyboard navigation in lightbox
		// Intentional A11y Issue: Arrow keys work but screen reader users may not know about them
		document.addEventListener('keydown', function(e) {
			if (!lightboxModal || lightboxModal.hidden) return;

			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				navigateLightbox(-1);
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				navigateLightbox(1);
			}
		});

		// Touch/swipe support for mobile
		let touchStartX = 0;
		let touchEndX = 0;

		lightboxModal.addEventListener('touchstart', function(e) {
			touchStartX = e.changedTouches[0].screenX;
		}, { passive: true });

		lightboxModal.addEventListener('touchend', function(e) {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		}, { passive: true });

		function handleSwipe() {
			const swipeThreshold = 50;
			const diff = touchStartX - touchEndX;

			if (Math.abs(diff) > swipeThreshold) {
				if (diff > 0) {
					// Swipe left - next image
					navigateLightbox(1);
				} else {
					// Swipe right - previous image
					navigateLightbox(-1);
				}
			}
		}
	}

	/**
	 * Open lightbox at specific index
	 */
	function openLightbox(index) {
		if (!lightboxModal || !window.DiscoverVenusModal) return;

		// Update lightbox image
		updateLightboxImage(index);

		// Use the modal component to open
		window.DiscoverVenusModal.open(lightboxModal, galleryOpenButton);
	}

	/**
	 * Navigate lightbox by direction (-1 for prev, 1 for next)
	 */
	function navigateLightbox(direction) {
		const newIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
		currentGalleryIndex = newIndex;
		updateLightboxImage(newIndex);

		// Also update the main gallery thumbnail selection
		selectGalleryImage(newIndex);
	}

	/**
	 * Update lightbox image display
	 */
	function updateLightboxImage(index) {
		if (!lightboxImage || !galleryImages[index]) return;

		// Show loading state
		lightboxImage.style.opacity = '0.5';

		// Update image
		lightboxImage.src = galleryImages[index].full;
		lightboxImage.alt = galleryImages[index].alt;

		// Update counter (Intentional A11y Issue: Not announced to screen readers)
		if (lightboxCurrentSpan) {
			lightboxCurrentSpan.textContent = index + 1;
		}

		// When image loads, show it
		lightboxImage.onload = function() {
			lightboxImage.style.opacity = '1';
		};

		// Update button states for visual cue (but still allow wrapping)
		if (lightboxPrev) {
			lightboxPrev.classList.toggle('at-start', index === 0);
		}
		if (lightboxNext) {
			lightboxNext.classList.toggle('at-end', index === galleryImages.length - 1);
		}
	}

	/**
	 * Initialize Tour Selection Form
	 */
	function initTourSelection() {
		const tourSelect = document.getElementById('tour-select');
		const dateSelect = document.getElementById('date-select');

		if (!tourSelect || !dateSelect) return;

		// Tour date availability data
		const tourDates = {
			'summit-express': [
				{ value: '2026-03-15', label: 'March 15, 2026' },
				{ value: '2026-04-02', label: 'April 2, 2026' },
				{ value: '2026-04-20', label: 'April 20, 2026' }
			],
			'extended': [
				{ value: '2026-03-22', label: 'March 22, 2026' },
				{ value: '2026-04-15', label: 'April 15, 2026' },
				{ value: '2026-05-05', label: 'May 5, 2026' }
			],
			'private': [
				{ value: 'custom', label: 'Contact us for custom dates' }
			]
		};

		tourSelect.addEventListener('change', function() {
			const selectedTour = this.value;
			const dates = tourDates[selectedTour] || [];

			// Clear existing options except placeholder
			dateSelect.innerHTML = '<option value="">Choose a date...</option>';

			// Add new options
			dates.forEach(date => {
				const option = document.createElement('option');
				option.value = date.value;
				option.textContent = date.label;
				dateSelect.appendChild(option);
			});

			// Enable/disable date select
			dateSelect.disabled = !selectedTour;
		});
	}

	/**
	 * Initialize Review Helpful Buttons
	 */
	function initReviewInteractions() {
		const helpfulButtons = document.querySelectorAll('.review-footer .helpful-count');

		helpfulButtons.forEach(button => {
			// Convert to actual buttons for better accessibility
			const span = button;
			const text = span.textContent;

			// Make interactive (in a real app, this would be a proper button)
			span.style.cursor = 'pointer';
			span.setAttribute('role', 'button');
			span.setAttribute('tabindex', '0');
			span.setAttribute('aria-label', text + '. Click to mark as helpful.');

			const handleClick = function() {
				// Toggle helpful state
				if (this.classList.contains('marked-helpful')) {
					this.classList.remove('marked-helpful');
					announceToScreenReader('Removed helpful vote');
				} else {
					this.classList.add('marked-helpful');
					announceToScreenReader('Marked as helpful');
				}
			};

			span.addEventListener('click', handleClick);
			span.addEventListener('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					handleClick.call(this);
				}
			});
		});
	}

	/**
	 * Initialize Reviews Pagination
	 */
	function initReviewsPagination() {
		const prevBtn = document.querySelector('.reviews-pagination .pagination-btn:first-child');
		const nextBtn = document.querySelector('.reviews-pagination .pagination-btn:last-child');
		const pageInfo = document.querySelector('.pagination-info');

		if (!prevBtn || !nextBtn || !pageInfo) return;

		let currentPage = 1;
		const totalPages = 15;

		function updatePagination() {
			pageInfo.textContent = 'Page ' + currentPage + ' of ' + totalPages;
			prevBtn.disabled = currentPage === 1;
			nextBtn.disabled = currentPage === totalPages;

			// In a real implementation, this would fetch new reviews
			announceToScreenReader('Page ' + currentPage + ' of ' + totalPages);
		}

		prevBtn.addEventListener('click', function() {
			if (currentPage > 1) {
				currentPage--;
				updatePagination();
			}
		});

		nextBtn.addEventListener('click', function() {
			if (currentPage < totalPages) {
				currentPage++;
				updatePagination();
			}
		});
	}

	/**
	 * Announce message to screen readers
	 */
	function announceToScreenReader(message) {
		let announcer = document.getElementById('sr-announcer');

		if (!announcer) {
			announcer = document.createElement('div');
			announcer.id = 'sr-announcer';
			announcer.setAttribute('aria-live', 'polite');
			announcer.setAttribute('aria-atomic', 'true');
			announcer.className = 'screen-reader-text';
			document.body.appendChild(announcer);
		}

		// Clear and set message (triggers announcement)
		announcer.textContent = '';
		setTimeout(() => {
			announcer.textContent = message;
		}, 100);
	}

	/**
	 * Initialize Smooth Scroll for Anchor Links
	 */
	function initSmoothScroll() {
		const anchors = document.querySelectorAll('a[href^="#"]');

		anchors.forEach(anchor => {
			anchor.addEventListener('click', function(e) {
				const targetId = this.getAttribute('href');
				if (targetId === '#') return;

				const target = document.querySelector(targetId);
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth' });

					// Set focus to target for accessibility
					target.setAttribute('tabindex', '-1');
					target.focus();
				}
			});
		});
	}

	/**
	 * Initialize All Components
	 */
	function init() {
		initReadMore();
		initGallery();
		initLightbox();
		initTourSelection();
		initReviewInteractions();
		initReviewsPagination();
		initSmoothScroll();
	}

	// Run on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
