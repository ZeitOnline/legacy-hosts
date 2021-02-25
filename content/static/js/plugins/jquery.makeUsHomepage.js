(function($) {

	$.fn.makeUsHomepage = function( options ) {

		var pagetype = $("body").dataset("page_type"),
		template = '<div class="makeushomepage"><div id="jquery_makeushomepage-message" class="message">%1</div><div id="jquery_makeushomepage-decline" class="decline">%2</div>';

		options = $.extend({
			url: "http://www.zeit.de/administratives/anleitung-startseite/anleitung-startseite",
			message: "<strong>ZEIT ONLINE</strong> zur Startseite machen",
			decline: "Hinweis nicht mehr anzeigen",
			cookiename: 'makeZEITONLINEmyhomepage',
			cookievalue: 1,
			cookiedays: "30"
		}, options);

		return this.each( function() {


			if( null === ZEIT.cookieRead( options.cookiename ) ) {
				var html = template.replace("%1", options.message).replace("%2", options.decline);
				var myitem = $(html).insertAfter( this );
				$("#jquery_makeushomepage-message").on("click", function(e) {
					e.preventDefault();
					ZEIT.cookieCreate(options.cookiename, 1, options.cookiedays);
					ZEIT.clickWebtrekk('hp.global.subheader.button.browserstart');
					window.location.href = options.url;
				});
				$("#jquery_makeushomepage-decline").on("click", function(e) {
					e.preventDefault();
					ZEIT.cookieCreate(options.cookiename, 1, options.cookiedays);
					ZEIT.clickWebtrekk('hp.global.subheader.button.hidebrowserstart');
					myitem.hide(200);
				});

			}

		});

	};

})(jQuery);