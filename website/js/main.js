/*
	Minimaxing by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
function tk() {
 	if (navigator.userAgent.indexOf("MSIE") > 0) {
  		if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
   			window.opener = null;
   			window.close();
  		} else {
   			window.open('', '_top');
   			window.top.close();
  		}
 	}
 	else if (navigator.userAgent.indexOf("Firefox") > 0) {
  		window.location.href = 'about:blank ';
 	} else {
  		window.opener = null;
  		window.open('', '_self');
  		window.close();
 	}
}

(function($) {

	var $window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Nav.

		// Title Bar.
			$(
				'<div id="titleBar">' +
					'<a href="#navPanel" class="toggle"></a>' +
					'<span class="title">' + $('#logo').html() + '</span>' +
				'</div>'
			)
				.appendTo($body);

		// Navigation Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

})(jQuery);