/**
 * Discover Venus - Booking Page JavaScript
 * Handles multi-step booking form functionality
 */

(function () {
	'use strict';

	// Exit if not on booking page
	const bookingForm = document.getElementById('booking-form');
	if (!bookingForm) return;

	// ===== CONFIGURATION =====

	// Package pricing (base price per person)
	const PACKAGE_PRICES = {
		mountains: 15000,
		volcanoes: 30000,
		plains: 50000
	};

	// Package display names
	const PACKAGE_NAMES = {
		mountains: 'Mountains (Standard)',
		volcanoes: 'Volcanoes (Premium)',
		plains: 'Plains (Luxury)'
	};

	// Duration options per package
	const PACKAGE_DURATIONS = {
		mountains: [10, 14],
		volcanoes: [14, 21],
		plains: [21, 30]
	};

	// Max travelers per package
	const MAX_TRAVELERS = {
		mountains: 12,
		volcanoes: 8,
		plains: 4
	};

	// Add-on pricing
	const ADDON_PRICES = {
		photography: 2500,
		documentary: 5000,
		'extended-stay': 1500, // per day
		'private-guide': 4000,
		'rock-sample': 3000,
		wellness: 2000
	};

	// Add-on display names
	const ADDON_NAMES = {
		photography: 'Professional Photography',
		documentary: 'Documentary Video',
		'extended-stay': 'Extended Stay',
		'private-guide': 'Private Guide Upgrade',
		'rock-sample': 'Venus Rock Sample',
		wellness: 'Wellness Package'
	};

	// ===== STATE =====

	let currentStep = 1;
	const totalSteps = 5;

	// Valid promo codes
	const PROMO_CODES = {
		'VENUS25': { discount: 0.25, description: '25% off' }
	};

	// Booking data object
	let bookingData = {
		package: '',
		destination: '',
		departureDate: '',
		duration: 0,
		travelers: [],
		addons: [],
		extraDays: 0,
		termsAccepted: false,
		promoCode: null,
		promoDiscount: 0,
		totals: {
			base: 0,
			travelers: 0,
			addons: 0,
			promoDiscount: 0,
			total: 0
		}
	};

	// ===== DOM ELEMENTS =====

	const progressSteps = document.querySelectorAll('.progress-step');
	const bookingSteps = document.querySelectorAll('.booking-step');
	const packageOptions = document.querySelectorAll('.package-option');
	const destinationSelect = document.getElementById('destination');
	const departureDateInput = document.getElementById('departure-date');
	const durationSelect = document.getElementById('duration');
	const numTravelersSelect = document.getElementById('num-travelers');
	const travelersContainer = document.getElementById('travelers-container');
	const addTravelerBtn = document.getElementById('add-traveler-btn');
	const addonCheckboxes = document.querySelectorAll('input[name="addons"]');
	const extendedStayOptions = document.getElementById('extended-stay-options');
	const extraDaysSelect = document.getElementById('extra-days');
	const termsCheckbox = document.getElementById('terms');
	const editLinks = document.querySelectorAll('.edit-link');
	const promoCodeInput = document.getElementById('promo-code-input');
	const applyPromoBtn = document.getElementById('apply-promo-btn');
	const promoCodeMessage = document.getElementById('promo-code-message');
	const promoCodeApplied = document.getElementById('promo-code-applied');
	const appliedCodeText = document.getElementById('applied-code-text');
	const removePromoBtn = document.getElementById('remove-promo-btn');
	const promoDiscountLine = document.getElementById('promo-discount-line');

	// ===== INITIALIZATION =====

	function init() {
		// Set minimum date to today
		const today = new Date().toISOString().split('T')[0];
		if (departureDateInput) {
			departureDateInput.setAttribute('min', today);
		}

		// Check for URL parameters (e.g., ?package=volcanoes)
		const urlParams = new URLSearchParams(window.location.search);
		const preselectedPackage = urlParams.get('package');
		if (preselectedPackage && PACKAGE_PRICES[preselectedPackage]) {
			selectPackage(preselectedPackage);
		}

		// Load saved data from localStorage
		loadFromStorage();

		// Bind event listeners
		bindEvents();

		// Initial price calculation
		calculatePrices();
	}

	// ===== EVENT BINDING =====

	function bindEvents() {
		// Package selection
		packageOptions.forEach(option => {
			const radio = option.querySelector('input[type="radio"]');
			if (radio) {
				radio.addEventListener('change', function() {
					selectPackage(this.value);
				});
				// Also handle click on the label itself
				option.addEventListener('click', function() {
					radio.checked = true;
					selectPackage(radio.value);
				});
			}
		});

		// Tour selection changes
		if (destinationSelect) {
			destinationSelect.addEventListener('change', function() {
				bookingData.destination = this.value;
				saveToStorage();
			});
		}

		if (departureDateInput) {
			departureDateInput.addEventListener('change', function() {
				bookingData.departureDate = this.value;
				saveToStorage();
			});
		}

		if (durationSelect) {
			durationSelect.addEventListener('change', function() {
				bookingData.duration = parseInt(this.value, 10);
				calculatePrices();
				saveToStorage();
			});
		}

		// Number of travelers
		if (numTravelersSelect) {
			numTravelersSelect.addEventListener('change', function() {
				updateTravelerForms(parseInt(this.value, 10));
				calculatePrices();
				saveToStorage();
			});
		}

		// Add traveler button
		if (addTravelerBtn) {
			addTravelerBtn.addEventListener('click', function() {
				const currentCount = travelersContainer.querySelectorAll('.traveler-card').length;
				const maxTravelers = MAX_TRAVELERS[bookingData.package] || 6;
				if (currentCount < maxTravelers) {
					numTravelersSelect.value = currentCount + 1;
					updateTravelerForms(currentCount + 1);
					calculatePrices();
				}
			});
		}

		// Add-on checkboxes
		addonCheckboxes.forEach(checkbox => {
			checkbox.addEventListener('change', function() {
				updateAddons();
				// Show/hide extended stay options
				if (this.value === 'extended-stay') {
					extendedStayOptions.style.display = this.checked ? 'block' : 'none';
				}
				calculatePrices();
				saveToStorage();
			});
		});

		// Extra days selection
		if (extraDaysSelect) {
			extraDaysSelect.addEventListener('change', function() {
				bookingData.extraDays = parseInt(this.value, 10);
				calculatePrices();
				saveToStorage();
			});
		}

		// Terms checkbox
		if (termsCheckbox) {
			termsCheckbox.addEventListener('change', function() {
				bookingData.termsAccepted = this.checked;
				saveToStorage();
			});
		}

		// Navigation buttons
		document.querySelectorAll('.btn-next').forEach(btn => {
			btn.addEventListener('click', function() {
				const nextStep = parseInt(this.dataset.next, 10);
				if (validateStep(currentStep)) {
					goToStep(nextStep);
				}
			});
		});

		document.querySelectorAll('.btn-prev').forEach(btn => {
			btn.addEventListener('click', function() {
				const prevStep = parseInt(this.dataset.prev, 10);
				goToStep(prevStep);
			});
		});

		// Edit links in review
		editLinks.forEach(link => {
			link.addEventListener('click', function(e) {
				e.preventDefault();
				const targetStep = parseInt(this.dataset.goto, 10);
				goToStep(targetStep);
			});
		});

		// Form submission
		bookingForm.addEventListener('submit', function(e) {
			e.preventDefault();
			if (validateStep(4)) {
				submitBooking();
			}
		});

		// Progress step clicks (for completed steps)
		progressSteps.forEach(step => {
			step.addEventListener('click', function() {
				const stepNum = parseInt(this.dataset.step, 10);
				if (this.classList.contains('completed')) {
					goToStep(stepNum);
				}
			});
		});

		// Promo code functionality
		if (applyPromoBtn) {
			applyPromoBtn.addEventListener('click', applyPromoCode);
		}

		if (promoCodeInput) {
			promoCodeInput.addEventListener('keypress', function(e) {
				if (e.key === 'Enter') {
					e.preventDefault();
					applyPromoCode();
				}
			});
		}

		if (removePromoBtn) {
			removePromoBtn.addEventListener('click', removePromoCode);
		}
	}

	// ===== PACKAGE SELECTION =====

	function selectPackage(packageName) {
		bookingData.package = packageName;

		// Update visual selection
		packageOptions.forEach(option => {
			const isSelected = option.dataset.package === packageName;
			option.classList.toggle('selected', isSelected);
			const radio = option.querySelector('input[type="radio"]');
			if (radio) radio.checked = isSelected;
		});

		// Update duration options based on package
		updateDurationOptions(packageName);

		// Update max travelers
		updateMaxTravelers(packageName);

		// Calculate prices
		calculatePrices();
		saveToStorage();
	}

	function updateDurationOptions(packageName) {
		if (!durationSelect) return;

		const durations = PACKAGE_DURATIONS[packageName] || [10, 14, 21, 30];
		const currentValue = durationSelect.value;

		// Clear and repopulate options
		durationSelect.innerHTML = '<option value="">-- Select duration --</option>';
		durations.forEach(days => {
			const option = document.createElement('option');
			option.value = days;
			option.textContent = days + ' days';
			if (days === parseInt(currentValue, 10)) {
				option.selected = true;
			}
			durationSelect.appendChild(option);
		});

		// If current selection is no longer valid, reset
		if (!durations.includes(parseInt(currentValue, 10))) {
			bookingData.duration = 0;
		}
	}

	function updateMaxTravelers(packageName) {
		if (!numTravelersSelect) return;

		const max = MAX_TRAVELERS[packageName] || 6;
		const currentValue = parseInt(numTravelersSelect.value, 10);

		// Update options
		numTravelersSelect.innerHTML = '';
		for (let i = 1; i <= max; i++) {
			const option = document.createElement('option');
			option.value = i;
			option.textContent = i + (i === 1 ? ' Traveler' : ' Travelers');
			numTravelersSelect.appendChild(option);
		}

		// Keep current selection if valid
		if (currentValue <= max) {
			numTravelersSelect.value = currentValue;
		} else {
			numTravelersSelect.value = max;
			updateTravelerForms(max);
		}
	}

	// ===== TRAVELER FORMS =====

	function updateTravelerForms(count) {
		const currentCards = travelersContainer.querySelectorAll('.traveler-card');
		const currentCount = currentCards.length;

		// Add more cards if needed
		if (count > currentCount) {
			for (let i = currentCount + 1; i <= count; i++) {
				addTravelerCard(i);
			}
		}
		// Remove cards if needed
		else if (count < currentCount) {
			for (let i = currentCount; i > count; i--) {
				const card = travelersContainer.querySelector(`[data-traveler="${i}"]`);
				if (card) card.remove();
			}
		}

		// Update add button visibility
		const maxTravelers = MAX_TRAVELERS[bookingData.package] || 6;
		if (addTravelerBtn) {
			addTravelerBtn.style.display = count >= maxTravelers ? 'none' : 'flex';
		}
	}

	function addTravelerCard(index) {
		const card = document.createElement('div');
		card.className = 'traveler-card';
		card.dataset.traveler = index;

		card.innerHTML = `
			<div class="traveler-header">
				<h4>Traveler ${index}</h4>
				${index > 1 ? `<button type="button" class="remove-traveler" data-remove="${index}">Remove</button>` : ''}
			</div>
			<div class="form-row">
				<div class="form-group">
					<label for="traveler-${index}-name">Full Name</label>
					<input type="text" class="form-input" name="traveler-${index}-name" id="traveler-${index}-name" required>
					<div class="error-message">Name is required</div>
				</div>
				<div class="form-group">
					<label for="traveler-${index}-dob">Date of Birth</label>
					<input type="date" class="form-input" name="traveler-${index}-dob" id="traveler-${index}-dob" required>
					<div class="error-message">Date of birth is required</div>
				</div>
			</div>
			<div class="form-row">
				<div class="form-group">
					<label for="traveler-${index}-emergency-name">Emergency Contact Name</label>
					<input type="text" class="form-input" name="traveler-${index}-emergency-name" id="traveler-${index}-emergency-name">
				</div>
				<div class="form-group">
					<label for="traveler-${index}-emergency-phone">Emergency Contact Phone</label>
					<input type="tel" class="form-input" name="traveler-${index}-emergency-phone" id="traveler-${index}-emergency-phone">
				</div>
			</div>
			<div class="form-group">
				<label for="traveler-${index}-medical">Medical Requirements</label>
				<textarea class="form-textarea" name="traveler-${index}-medical" id="traveler-${index}-medical" placeholder="List any medical conditions, allergies, or special requirements..."></textarea>
			</div>
		`;

		travelersContainer.appendChild(card);

		// Bind remove button
		const removeBtn = card.querySelector('.remove-traveler');
		if (removeBtn) {
			removeBtn.addEventListener('click', function() {
				removeTraveler(parseInt(this.dataset.remove, 10));
			});
		}
	}

	function removeTraveler(index) {
		const currentCount = travelersContainer.querySelectorAll('.traveler-card').length;
		if (currentCount > 1) {
			// Remove the card
			const card = travelersContainer.querySelector(`[data-traveler="${index}"]`);
			if (card) card.remove();

			// Renumber remaining cards
			const remainingCards = travelersContainer.querySelectorAll('.traveler-card');
			remainingCards.forEach((card, i) => {
				const newIndex = i + 1;
				card.dataset.traveler = newIndex;
				card.querySelector('h4').textContent = newIndex === 1 ? 'Traveler 1 (Primary Contact)' : `Traveler ${newIndex}`;
				// Update all field IDs and names
				card.querySelectorAll('[id^="traveler-"]').forEach(field => {
					const parts = field.id.split('-');
					parts[1] = newIndex;
					field.id = parts.join('-');
					field.name = parts.join('-');
				});
				card.querySelectorAll('[for^="traveler-"]').forEach(label => {
					const parts = label.getAttribute('for').split('-');
					parts[1] = newIndex;
					label.setAttribute('for', parts.join('-'));
				});
			});

			// Update select
			numTravelersSelect.value = currentCount - 1;
			calculatePrices();
		}
	}

	// ===== ADD-ONS =====

	function updateAddons() {
		bookingData.addons = [];
		addonCheckboxes.forEach(checkbox => {
			if (checkbox.checked) {
				bookingData.addons.push(checkbox.value);
			}
		});
	}

	// ===== PROMO CODE =====

	function applyPromoCode() {
		const code = promoCodeInput?.value.trim().toUpperCase();

		if (!code) {
			showPromoMessage('Please enter a promo code', 'error');
			return;
		}

		if (PROMO_CODES[code]) {
			const promo = PROMO_CODES[code];
			bookingData.promoCode = code;
			bookingData.promoDiscount = promo.discount;

			// Update UI
			if (promoCodeInput) promoCodeInput.value = '';
			if (promoCodeMessage) {
				promoCodeMessage.textContent = '';
				promoCodeMessage.className = 'promo-code-message';
			}
			if (appliedCodeText) appliedCodeText.textContent = code;
			if (promoCodeApplied) promoCodeApplied.style.display = 'flex';

			// Hide input group when code is applied
			const inputGroup = document.querySelector('.promo-code-input-group');
			if (inputGroup) inputGroup.style.display = 'none';

			showPromoMessage('Promo code applied successfully!', 'success');

			// Recalculate prices
			calculatePrices();
			saveToStorage();
		} else {
			showPromoMessage('Invalid promo code. Please try again.', 'error');
		}
	}

	function removePromoCode() {
		bookingData.promoCode = null;
		bookingData.promoDiscount = 0;

		// Update UI
		if (promoCodeApplied) promoCodeApplied.style.display = 'none';
		if (promoCodeMessage) {
			promoCodeMessage.textContent = '';
			promoCodeMessage.className = 'promo-code-message';
		}

		// Show input group again
		const inputGroup = document.querySelector('.promo-code-input-group');
		if (inputGroup) inputGroup.style.display = 'flex';

		// Recalculate prices
		calculatePrices();
		saveToStorage();
	}

	function showPromoMessage(message, type) {
		if (promoCodeMessage) {
			promoCodeMessage.textContent = message;
			promoCodeMessage.className = 'promo-code-message ' + type;

			// Auto-hide success message after 3 seconds
			if (type === 'success') {
				setTimeout(() => {
					promoCodeMessage.textContent = '';
					promoCodeMessage.className = 'promo-code-message';
				}, 3000);
			}
		}
	}

	// ===== PRICE CALCULATION =====

	function calculatePrices() {
		const numTravelers = parseInt(numTravelersSelect?.value || 1, 10);

		// Base package price (per person)
		const basePrice = PACKAGE_PRICES[bookingData.package] || 0;
		bookingData.totals.base = basePrice;

		// Travelers cost
		bookingData.totals.travelers = basePrice * numTravelers;

		// Add-ons cost
		let addonsTotal = 0;
		bookingData.addons.forEach(addon => {
			if (addon === 'extended-stay') {
				const days = parseInt(extraDaysSelect?.value || 1, 10);
				addonsTotal += ADDON_PRICES[addon] * days;
			} else {
				addonsTotal += ADDON_PRICES[addon] || 0;
			}
		});
		bookingData.totals.addons = addonsTotal;

		// Subtotal before promo
		const subtotal = bookingData.totals.travelers + bookingData.totals.addons;

		// Apply promo discount
		if (bookingData.promoCode && bookingData.promoDiscount > 0) {
			bookingData.totals.promoDiscount = Math.round(subtotal * bookingData.promoDiscount);
		} else {
			bookingData.totals.promoDiscount = 0;
		}

		// Grand total
		bookingData.totals.total = subtotal - bookingData.totals.promoDiscount;

		// Update all price displays
		updatePriceDisplays(numTravelers);
	}

	function updatePriceDisplays(numTravelers) {
		// Step 1 summary
		const summaryPackagePrice = document.getElementById('summary-package-price');
		const summaryStep1Total = document.getElementById('summary-step1-total');
		if (summaryPackagePrice) summaryPackagePrice.textContent = formatPrice(bookingData.totals.base);
		if (summaryStep1Total) summaryStep1Total.textContent = formatPrice(bookingData.totals.travelers);

		// Step 2 summary
		const summary2Package = document.getElementById('summary2-package');
		const summary2TravelerCount = document.getElementById('summary2-traveler-count');
		const summary2Travelers = document.getElementById('summary2-travelers');
		const summary2Total = document.getElementById('summary2-total');
		if (summary2Package) summary2Package.textContent = formatPrice(bookingData.totals.base);
		if (summary2TravelerCount) summary2TravelerCount.textContent = numTravelers;
		if (summary2Travelers) summary2Travelers.textContent = formatPrice(bookingData.totals.travelers);
		if (summary2Total) summary2Total.textContent = formatPrice(bookingData.totals.travelers);

		// Step 3 summary
		const summary3Package = document.getElementById('summary3-package');
		const summary3Travelers = document.getElementById('summary3-travelers');
		const summary3Addons = document.getElementById('summary3-addons');
		const summary3Total = document.getElementById('summary3-total');
		if (summary3Package) summary3Package.textContent = formatPrice(bookingData.totals.base);
		if (summary3Travelers) summary3Travelers.textContent = formatPrice(bookingData.totals.travelers);
		if (summary3Addons) summary3Addons.textContent = formatPrice(bookingData.totals.addons);
		if (summary3Total) summary3Total.textContent = formatPrice(bookingData.totals.total);

		// Step 4 (review) summary
		const finalPackage = document.getElementById('final-package');
		const finalTravelerCount = document.getElementById('final-traveler-count');
		const finalTravelers = document.getElementById('final-travelers');
		const finalAddons = document.getElementById('final-addons');
		const finalTotal = document.getElementById('final-total');
		if (finalPackage) finalPackage.textContent = formatPrice(bookingData.totals.base);
		if (finalTravelerCount) finalTravelerCount.textContent = numTravelers;
		if (finalTravelers) finalTravelers.textContent = formatPrice(bookingData.totals.travelers);
		if (finalAddons) finalAddons.textContent = formatPrice(bookingData.totals.addons);
		if (finalTotal) finalTotal.textContent = formatPrice(bookingData.totals.total);

		// Promo discount display
		const finalPromoDiscount = document.getElementById('final-promo-discount');
		if (promoDiscountLine) {
			if (bookingData.promoCode && bookingData.totals.promoDiscount > 0) {
				promoDiscountLine.style.display = 'flex';
				if (finalPromoDiscount) {
					finalPromoDiscount.textContent = '-' + formatPrice(bookingData.totals.promoDiscount);
				}
			} else {
				promoDiscountLine.style.display = 'none';
			}
		}
	}

	function formatPrice(amount) {
		return '$' + amount.toLocaleString('en-US');
	}

	// ===== VALIDATION =====

	function validateStep(stepNum) {
		let isValid = true;

		// Clear previous errors
		clearErrors();

		switch (stepNum) {
			case 1:
				isValid = validateStep1();
				break;
			case 2:
				isValid = validateStep2();
				break;
			case 3:
				// Step 3 (add-ons) has no required fields
				isValid = true;
				break;
			case 4:
				isValid = validateStep4();
				break;
		}

		return isValid;
	}

	function validateStep1() {
		let isValid = true;

		// Package selection
		if (!bookingData.package) {
			showError('package-error');
			isValid = false;
		}

		// Destination
		if (!destinationSelect?.value) {
			showError('destination-error');
			destinationSelect?.classList.add('error');
			isValid = false;
		}

		// Departure date
		const departureDate = departureDateInput?.value;
		if (!departureDate) {
			showError('departure-error');
			departureDateInput?.classList.add('error');
			isValid = false;
		} else {
			const selectedDate = new Date(departureDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (selectedDate <= today) {
				showError('departure-error');
				departureDateInput?.classList.add('error');
				isValid = false;
			}
		}

		// Duration
		if (!durationSelect?.value) {
			showError('duration-error');
			durationSelect?.classList.add('error');
			isValid = false;
		}

		return isValid;
	}

	function validateStep2() {
		let isValid = true;
		const travelerCards = travelersContainer.querySelectorAll('.traveler-card');

		travelerCards.forEach((card, index) => {
			const travelerNum = index + 1;

			// Name (required)
			const nameInput = card.querySelector(`#traveler-${travelerNum}-name`);
			if (nameInput && !nameInput.value.trim()) {
				nameInput.classList.add('error');
				const errorMsg = nameInput.parentElement.querySelector('.error-message');
				if (errorMsg) errorMsg.classList.add('visible');
				isValid = false;
			}

			// Date of birth (required)
			const dobInput = card.querySelector(`#traveler-${travelerNum}-dob`);
			if (dobInput && !dobInput.value) {
				dobInput.classList.add('error');
				const errorMsg = dobInput.parentElement.querySelector('.error-message');
				if (errorMsg) errorMsg.classList.add('visible');
				isValid = false;
			}

			// Email (required for primary traveler only)
			if (travelerNum === 1) {
				const emailInput = card.querySelector(`#traveler-1-email`);
				if (emailInput && (!emailInput.value || !isValidEmail(emailInput.value))) {
					emailInput.classList.add('error');
					const errorMsg = emailInput.parentElement.querySelector('.error-message');
					if (errorMsg) errorMsg.classList.add('visible');
					isValid = false;
				}

				// Emergency contact (required for primary)
				const emergencyName = card.querySelector('#traveler-1-emergency-name');
				if (emergencyName && !emergencyName.value.trim()) {
					emergencyName.classList.add('error');
					const errorMsg = emergencyName.parentElement.querySelector('.error-message');
					if (errorMsg) errorMsg.classList.add('visible');
					isValid = false;
				}

				const emergencyPhone = card.querySelector('#traveler-1-emergency-phone');
				if (emergencyPhone && !emergencyPhone.value.trim()) {
					emergencyPhone.classList.add('error');
					const errorMsg = emergencyPhone.parentElement.querySelector('.error-message');
					if (errorMsg) errorMsg.classList.add('visible');
					isValid = false;
				}
			}
		});

		return isValid;
	}

	function validateStep4() {
		let isValid = true;

		// Terms checkbox
		if (!termsCheckbox?.checked) {
			showError('terms-error');
			isValid = false;
		}

		return isValid;
	}

	function isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function showError(errorId) {
		const errorElement = document.getElementById(errorId);
		if (errorElement) {
			errorElement.classList.add('visible');
		}
	}

	function clearErrors() {
		// Clear all error messages
		document.querySelectorAll('.error-message').forEach(el => {
			el.classList.remove('visible');
		});
		// Clear all error states on inputs
		document.querySelectorAll('.form-input.error, .form-select.error').forEach(el => {
			el.classList.remove('error');
		});
	}

	// ===== STEP NAVIGATION =====

	function goToStep(stepNum) {
		if (stepNum < 1 || stepNum > totalSteps) return;

		// Update current step
		currentStep = stepNum;

		// Update progress indicator
		progressSteps.forEach(step => {
			const num = parseInt(step.dataset.step, 10);
			step.classList.remove('active', 'completed');
			if (num === stepNum) {
				step.classList.add('active');
			} else if (num < stepNum) {
				step.classList.add('completed');
			}
		});

		// Update visible step
		bookingSteps.forEach(step => {
			const num = parseInt(step.dataset.step, 10);
			step.classList.toggle('active', num === stepNum);
		});

		// Scroll to top of form
		bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

		// If going to review step, populate review data
		if (stepNum === 4) {
			populateReview();
		}

		// Save progress
		saveToStorage();
	}

	// ===== REVIEW POPULATION =====

	function populateReview() {
		// Tour details
		document.getElementById('review-package').textContent = PACKAGE_NAMES[bookingData.package] || '-';

		const destOption = destinationSelect?.options[destinationSelect.selectedIndex];
		document.getElementById('review-destination').textContent = destOption?.text || '-';

		const dateValue = departureDateInput?.value;
		if (dateValue) {
			const date = new Date(dateValue);
			document.getElementById('review-date').textContent = date.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} else {
			document.getElementById('review-date').textContent = '-';
		}

		document.getElementById('review-duration').textContent = (durationSelect?.value || 0) + ' days';

		// Travelers
		const reviewTravelers = document.getElementById('review-travelers');
		if (reviewTravelers) {
			reviewTravelers.innerHTML = '';
			const travelerCards = travelersContainer.querySelectorAll('.traveler-card');
			travelerCards.forEach((card, index) => {
				const num = index + 1;
				const name = card.querySelector(`#traveler-${num}-name`)?.value || `Traveler ${num}`;
				const row = document.createElement('div');
				row.className = 'review-row';
				row.innerHTML = `
					<span class="review-label">Traveler ${num}</span>
					<span class="review-value">${name}</span>
				`;
				reviewTravelers.appendChild(row);
			});
		}

		// Add-ons
		const reviewAddons = document.getElementById('review-addons');
		if (reviewAddons) {
			if (bookingData.addons.length === 0) {
				reviewAddons.innerHTML = '<div class="review-row"><span class="review-value">No add-ons selected</span></div>';
			} else {
				reviewAddons.innerHTML = '';
				bookingData.addons.forEach(addon => {
					let price = ADDON_PRICES[addon] || 0;
					let priceText = formatPrice(price);

					if (addon === 'extended-stay') {
						const days = parseInt(extraDaysSelect?.value || 1, 10);
						price = price * days;
						priceText = formatPrice(price) + ` (${days} days)`;
					}

					const row = document.createElement('div');
					row.className = 'review-row';
					row.innerHTML = `
						<span class="review-label">${ADDON_NAMES[addon]}</span>
						<span class="review-value">${priceText}</span>
					`;
					reviewAddons.appendChild(row);
				});
			}
		}

		// Recalculate prices for review
		calculatePrices();
	}

	// ===== FORM SUBMISSION =====

	function submitBooking() {
		// Generate booking reference
		const reference = generateBookingReference();

		// Update confirmation page
		document.getElementById('booking-reference').textContent = reference;
		document.getElementById('confirm-package').textContent = PACKAGE_NAMES[bookingData.package] || '-';

		const destOption = destinationSelect?.options[destinationSelect.selectedIndex];
		document.getElementById('confirm-destination').textContent = destOption?.text || '-';

		const dateValue = departureDateInput?.value;
		if (dateValue) {
			const date = new Date(dateValue);
			document.getElementById('confirm-date').textContent = date.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		}

		const numTravelers = travelersContainer.querySelectorAll('.traveler-card').length;
		document.getElementById('confirm-travelers').textContent = numTravelers + (numTravelers === 1 ? ' person' : ' people');
		document.getElementById('confirm-total').textContent = formatPrice(bookingData.totals.total);

		// Go to confirmation step
		goToStep(5);

		// Clear localStorage after successful booking
		clearStorage();
	}

	function generateBookingReference() {
		const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		let reference = 'VNS-';
		for (let i = 0; i < 6; i++) {
			reference += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return reference;
	}

	// ===== LOCAL STORAGE =====

	function saveToStorage() {
		// Collect traveler data
		const travelers = [];
		const travelerCards = travelersContainer.querySelectorAll('.traveler-card');
		travelerCards.forEach((card, index) => {
			const num = index + 1;
			travelers.push({
				name: card.querySelector(`#traveler-${num}-name`)?.value || '',
				email: card.querySelector(`#traveler-${num}-email`)?.value || '',
				dob: card.querySelector(`#traveler-${num}-dob`)?.value || '',
				phone: card.querySelector(`#traveler-${num}-phone`)?.value || '',
				emergencyName: card.querySelector(`#traveler-${num}-emergency-name`)?.value || '',
				emergencyPhone: card.querySelector(`#traveler-${num}-emergency-phone`)?.value || '',
				emergencyRelation: card.querySelector(`#traveler-${num}-emergency-relation`)?.value || '',
				medical: card.querySelector(`#traveler-${num}-medical`)?.value || ''
			});
		});

		const dataToSave = {
			currentStep,
			package: bookingData.package,
			destination: destinationSelect?.value || '',
			departureDate: departureDateInput?.value || '',
			duration: durationSelect?.value || '',
			travelers,
			addons: bookingData.addons,
			extraDays: extraDaysSelect?.value || 1,
			termsAccepted: termsCheckbox?.checked || false,
			promoCode: bookingData.promoCode,
			promoDiscount: bookingData.promoDiscount
		};

		try {
			localStorage.setItem('venusBooking', JSON.stringify(dataToSave));
		} catch (e) {
			console.warn('Could not save to localStorage:', e);
		}
	}

	function loadFromStorage() {
		try {
			const saved = localStorage.getItem('venusBooking');
			if (!saved) return;

			const data = JSON.parse(saved);

			// Restore package selection
			if (data.package) {
				selectPackage(data.package);
			}

			// Restore destination
			if (data.destination && destinationSelect) {
				destinationSelect.value = data.destination;
				bookingData.destination = data.destination;
			}

			// Restore departure date
			if (data.departureDate && departureDateInput) {
				departureDateInput.value = data.departureDate;
				bookingData.departureDate = data.departureDate;
			}

			// Restore duration
			if (data.duration && durationSelect) {
				durationSelect.value = data.duration;
				bookingData.duration = parseInt(data.duration, 10);
			}

			// Restore travelers
			if (data.travelers && data.travelers.length > 0) {
				updateTravelerForms(data.travelers.length);
				if (numTravelersSelect) {
					numTravelersSelect.value = data.travelers.length;
				}

				// Fill in traveler data
				data.travelers.forEach((traveler, index) => {
					const num = index + 1;
					const card = travelersContainer.querySelector(`[data-traveler="${num}"]`);
					if (card) {
						const nameInput = card.querySelector(`#traveler-${num}-name`);
						const emailInput = card.querySelector(`#traveler-${num}-email`);
						const dobInput = card.querySelector(`#traveler-${num}-dob`);
						const phoneInput = card.querySelector(`#traveler-${num}-phone`);
						const emergencyNameInput = card.querySelector(`#traveler-${num}-emergency-name`);
						const emergencyPhoneInput = card.querySelector(`#traveler-${num}-emergency-phone`);
						const emergencyRelationInput = card.querySelector(`#traveler-${num}-emergency-relation`);
						const medicalInput = card.querySelector(`#traveler-${num}-medical`);

						if (nameInput) nameInput.value = traveler.name || '';
						if (emailInput) emailInput.value = traveler.email || '';
						if (dobInput) dobInput.value = traveler.dob || '';
						if (phoneInput) phoneInput.value = traveler.phone || '';
						if (emergencyNameInput) emergencyNameInput.value = traveler.emergencyName || '';
						if (emergencyPhoneInput) emergencyPhoneInput.value = traveler.emergencyPhone || '';
						if (emergencyRelationInput) emergencyRelationInput.value = traveler.emergencyRelation || '';
						if (medicalInput) medicalInput.value = traveler.medical || '';
					}
				});
			}

			// Restore addons
			if (data.addons && data.addons.length > 0) {
				data.addons.forEach(addon => {
					const checkbox = document.querySelector(`input[name="addons"][value="${addon}"]`);
					if (checkbox) {
						checkbox.checked = true;
						if (addon === 'extended-stay') {
							extendedStayOptions.style.display = 'block';
						}
					}
				});
				bookingData.addons = data.addons;
			}

			// Restore extra days
			if (data.extraDays && extraDaysSelect) {
				extraDaysSelect.value = data.extraDays;
				bookingData.extraDays = parseInt(data.extraDays, 10);
			}

			// Restore terms
			if (data.termsAccepted && termsCheckbox) {
				termsCheckbox.checked = true;
				bookingData.termsAccepted = true;
			}

			// Restore promo code
			if (data.promoCode && PROMO_CODES[data.promoCode]) {
				bookingData.promoCode = data.promoCode;
				bookingData.promoDiscount = data.promoDiscount;

				// Update UI
				if (appliedCodeText) appliedCodeText.textContent = data.promoCode;
				if (promoCodeApplied) promoCodeApplied.style.display = 'flex';
				const inputGroup = document.querySelector('.promo-code-input-group');
				if (inputGroup) inputGroup.style.display = 'none';
			}

			// Go to saved step (but not confirmation)
			if (data.currentStep && data.currentStep < 5) {
				goToStep(data.currentStep);
			}

			// Recalculate prices
			calculatePrices();

		} catch (e) {
			console.warn('Could not load from localStorage:', e);
		}
	}

	function clearStorage() {
		try {
			localStorage.removeItem('venusBooking');
		} catch (e) {
			console.warn('Could not clear localStorage:', e);
		}
	}

	// ===== INITIALIZE =====
	init();

})();
