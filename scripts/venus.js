(function () {

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


	//
	// Inits & Event Listeners
	//

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

})();