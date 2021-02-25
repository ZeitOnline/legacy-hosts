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

	$.fn.parquetCarousel = function ( options ) {

		// var defaults = $.extend({}, options);

		return this.each( function () {
			//console.debug($(this));
			that = this;

			$(' #js-parquet-carousel .parquet-carousel-content').bxSlider({
				slideWidth: 380,
				minSlides: 2,
				maxSlides: 2,
				moveSlides: 1,
				slideMargin: 20,
				pager: true,
				pagerSelector: ".custom-pager-fotos",
				onSliderLoad: function(currentIndex){
					var parquet_carousel_text  = $('#js-parquet-carousel .parquet-carousel-content .parquet-carousel-text');
					parquet_carousel_text.removeClass('active');
					parquet_carousel_text.eq(currentIndex + 2).addClass('active');
					parquet_carousel_text.eq(currentIndex + 3).addClass('active');
					parquet_carousel_text.fadeIn("slow");
					parquet_carousel_text.not('.active').hide();
					deactivateSideLinks();
					$("#js-parquet-carousel .bx-pager .active", this).parent().next().children().addClass("active");
					$('#js-parquet-carousel').addClass('carousel-ready');
				},
				onSlideBefore: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
					var parquet_carousel_text  = $('#js-parquet-carousel .parquet-carousel-content .parquet-carousel-text');
					parquet_carousel_text.removeClass('active');
					parquet_carousel_text.eq(currentSlideHtmlObject + 2).addClass('active');
					parquet_carousel_text.eq(currentSlideHtmlObject + 3).addClass('active');
					$('#js-parquet-carousel .parquet-carousel-content .parquet-carousel-text.active').fadeIn(400);
					parquet_carousel_text.not('.active').fadeOut(400);
					deactivateSideLinks();
					$( '#js-parquet-carousel .carousel-placeholder' ).trigger('loadImages');
				}
			});

			// setup active staties for custom pager
			setTimeout(function() {
				$("#js-parquet-carousel .bx-pager .active").parent().next().children().addClass("active");
			}, 10);

			$("#js-parquet-carousel .bx-prev, #js-parquet-carousel .bx-next, #js-parquet-carousel .bx-pager").on("click", function() {
				$("#js-parquet-carousel .bx-pager .active").first().parent().next().children().addClass("active");

				if($("#js-parquet-carousel .bx-pager .active").length < 2 ) {
					$("#js-parquet-carousel .bx-pager > .bx-pager-item").first().children().addClass("active");
				}

				if($("#js-parquet-carousel .bx-pager .active").length > 2){
					$("#js-parquet-carousel .bx-pager > .bx-pager-item").eq(1).children().removeClass('active');
				}
			});

			function deactivateSideLinks() {
				$("#js-parquet-carousel .bx-wrapper .slide a").unbind('click');
				$("#js-parquet-carousel .overlay-img a").click(function(e) {
					e.preventDefault();
				});
			}

			// load and replace missing images when user interact in any way with the slider (next/prev, pager, swipe)
			$( "#js-parquet-carousel .carousel-placeholder" ).one( "loadImages", function() {
				$( '#js-parquet-carousel .carousel-placeholder' ).each(function() {
					$(this)
					.attr( "src", $(this).attr( "data-src" ) )
					.attr( "alt", $(this).attr( "data-alt" ) )
					.removeAttr("data-src data-alt")
					.removeClass("carousel-placeholder");
				});
			});
		});
	};

})( jQuery );