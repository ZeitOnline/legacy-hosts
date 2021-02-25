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

			var slider = $(' #js-parquet-shopcarousel .parquet-carousel-content').bxSlider({
				slideWidth: 246,
				minSlides: 3,
				maxSlides: 3,
				moveSlides: 1,
				slideMargin: 20,
				// auto: true,
				// autoHover: true,
				pager: true,
				pagerSelector: ".custom-pager-shop",
				onSliderLoad: function(currentIndex){
					var parquet_carousel_text  = $('#js-parquet-shopcarousel .parquet-carousel-content .parquet-carousel-text');
					parquet_carousel_text.removeClass('active');
					parquet_carousel_text.eq(currentIndex + 3).addClass('active');
					parquet_carousel_text.eq(currentIndex + 4).addClass('active');
					parquet_carousel_text.eq(currentIndex + 5).addClass('active');
					parquet_carousel_text.fadeIn("slow");
					parquet_carousel_text.not('.active').hide();
					deactivateSideLinks();
					$("#js-parquet-shopcarousel .bx-pager .active", this).parent().next().children().addClass("active");
					$('#js-parquet-shopcarousel').addClass('carousel-ready');
				},
				onSlideBefore: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
					var parquet_carousel_text  = $('#js-parquet-shopcarousel .parquet-carousel-content .parquet-carousel-text');
					parquet_carousel_text.removeClass('active');
					parquet_carousel_text.eq(currentSlideHtmlObject + 3).addClass('active');
					parquet_carousel_text.eq(currentSlideHtmlObject + 4).addClass('active');
					parquet_carousel_text.eq(currentSlideHtmlObject + 5).addClass('active');
					$('#js-parquet-shopcarousel .parquet-carousel-content .parquet-carousel-text.active').fadeIn(400);
					parquet_carousel_text.not('.active').fadeOut(400);
					deactivateSideLinks();
					$( '#js-parquet-shopcarousel .carousel-placeholder' ).trigger('loadImages');
				},
				onSlideAfter: function() {
					// updatePager();
				}
			});

			// setup initial active staties for custom pager
			setTimeout(function() {
				$("#js-parquet-shopcarousel .bx-pager .active").first().parent().next().children().addClass("active");
				$("#js-parquet-shopcarousel .bx-pager .active").first().parent().next().next().children().addClass("active");
			}, 10);

			$("#js-parquet-shopcarousel .bx-prev, #js-parquet-shopcarousel .bx-next, #js-parquet-shopcarousel .bx-pager").on("click", function() {
				// slider.stopAuto();
				// slider.startAuto();
				updatePager();
			});

			function updatePager() {
				$("#js-parquet-shopcarousel .bx-pager .active").first().parent().next().children().addClass("active");
				$("#js-parquet-shopcarousel .bx-pager .active").first().parent().next().next().children().addClass("active");

				if($("#js-parquet-shopcarousel .bx-pager .active").length < 3 ) {
					if($("#js-parquet-shopcarousel .bx-pager .active").first().parent().next().children().hasClass("active")) {
						$("#js-parquet-shopcarousel .bx-pager > .bx-pager-item").first().children().addClass("active");
					} else {
						$("#js-parquet-shopcarousel .bx-pager > .bx-pager-item").eq(0).children().addClass("active");
						$("#js-parquet-shopcarousel .bx-pager > .bx-pager-item").eq(1).children().addClass("active");
					}
				}

				if($("#js-parquet-shopcarousel .bx-pager .active").length > 3){
					if($("#js-parquet-shopcarousel .bx-pager .active").length == 4) {
						$("#js-parquet-shopcarousel .bx-pager > .bx-pager-item").eq(2).children().removeClass('active');
					} else {
						$("#js-parquet-shopcarousel .bx-pager > .bx-pager-item").eq(1).children().removeClass('active');
						$("#js-parquet-shopcarousel .bx-pager > .bx-pager-item").eq(2).children().removeClass('active');
					}
				}
			}

			function deactivateSideLinks() {
				$("#js-parquet-shopcarousel .bx-wrapper .slide a").unbind('click');
				$("#js-parquet-shopcarousel .overlay-img a").click(function(e) {
					e.preventDefault();
				});
			}

			// load and replace missing images when user interact in any way with the slider (next/prev, pager, swipe)
			$( "#js-parquet-shopcarousel .carousel-placeholder" ).one( "loadImages", function() {
				$( '#js-parquet-shopcarousel .carousel-placeholder' ).each(function() {
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