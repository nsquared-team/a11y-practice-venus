/**
 * Destination Detail Page Interactions
 * Handles gallery, read more toggle, and other interactive elements
 */

(function() {
	'use strict';

	// DOM Elements
	const readMoreToggle = document.querySelector('.read-more-toggle');
	const readMoreContent = document.getElementById('description-extended');
	const thumbnailButtons = document.querySelectorAll('.gallery-thumbnails .thumbnail');
	const mainGalleryImage = document.querySelector('.gallery-main-image');

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
	 * Note: This is a placeholder implementation for the image gallery
	 * Real implementation would swap actual images
	 */
	function initGallery() {
		if (!thumbnailButtons.length || !mainGalleryImage) return;

		// Gallery image data (would come from data attributes or API in real implementation)
		const galleryData = [
			{ icon: 'fa-mountain', label: 'Mountain summit view' },
			{ icon: 'fa-campground', label: 'Base camp facilities' },
			{ icon: 'fa-fire', label: 'Volcanic terrain' },
			{ icon: 'fa-panorama', label: 'Panoramic vista' }
		];

		thumbnailButtons.forEach((button, index) => {
			button.addEventListener('click', function() {
				// Update active state on all thumbnails
				thumbnailButtons.forEach(btn => {
					btn.classList.remove('active');
					btn.setAttribute('aria-pressed', 'false');
				});

				// Set this thumbnail as active
				this.classList.add('active');
				this.setAttribute('aria-pressed', 'true');

				// Update main image (placeholder implementation)
				const iconElement = mainGalleryImage.querySelector('i');
				const labelElement = mainGalleryImage.querySelector('span');

				if (iconElement && galleryData[index]) {
					// Remove all fa-* classes except fa-4x
					iconElement.className = 'fas ' + galleryData[index].icon + ' fa-4x';
				}

				if (labelElement && galleryData[index]) {
					labelElement.textContent = galleryData[index].label;
				}

				// Update aria-label on main image
				mainGalleryImage.setAttribute('aria-label', galleryData[index]?.label || 'Gallery image');

				// Announce change to screen readers
				announceToScreenReader('Showing ' + (galleryData[index]?.label || 'image ' + (index + 1)));
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
