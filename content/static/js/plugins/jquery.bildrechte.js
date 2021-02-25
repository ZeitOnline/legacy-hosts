/**
* Zeit Online Bildrechte Plugin
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
	
	$.fn.bildrechte = function ( options ) {
		
		var defaults = $.extend({}, options);
		
		return this.each( function () {

			if( ! $(this).hasClass('br_rendered') ) {
				$(this).addClass('br_rendered'); // mark as rendered
				$(this).find("li").each(function(i){

					var bild = $(this).dataset('imageurl') ? '<img alt="" src="'+ $(this).dataset('imageurl') +'" />' : '<span style="display:inline-block;height:40px;width:70px;background:#eee;"></span>';
					$(this)
					.wrapInner('<div class="bildrecht-text"></div>')
					.prepend('<div class="bildrecht-img">'+bild+'</div>')
					.prepend('<div class="bildrecht-nr">'+ (i+1) +'.</div>');


				});
			}

			$.colorbox({
				inline: true,
				href: "#bildrechte",
				opacity: 0.9, 
				scrolling: true,
				innerWidth: 660,
				height: "80%",
				speed: 800, 
				close : "Schliessen",
				title: "Bildrechte auf der Seite: " + window.location.href
			}, function() {
				$("#cboxClose").css("position", "absolute");
			});
		});
		
	};
	
})( jQuery );