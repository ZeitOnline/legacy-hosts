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
			box :	  '<div class="iat_arrow"></div>'
					+ '<div class="iat_box">'
					+	'<div class="iat_innerbox">'
					+		'<div class="iat_closebox" title="schließen"><div class="iat_close"></div><span class="iat_close">schließen</span></div>'
					+		'<div class="iat_buttons">'
					+			'<div class="iat_save" data-tracking-google-category="articletools" data-tracking-google-action="save" data-tracking-webtrekk="hp.article.tools.save" title="Artikel speichern">PDF</div>'
					+			'<a href class="drupalsendarticle cboxElement" title="E-Mail verschicken" rel="nofollow" data-tracking-google-category="articletools" data-tracking-google-action="mail" data-tracking-webtrekk="hp.article.tools.send.mail"><div class="iat_mail"></div></a>'
					+			'<div class="iat_print" title="Artikel drucken" data-tracking-google-category="articletools" data-tracking-google-action="print" data-tracking-webtrekk="hp.article.tools.print"></div>'
					+			'<div class="iat_twitter" title="Artikel per Twitter teilen" data-tracking-google-category="articletools" data-tracking-google-action="twitter" data-tracking-webtrekk="hp.article.tools.send.twitter"></div>'
					+			'<div class="iat_facebook" title="Artikel per Facebook teilen" data-tracking-google-category="articletools" data-tracking-google-action="facebook" data-tracking-webtrekk="hp.article.tools.send.facebook"></div>'
					+			'<div class="iat_google" title="Artikel per Google+ teilen" data-tracking-google-category="articletools" data-tracking-google-action="google" data-tracking-webtrekk="hp.article.tools.send.google"></div>'
					+		'</div>'
					+		'<div class="iat_share">'
					+			'<div class="iat_save" title="Artikel speichern" data-tracking-google-category="articletools" data-tracking-google-action="save" data-tracking-webtrekk="hp.article.tools.save">Speichern</div>'
					+			'<div class="iat_mail"><a href class="drupalsendarticle cboxElement" title="E-Mail verschicken" rel="nofollow" data-tracking-google-category="articletools" data-tracking-google-action="mail" data-tracking-webtrekk="hp.article.tools.send.mail">Mailen</a></div>'
					+			'<div class="iat_print" title="Artikel drucken" data-tracking-google-category="articletools" data-tracking-google-action="print" data-tracking-webtrekk="hp.article.tools.print">Drucken</div>'
					+			'<div class="iat_twitter" title="Artikel per Twitter teilen" data-tracking-google-category="articletools" data-tracking-google-action="twitter" data-tracking-webtrekk="hp.article.tools.send.twitter">Twitter</div>'
					+			'<div class="iat_facebook" title="Artikel per Facebook teilen" data-tracking-google-category="articletools" data-tracking-google-action="facebook" data-tracking-webtrekk="hp.article.tools.send.facebook">Facebook</div>'
					+			'<div class="iat_google" title="Artikel per Google+ teilen" data-tracking-google-category="articletools" data-tracking-google-action="google" data-tracking-webtrekk="hp.article.tools.send.google">Google +</div>'
					+		'</div>'
					+	'</div>'
					+ '</div>',
			canonical_url: function(){
			//guess canonical url

				var c_url = location.href,
					www_root = window.www_root,
					smk_path = $( 'body' ).data('smk_path');

				// Neither undefined nor empty values are acceptable
				if ( www_root && smk_path ){
					c_url = www_root + smk_path;
				}

				return c_url;
			},
			close: function(){
			//close box
				this.el.toggleClass( 'isVisible' );
			},
			save: function(){
			//open pdf

				var url = this.canonical_url();
				url = url.replace( this.url, 'http://pdf.zeit.de' ) + '.pdf';

				window.open( url );
			},
			mail: function( el ){
			//add url to mail buttons

				// allow mailing when 'Komplettansicht' is selected
				var url = this.canonical_url();
				url = url.replace( this.url, 'http://community.zeit.de/recommendation/remote?url=' );
				url += '%3Fwt_zmc%3Dsm.ext.zonaudev.mail.ref.zeitde.dskshare.link.x%26utm_medium%3Dsm%26utm_source%3Dmail_zonaudev_ext%26utm_campaign%3Dmail_referrer%26utm_content%3Dzeitde_dskshare_link_x'
				this.el.find( '.drupalsendarticle' ).attr( 'href', url );

			},
			print: function(){
			//print
				var url = this.canonical_url() + '/komplettansicht?print=true';
				window.open( url );

			},
			twitter: function(){
			//share by twitter
				var share = {
					url: $( 'meta[property="og:url"]' ).attr( 'content' ) || this.canonical_url(),
					text: $( 'meta[property="twitter:title"]' ).attr( 'content' ) || $( 'meta[property="og:title"]' ).attr( 'content' ) || $( 'title' ).text(),
					via: 'zeitonline'
				};
				share.url += '?wt_zmc=sm.int.zonaudev.twitter.ref.zeitde.dskshare.link.x&utm_medium=sm&utm_source=twitter_zonaudev_int&utm_campaign=twitter_referrer&utm_content=zeitde_dskshare_link_x'
				var url = 'https://twitter.com/share?' + $.param( share );

				window.open( url );
			},
			facebook: function(){
			//share by facebook

				var share = $( 'meta[property="og:url"]' ).attr( 'content' );
				var title = $( 'meta[property="og:title"]' ).attr( 'content' );
				var desc = $( 'meta[property="og:description"]' ).attr( 'content' );
				var img = $( 'meta[property="og:image"]' ).attr( 'content' );
				var url = 'http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' +share
					+'%3Fwt_zmc%3Dsm.int.zonaudev.facebook.ref.zeitde.dskshare.link.x%26utm_medium%3Dsm%26utm_source%3Dfacebook_zonaudev_int%26utm_campaign%3Dfacebook_referrer%26utm_content%3Dzeitde_dskshare_link_x'
					+ '&p[images][0]=' +img+ '&p[title]=' +title+ '&p[summary]=' +desc;

				window.open( url );
			},
			google: function(){
			//share by google

				var share = location.protocol + "//" + location.host + location.pathname;
				var url = 'https://plus.google.com/share?url=' +share +'%3Fwt_zmc%3Dsm.int.zonaudev.gplus.ref.zeitde.dskshare.link.x%26utm_medium%3Dsm%26utm_source%3Dgplus_zonaudev_int%26utm_campaign%3Dgplus_referrer%26utm_content%3Dzeitde_dskshare_link_x';

				window.open( url );
			},
			count: function( elem ) {
				if ( typeof ZEIT !== 'undefined' ) {
					if ( $( elem ).data('tracking-webtrekk') ){
						ZEIT.clickWebtrekkOnly( $(elem).data('tracking-webtrekk') );
					}
					if ( $( elem ).data('tracking-google-action') && $( elem ).data('tracking-google-category') ) {
						var trackingevent = $( elem ).data('tracking-google-event') ? $( elem ).data('tracking-google-event') : "_trackEvent",
							ga_code = [trackingevent, $( elem ).data('tracking-google-category'), $( elem ).data('tracking-google-action')];
						if ( $( elem ).data('tracking-google-optvalue') ) {
							ga_code.push( $( elem ).data('tracking-google-optvalue') );
						}
						if ( $( elem ).data('tracking-google-optnoninteraction') ) {
							ga_code.push( $( elem ).data('tracking-google-optnoninteraction') );
						}
						ga_code.push( window.location.href );
						ZEIT.clickGA( ga_code );
					}
				}
			}
		};

		//reset url if applies
		if( window.www_root ){
			iat.url = window.www_root;
		}

		//append main box
		iat.el.append( iat.box );

		//hide elements if applies, e.g. on video single page
		if( iat.el.attr( 'data-iat_exclude') ){
			var exclude = iat.el.attr( 'data-iat_exclude').split(',');

			//hide
			$( exclude ).each( function( index, value ){
				iat.el.find( '.' + value ).hide();
			});
		}

		//prepare mail button
		iat.mail();

		//bind events, everything beside mail, cause that's a link
		iat.el.find( ".iat_box" ).bind( "click", function( event ){
			var func = $( event.target ).attr( 'class' ).replace( 'iat_', '' );
			if( iat[ func ] && func != 'mail' ) {
				iat.count( event.target );
				iat[ func ]( event.target );
			}
		});

		//bind toogle function
		$( ".articlemeta-toolsbutton" ).bind( "click", function( event ) {
			if( $('.iat_box:visible').size() === 0 ) { // nur beim oeffnen zaehlen
				iat.count( event.target );
			}
			$( ".zol_inarticletools" ).toggleClass( 'isVisible' );
			$(".zol_inarticletools").css('z-index', 1);

		});

		$( iat.el ).delegate('.drupalsendarticle','click', function(event){ // mail zaehlen
			iat.count( event.currentTarget );
		});

		//Set negative z-index when css transition has finished to hide iat behind the text
		$(".zol_inarticletools").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(event){
			if (event.originalEvent.propertyName == 'height' && $(".zol_inarticletools").css('height') == '0px') {
				$(".zol_inarticletools").css('z-index', -5);
			}
		});


	};//end of plugin
})( jQuery );
