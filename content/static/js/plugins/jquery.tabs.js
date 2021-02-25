(function ($) {

	/*
	* Zeit Online Tabs Plugin
	* display information in tabs
	*
	* Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
	* Dual licensed under the MIT and GPL licenses:
	* http://www.opensource.org/licenses/mit-license.php
	* http://www.gnu.org/licenses/gpl.html
	*
	*
	* @author Nico Bruenjes feat. Arne Seemann
	*
	*/
	$.fn.tabs = function (options) {

		options = $.extend({
			active: 'mostread'
		}, options);


		return this.each(function () {
			var that = $(this);

			// prevent standard behavior
			$('.tabbody', that).click( function(e) {
				e.preventDefault();
			}).focus(function() {
				$(this).blur();
			});

			// set default active, if no other tab has been set to active before
			if($('[ data-role = "tabtitle" ].active', that).size() < 1) {
				$('[ data-role = "tabtitle" ].' + options.active, that).addClass( 'active' );
			}
			$('[ data-role = "tabbody" ]:not(.' + options.active + ')', that).hide();

			// set hover states
			$('[ data-role = "tabtitle" ]', that).hover( function () {
				$(this).addClass( 'hoverTab' );
			}, function () {
				$(this).removeClass( 'hoverTab' );
			});


			$('[ data-role = "tabtitle" ]', that).click( function (e) {
				e.preventDefault();

				if( !($(this).hasClass( 'active' )) ) {

					$(this).parent().children( '.active' ).removeClass( 'active' );
					var cln = $(this).removeClass( 'hoverTab' ).attr( 'class' );

					$('[ data-role = "tabbody" ]', that).hide();
					$('[ data-role = "tabbody" ].' + cln, that).show();
					$('[ data-role = "tabtitle" ].' + cln).addClass( 'active' );
				}
				ZEIT.clickWebtrekk( 'tabs' );
			});

			//add deeplinks
			var hash = window.location.hash.replace("#","");

			if(window.location.hash){
				that.find('[ data-role = "tabtitle" ]').each(function(){
					if($(this).attr("class") === hash){
						$(this).trigger("click");
					}
				});

			}
		});
	};


})(jQuery);