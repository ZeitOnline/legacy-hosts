/*
* Zeit Online in Article Tools Plugin
*
* Copyright (c) 2013 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* @author Anika Szuppa
*/

(function( $ ) {
	$.fn.inarticleTools = function( options ) {

		//define plugin
		var iat = {
			url : 'http://www.zeit.de',
			el : this,
			box :	'<div data-animatable="true">'
					+ '<div class="iat_arrow"></div>'
					+ '<div class="iat_box">'
					+	'<div class="iat_innerbox">'
					+		'<div class="iat_closebox" title="schließen"><div class="iat_close"></div><span class="iat_close">schließen</span></div>'
					+		'<div class="iat_buttons">'
					+			'<div class="iat_save" title="Artikel speichern">PDF</div>'
					+			'<a href class="drupalsendarticle cboxElement" title="E-Mail verschicken" rel="nofollow"><div class="iat_mail"></div></a>'
					+			'<div class="iat_print" title="Artikel drucken"></div>'
					+			'<div class="iat_twitter" title="Artikel per Twitter teilen"></div>'
					+			'<div class="iat_facebook" title="Artikel per Facebook teilen"></div>'
					+			'<div class="iat_google" title="Artikel per Google+ teilen"></div>'
					+		'</div>'
					+		'<div class="iat_share">'
					+			'<div class="iat_save" title="Artikel speichern">Speichern</div>'
					+			'<div class="iat_mail"><a href class="drupalsendarticle cboxElement" title="E-Mail verschicken" rel="nofollow">Mailen</a></div>'
					+			'<div class="iat_print" title="Artikel drucken">Drucken</div>'
					+			'<div class="iat_twitter" title="Artikel per Twitter teilen">Twitter</div>'
					+			'<div class="iat_facebook" title="Artikel per Facebook teilen">Facebook</div>'
					+			'<div class="iat_google" title="Artikel per Google+ teilen">Google +</div>'
					+		'</div>'
					+	'</div>'
					+ '</div>'
					+ '</div>',
			close: function(){
			//close box
				this.el.children().slideToggle( 'slow' );
			},
			save: function(){
			//open pdf

				var url = location.protocol + "//" + location.host + location.pathname;
					url = url.replace( this.url, 'http://pdf.zeit.de' ) + '.pdf';

				window.open( url );
			},
			mail: function( el ){
			//add url to mail buttons

				var url = location.protocol + "//" + location.host + location.pathname;
				url = url.replace( this.url, 'http://community.zeit.de/recommendation/remote?url=' );
				var id = 'hp.article.tools.send.' + location.pathname;

				this.el.find( '.drupalsendarticle' ).attr( 'href', url );

			},
			print: function(){
			//print

				var url = location.protocol + "//" + location.host + location.pathname + '/komplettansicht?print=true';
				window.open( url );
			},
			twitter: function(){
			//share by twitter

				var share = location.protocol + "//" + location.host + location.pathname;
				var url = 'http://twitter.com/home?status=' +share;

				window.open( url );

			},
			facebook: function(){
			//share by facebook

				var share = $( 'meta[property="og:url"]' ).attr( 'content' );
				var title = $( 'meta[property="og:title"]' ).attr( 'content' );
				var desc = $( 'meta[property="og:description"]' ).attr( 'content' );
				var img = $( 'meta[property="og:image"]' ).attr( 'content' );
				var url = 'http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' +share+ '&p[images][0]=' +img+ '&p[title]=' +title+ '&p[summary]=' +desc;

				window.open( url );
			},
			google: function(){
			//share by google

				var share = location.protocol + "//" + location.host + location.pathname;
				var url = 'https://plus.google.com/share?url=' +share;

				window.open( url );
			}
		}

		//reset url if applies
		if( window.www_root ){
			iat.url = window.www_root;
		}

		//append main box
		iat.el.append( iat.box );

		//prepare mail button
		iat.mail();

		//bind events, everything beside mail, cause that's a link
		iat.el.find( ".iat_box" ).bind( "click", function( event ){

			var func = $( event.target ).attr( 'class' ).replace( 'iat_', '' );

			if( iat[ func ] && func != 'mail' ){
				iat[ func ]( event.target );
			}

		});

		//bind toogle function
		$( ".articlemeta-toolsbutton" ).bind( "click", function( event ) {

			$( ".zol_inarticletools" ).children().slideToggle( 'slow' );

		});

	};//end of plugin
})( jQuery );