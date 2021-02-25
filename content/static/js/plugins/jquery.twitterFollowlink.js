/*
 * ZEIT ONLINE Twitter-Follow-Buttons
 * Copyright (c) 2012 ZEIT ONLINE, http://www.zeit.de
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 * @author Arne Seemann
 * @version 1.0
 * 
 * Formatted according to: https://github.com/rwldrn/idiomatic.js
 *
 * Description: Creates follow button (just like the twitter one),
 * when <a class="twitterFollowlink" data-twittername="the_twitter_name"> </a>
 * is included in articles on ZEIT ONLINE.
 */

( function ($) {
	
	var methods = {
		
		init : function () {
			
			return this.each( function (index) {
				
				var twittername = $(this).attr( 'data-twittername' );
				console.log( 'follow me:', twittername );
				
				$(this).attr( 'href', 'http://twitter.com/intent/follow?screen_name=' + twittername);
				$(this).append( '<i class="twitter-icon"></i>'
				+ '@' + twittername + ' folgen');
				
				if ( index === 0 ) $(this).addClass( 'first' );
				
			}); // return this.each
			
		}
		
	}
	
	
	$.fn.twitterFollowlink = function ( method ) {

		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || ! method  ) {
			if(this.size() > 0) return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.twitterFollowlink' );
		}

	};
	
}) (jQuery);