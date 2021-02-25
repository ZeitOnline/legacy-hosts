/**
* Zeit Online Parkett-Karussel Plugin
*
* Copyright (c) 2013 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* @author Malte Modrow, Arne Seemann
* @version 1.0
*
*/

( function( $ ) {

	$.fn.terminSlider = function ( options ) {

		// var defaults = $.extend({}, options);

		return this.each( function () {
			//console.debug($(this));
			that = this;

			$('#js-parquet-terminkalender .parquet-carousel-content').bxSlider({
				slideWidth: 420,
				minSlides: 2,
				maxSlides: 2,
				moveSlides: 1,
				slideMargin: 20,
				pager: false,
				infiniteLoop: false,
				hideControlOnEnd: true,
				onSliderLoad: function(currentIndex){

					$('#js-parquet-terminkalender').addClass('carousel-ready');
				},
				//the following two function make sure the opacity effect also works on a tablet when the user swipes
				onSlidePrev: function() {
					$("#js-parquet-terminkalender .slide.first").css('opacity', 1);
					$("#js-parquet-terminkalender .slide.last").css('opacity', 0.5);
				},
				onSlideNext: function() {
					$("#js-parquet-terminkalender .slide.last").css('opacity', 1);
					$("#js-parquet-terminkalender .slide.first").css('opacity', 0.5);
				}
			});


			$("#js-parquet-terminkalender .bx-next").on("click", function() {
				$("#js-parquet-terminkalender .slide.last").css('opacity', 1);
				$("#js-parquet-terminkalender .slide.first").css('opacity', 0.5);
			});
			$("#js-parquet-terminkalender .bx-prev").on("click", function() {
				$("#js-parquet-terminkalender .slide.first").css('opacity', 1);
				$("#js-parquet-terminkalender .slide.last").css('opacity', 0.5);
			});
		});
	};

})( jQuery );