/**
 * Destinations Page - Filtering and Sorting Functionality
 */

(function() {
	'use strict';

	// DOM Elements
	const grid = document.getElementById('destinations-grid');
	const filterRegion = document.getElementById('filter-region');
	const filterType = document.getElementById('filter-type');
	const filterDifficulty = document.getElementById('filter-difficulty');
	const filterPrice = document.getElementById('filter-price');
	const sortBy = document.getElementById('sort-by');
	const visibleCount = document.getElementById('visible-count');
	const totalCount = document.getElementById('total-count');
	const activeFiltersContainer = document.getElementById('active-filters');
	const filterTagsContainer = document.getElementById('filter-tags');
	const clearFiltersBtn = document.getElementById('clear-filters');
	const noResults = document.getElementById('no-results');
	const resetFiltersBtn = document.getElementById('reset-filters');

	// Exit if not on destinations page
	if (!grid) return;

	// Get all destination cards
	const cards = Array.from(grid.querySelectorAll('.destination-card'));
	const total = cards.length;

	// Set total count
	if (totalCount) {
		totalCount.textContent = total;
	}

	// Difficulty order for sorting
	const difficultyOrder = {
		'easy': 1,
		'moderate': 2,
		'challenging': 3,
		'extreme': 4
	};

	// Filter labels for display
	const filterLabels = {
		'region': {
			'ishtar-terra': 'Ishtar Terra',
			'aphrodite-terra': 'Aphrodite Terra',
			'beta-regio': 'Beta Regio',
			'atla-regio': 'Atla Regio',
			'northern': 'Northern Hemisphere',
			'southern': 'Southern Hemisphere',
			'equatorial': 'Equatorial'
		},
		'type': {
			'highland': 'Highland/Terra',
			'volcano': 'Volcano',
			'tessera': 'Tessera',
			'plain': 'Plain/Plateau',
			'corona': 'Corona',
			'chasma': 'Chasma/Rift',
			'other': 'Other Features'
		},
		'difficulty': {
			'easy': 'Easy',
			'moderate': 'Moderate',
			'challenging': 'Challenging',
			'extreme': 'Extreme'
		},
		'price': {
			'budget': 'Under $20,000',
			'mid': '$20,000 - $40,000',
			'premium': '$40,000+'
		}
	};

	/**
	 * Get current filter values
	 */
	function getFilters() {
		return {
			region: filterRegion ? filterRegion.value : '',
			type: filterType ? filterType.value : '',
			difficulty: filterDifficulty ? filterDifficulty.value : '',
			price: filterPrice ? filterPrice.value : ''
		};
	}

	/**
	 * Get current sort value
	 */
	function getSort() {
		return sortBy ? sortBy.value : 'name-asc';
	}

	/**
	 * Check if a card matches the current filters
	 */
	function cardMatchesFilters(card, filters) {
		// Region filter - check if any of the card's regions match
		if (filters.region) {
			const cardRegions = card.dataset.region.split(' ');
			if (!cardRegions.includes(filters.region)) {
				return false;
			}
		}

		// Type filter
		if (filters.type && card.dataset.type !== filters.type) {
			return false;
		}

		// Difficulty filter
		if (filters.difficulty && card.dataset.difficulty !== filters.difficulty) {
			return false;
		}

		// Price filter
		if (filters.price && card.dataset.price !== filters.price) {
			return false;
		}

		return true;
	}

	/**
	 * Sort cards based on current sort selection
	 */
	function sortCards(cardsToSort, sortValue) {
		const [field, direction] = sortValue.split('-');
		const multiplier = direction === 'asc' ? 1 : -1;

		return cardsToSort.sort((a, b) => {
			let valueA, valueB;

			switch (field) {
				case 'name':
					valueA = a.dataset.name.toLowerCase();
					valueB = b.dataset.name.toLowerCase();
					return multiplier * valueA.localeCompare(valueB);

				case 'price':
					valueA = parseInt(a.dataset.priceValue, 10);
					valueB = parseInt(b.dataset.priceValue, 10);
					return multiplier * (valueA - valueB);

				case 'difficulty':
					valueA = difficultyOrder[a.dataset.difficulty] || 0;
					valueB = difficultyOrder[b.dataset.difficulty] || 0;
					return multiplier * (valueA - valueB);

				default:
					return 0;
			}
		});
	}

	/**
	 * Update the active filters display
	 */
	function updateActiveFilters(filters) {
		if (!filterTagsContainer || !activeFiltersContainer) return;

		// Clear existing tags
		filterTagsContainer.innerHTML = '';

		// Check if any filters are active
		const hasActiveFilters = Object.values(filters).some(v => v !== '');

		if (hasActiveFilters) {
			activeFiltersContainer.hidden = false;

			// Create tags for each active filter
			Object.entries(filters).forEach(([key, value]) => {
				if (value) {
					const tag = document.createElement('button');
					tag.type = 'button';
					tag.className = 'filter-tag';
					tag.innerHTML = `${filterLabels[key][value]} <i class="fas fa-times" aria-hidden="true"></i>`;
					tag.setAttribute('aria-label', `Remove ${filterLabels[key][value]} filter`);
					tag.addEventListener('click', function() {
						// Clear this specific filter
						const selectElement = document.getElementById(`filter-${key}`);
						if (selectElement) {
							selectElement.value = '';
							applyFiltersAndSort();
						}
					});
					filterTagsContainer.appendChild(tag);
				}
			});
		} else {
			activeFiltersContainer.hidden = true;
		}
	}

	/**
	 * Apply filters and sorting to the grid
	 */
	function applyFiltersAndSort() {
		const filters = getFilters();
		const sortValue = getSort();

		// Filter cards
		let visibleCards = [];
		let hiddenCount = 0;

		cards.forEach(card => {
			if (cardMatchesFilters(card, filters)) {
				card.hidden = false;
				card.style.display = '';
				visibleCards.push(card);
			} else {
				card.hidden = true;
				card.style.display = 'none';
				hiddenCount++;
			}
		});

		// Sort visible cards
		visibleCards = sortCards(visibleCards, sortValue);

		// Re-order cards in the DOM
		visibleCards.forEach(card => {
			grid.appendChild(card);
		});

		// Update count
		if (visibleCount) {
			visibleCount.textContent = visibleCards.length;
		}

		// Show/hide no results message
		if (noResults) {
			noResults.hidden = visibleCards.length > 0;
		}

		// Update active filters display
		updateActiveFilters(filters);

		// Announce to screen readers
		announceResults(visibleCards.length);
	}

	/**
	 * Announce results to screen readers
	 */
	function announceResults(count) {
		// Create or get the live region
		let liveRegion = document.getElementById('destinations-live-region');
		if (!liveRegion) {
			liveRegion = document.createElement('div');
			liveRegion.id = 'destinations-live-region';
			liveRegion.setAttribute('aria-live', 'polite');
			liveRegion.setAttribute('aria-atomic', 'true');
			liveRegion.className = 'screen-reader-text';
			document.body.appendChild(liveRegion);
		}

		// Update the announcement
		liveRegion.textContent = `Showing ${count} of ${total} destinations`;
	}

	/**
	 * Reset all filters
	 */
	function resetAllFilters() {
		if (filterRegion) filterRegion.value = '';
		if (filterType) filterType.value = '';
		if (filterDifficulty) filterDifficulty.value = '';
		if (filterPrice) filterPrice.value = '';
		if (sortBy) sortBy.value = 'name-asc';
		applyFiltersAndSort();
	}

	// Event listeners
	if (filterRegion) {
		filterRegion.addEventListener('change', applyFiltersAndSort);
	}
	if (filterType) {
		filterType.addEventListener('change', applyFiltersAndSort);
	}
	if (filterDifficulty) {
		filterDifficulty.addEventListener('change', applyFiltersAndSort);
	}
	if (filterPrice) {
		filterPrice.addEventListener('change', applyFiltersAndSort);
	}
	if (sortBy) {
		sortBy.addEventListener('change', applyFiltersAndSort);
	}
	if (clearFiltersBtn) {
		clearFiltersBtn.addEventListener('click', resetAllFilters);
	}
	if (resetFiltersBtn) {
		resetFiltersBtn.addEventListener('click', resetAllFilters);
	}

	// Initial sort (alphabetical by default)
	applyFiltersAndSort();

})();
