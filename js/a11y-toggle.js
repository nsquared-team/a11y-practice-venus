/**
 * Discover Venus - Accessibility Issues Toggle
 * Admin tool for enabling/disabling intentional accessibility issues
 *
 * Usage:
 * - Add ?a11y-admin=true to URL to show toggle panel
 * - Press Ctrl+Shift+A to toggle issues on/off
 * - State is persisted in localStorage
 */

(function() {
	'use strict';

	var A11yToggle = {
		// Configuration
		config: {
			storageKey: 'discoverVenus_a11yIssuesEnabled',
			bodyAttribute: 'data-a11y-issues-enabled',
			adminParam: 'a11y-admin',
			panelId: 'a11y-admin-panel'
		},

		// State
		state: {
			issuesEnabled: true,
			adminMode: false
		},

		/**
		 * Initialize the toggle system
		 */
		init: function() {
			// Check if admin mode is requested via URL
			this.checkAdminMode();

			// Load saved state from localStorage
			this.loadState();

			// Apply current state
			this.applyState();

			// Set up keyboard shortcut
			this.setupKeyboardShortcut();

			// Create admin panel if in admin mode
			if (this.state.adminMode) {
				this.createAdminPanel();
			}

			// Expose API to window
			window.A11yToggle = this;
		},

		/**
		 * Check URL for admin mode parameter
		 */
		checkAdminMode: function() {
			var urlParams = new URLSearchParams(window.location.search);
			this.state.adminMode = urlParams.get(this.config.adminParam) === 'true';
		},

		/**
		 * Load state from localStorage
		 */
		loadState: function() {
			var saved = localStorage.getItem(this.config.storageKey);
			if (saved !== null) {
				this.state.issuesEnabled = saved === 'true';
			}
		},

		/**
		 * Save state to localStorage
		 */
		saveState: function() {
			localStorage.setItem(this.config.storageKey, this.state.issuesEnabled.toString());
		},

		/**
		 * Apply current state to the document
		 */
		applyState: function() {
			if (this.state.issuesEnabled) {
				document.body.setAttribute(this.config.bodyAttribute, 'true');
			} else {
				document.body.removeAttribute(this.config.bodyAttribute);
			}

			// Update admin panel if it exists
			this.updateAdminPanel();

			// Dispatch custom event for other scripts to react
			document.dispatchEvent(new CustomEvent('a11y:toggle', {
				detail: { issuesEnabled: this.state.issuesEnabled }
			}));
		},

		/**
		 * Enable accessibility issues
		 */
		enable: function() {
			this.state.issuesEnabled = true;
			this.saveState();
			this.applyState();
		},

		/**
		 * Disable accessibility issues (show accessible version)
		 */
		disable: function() {
			this.state.issuesEnabled = false;
			this.saveState();
			this.applyState();
		},

		/**
		 * Toggle accessibility issues on/off
		 */
		toggle: function() {
			if (this.state.issuesEnabled) {
				this.disable();
			} else {
				this.enable();
			}
		},

		/**
		 * Set up keyboard shortcut (Ctrl+Shift+A)
		 */
		setupKeyboardShortcut: function() {
			var self = this;
			document.addEventListener('keydown', function(e) {
				// Ctrl+Shift+A (or Cmd+Shift+A on Mac)
				if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
					e.preventDefault();
					self.toggle();
					self.showNotification();
				}
			});
		},

		/**
		 * Show a brief notification when toggling via keyboard
		 */
		showNotification: function() {
			// Remove existing notification
			var existing = document.getElementById('a11y-toggle-notification');
			if (existing) {
				existing.remove();
			}

			// Create notification
			var notification = document.createElement('div');
			notification.id = 'a11y-toggle-notification';
			notification.setAttribute('role', 'status');
			notification.setAttribute('aria-live', 'polite');
			notification.className = 'a11y-notification';
			notification.textContent = this.state.issuesEnabled
				? 'Accessibility issues ENABLED'
				: 'Accessibility issues DISABLED (accessible mode)';

			document.body.appendChild(notification);

			// Trigger animation
			setTimeout(function() {
				notification.classList.add('show');
			}, 10);

			// Remove after delay
			setTimeout(function() {
				notification.classList.remove('show');
				setTimeout(function() {
					notification.remove();
				}, 300);
			}, 2000);
		},

		/**
		 * Create the admin panel UI
		 */
		createAdminPanel: function() {
			var self = this;

			// Create panel container
			var panel = document.createElement('div');
			panel.id = this.config.panelId;
			panel.className = 'a11y-admin-panel';
			panel.setAttribute('role', 'region');
			panel.setAttribute('aria-label', 'Accessibility Testing Controls');

			// Panel header
			var header = document.createElement('div');
			header.className = 'a11y-admin-header';
			header.innerHTML = '<strong>A11y Testing Mode</strong>';

			// Status indicator
			var status = document.createElement('div');
			status.className = 'a11y-admin-status';
			status.id = 'a11y-status';

			// Toggle button
			var toggleBtn = document.createElement('button');
			toggleBtn.className = 'a11y-admin-toggle';
			toggleBtn.id = 'a11y-toggle-btn';
			toggleBtn.addEventListener('click', function() {
				self.toggle();
			});

			// Info text
			var info = document.createElement('div');
			info.className = 'a11y-admin-info';
			info.innerHTML = '<small>Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> to toggle</small>';

			// Collapse button
			var collapseBtn = document.createElement('button');
			collapseBtn.className = 'a11y-admin-collapse';
			collapseBtn.setAttribute('aria-label', 'Collapse panel');
			collapseBtn.innerHTML = '−';
			collapseBtn.addEventListener('click', function() {
				panel.classList.toggle('collapsed');
				collapseBtn.innerHTML = panel.classList.contains('collapsed') ? '+' : '−';
				collapseBtn.setAttribute('aria-label',
					panel.classList.contains('collapsed') ? 'Expand panel' : 'Collapse panel');
			});

			// Assemble panel
			header.appendChild(collapseBtn);
			panel.appendChild(header);
			panel.appendChild(status);
			panel.appendChild(toggleBtn);
			panel.appendChild(info);

			// Add to page
			document.body.appendChild(panel);

			// Update panel state
			this.updateAdminPanel();
		},

		/**
		 * Update admin panel to reflect current state
		 */
		updateAdminPanel: function() {
			var status = document.getElementById('a11y-status');
			var toggleBtn = document.getElementById('a11y-toggle-btn');

			if (!status || !toggleBtn) return;

			if (this.state.issuesEnabled) {
				status.textContent = 'Issues: ENABLED';
				status.className = 'a11y-admin-status enabled';
				toggleBtn.textContent = 'Show Accessible Version';
				toggleBtn.className = 'a11y-admin-toggle';
			} else {
				status.textContent = 'Issues: DISABLED';
				status.className = 'a11y-admin-status disabled';
				toggleBtn.textContent = 'Enable A11y Issues';
				toggleBtn.className = 'a11y-admin-toggle accessible';
			}
		}
	};

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() {
			A11yToggle.init();
		});
	} else {
		A11yToggle.init();
	}

})();
