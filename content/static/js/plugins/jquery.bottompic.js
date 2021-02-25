(function(c){function j(){var a,e={height:window.innerHeight,width:window.innerWidth};if(!e.height)if((a=document.compatMode)||!c.support.boxModel){a=a=="CSS1Compat"?document.documentElement:document.body;e={height:a.clientHeight,width:a.clientWidth}}return e}setInterval(function(){var a=[],e,g=0;c.each(c.cache,function(){if(this.events&&this.events.inview)if(this.events.live){var k=c(this.handle.elem);c.each(this.events.live,function(){a=a.concat(k.find(this.selector).toArray())})}else a.push(this.handle.elem)});
if(e=a.length){viewportSize=j();for(viewportOffset={top:window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop,left:window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft};g<e;g++)if(c.contains(document.documentElement,a[g])){var f=c(a[g]),d={height:f.height(),width:f.width()},b=f.offset(),h=f.data("inview"),i;if(b.top+d.height>b.top&&b.top<viewportOffset.top+viewportSize.height&&b.left+d.width>viewportOffset.left&&b.left<viewportOffset.left+viewportSize.width){i=
viewportOffset.left>b.left?"right":viewportOffset.left+viewportSize.width<b.left+d.width?"left":"both";d=viewportOffset.top>b.top?"bottom":viewportOffset.top+viewportSize.height<b.top+d.height?"top":"both";b=i+"-"+d;if(!h||h!==b)f.data("inview",b).trigger("inview",[true,i,d])}else h&&f.data("inview",false).trigger("inview",[false])}}},250)})(jQuery);

/**
* Zeit Online Bottompic Plugin
* adds the daily picture to the page where applied
* picture is loaded after the part of the page is in the visible area
*
* Copyright (c) 2011 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* @author Nico Bruenjes
* @version 1.0
*
*/
( function( $ ) {

	$.fn.bottompic = function ( options ) {

		var defaults = $.extend({
			source: this.attr( "data-src" ),
			title: this.attr( "data-title" ) || "Momentaufnahme",
			alt: this.attr( "data-alt" ) || "Momentaufnahme",
			width: 940,
			height: 530
		}, options);

		var that = this;

		return this.each( function () {
			var self = this;
			$( this ).removeClass( "hidden" );

			$( "#parquet" ).bind( "inview", function() {
				$( "<img>" )
				.hide()
				.attr( "src", defaults.source )
				.attr( "title", defaults.title )
				.attr( "alt", defaults.alt )
				.width( defaults.width )
				.height( defaults.height )
				.appendTo( $( ".imagereplacement", that ) )
				.wrap( '<a id="hp.global.bottom.link.momentaufnahme" href="' + $( '.fotolink > a', self ).attr( 'href' ) + '" />' )
				.show( 200, function() {
						// callback fuer GWPBanner, Erwin Senk, 18.07.2011
						if(typeof GWPLine != "undefined" && typeof GWPLine3 != "undefined") {
							GWPLine.init();
							GWPLine3.init2();
						}
						if(typeof nsIqd_setBg != "undefined") {
							nsIqd_setBg();
						}
				} );
				$( this ).unbind( "inview" );
			});


		});

	};

})( jQuery );