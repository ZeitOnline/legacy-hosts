/*
* Zeit Online back to HP Button Plugin
*
* Copyright (c) 2014 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* @author Anika Szuppa
*/

(function( $ ) {
	$.fn.back2HpButton = function( options ) {

		//define object
		var butAction = {
			//test if there is an external referrer
			hasExternalReferrer: function(){
				if ( document.referrer && document.referrer.indexOf(window.location.host) != 7 ){
					return true;
				}
			},
			//test if an external referrer was set before by the same article (multiple pages)
			hasReferrerCookie: function(){
				var path = $( 'body' ).attr( 'data-smk_path' );
				var cookie = ZEIT.cookieRead( 'extreferrer_' + path.replace( '/', '_' ) );
				if( cookie === path ){
					return true;
				} 
			},
			//user with external referrer are presented with a yellow button
			init: function( $but ){
				if ( this.hasExternalReferrer() || this.hasReferrerCookie() ){
					$but.addClass( 'home-button-article--yellow' );
				}
			}
		}

		//run through elements
		return this.each( function() {
			but = $( this ).find( '.home-button-article' );
			butAction.init( $( but ) );
		});

	};
})( jQuery );
