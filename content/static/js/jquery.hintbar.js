/**
* Zeit Online Hinweisleisten Plugin
* adds a widget for posting ZEIT ONLINE articles to different social service
* 
* Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
* 
* @author Nico Bruenjes
* @version 3.0
*
*/
(function($) {

	$.fn.hintbar = function( options ) {

		options = $.extend({
			template: '<div id="hintbar"><span id="hintbar-hide">%1</span><span id="hintbar-leave" class="leave-icon-%3">%2</span></div>',
			cookietime: false,
			hidetext: "Hinweis nicht mehr anzeigen",
			hideTrackingId: false,
			leavetext: "Zur klassischen Website von ZEIT ONLINE",
			leaveTrackingId: false,
			leaveTarget: false,
			leaveIcon: "desktop"
		}, options);


		return this.each(function() {
			if( ZEIT.cookieRead('ZEIThintbar') != 'hidden' && options.leaveTarget ) {
				var bar = $( options.template.replace('%1', options.hidetext).replace('%2', options.leavetext).replace('%3', options.leaveIcon) );
				// var iw = $('body').innerWidth();
				$( bar ).prependTo( this );
				// removal button event
				$('#hintbar-hide').on("click", function() {
					if( options.hideTrackingId ) {
						ZEIT.clickWebtrekk( options.hideTrackingId );
					}
					if( options.cookietime ) {
						ZEIT.cookieCreate('ZEIThintbar', 'hidden', cookietime, "");
					} else {
						ZEIT.cookieCreate('ZEIThintbar', 'hidden', false, "");
					}
					$("#hintbar").hide().remove();
				});
				// visit x button event
				$('#hintbar-leave').on("click", function(){
					if( options.leaveTrackingId ) {
						ZEIT.clickWebtrekk( options.leaveTrackingId );
					}
					window.location.href = options.leaveTarget;
				});
			}
		});

	};

}(jQuery));