/*
* Zeit Online set Cookie for external referrer
*
* Copyright (c) 2014 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* @author Anika Szuppa
*/

(function( $ ) {
	$.fn.getExternalReferrer = function( options ) {

		//define object
		var plugin = {
			//test if there is an external referrer
			hasExternalReferrer: function(){
				if ( document.referrer && document.referrer.indexOf(window.location.host) != 7 ){
					return true
				}
			},
			//set session cookie
			setCookie: function(){
				var path = $( 'body' ).attr( 'data-smk_path' );
				ZEIT.cookieCreate( 'extreferrer_' + path.replace( '/', '_' ), path, 0.007 , '' );
			},
			//user with external referrer get a cookie
			createCookie: function(){
				if ( this.hasExternalReferrer() ){
					this.setCookie();
				}
			}
		}

		//run through elements
		return this.each( function() {
			plugin.createCookie();
		});

	};
})( jQuery );
