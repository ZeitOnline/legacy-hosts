/*
* Zeit Online HP Overlay
*
* Copyright (c) 2014 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* @author Anika Szuppa
* @author Nico Brünjes
*
* @requires ZEIT-Lib
*/

(function( $ ) {
	$.fn.hpOverlay = function( options ) {

		// defaults are overwritten by 
		// http://scripts.zeit.de/static/js/hpoverlay.config.js
		var defaults = $.extend({
			cookie_time_in_days: 1.5,
			counting_prefix: 'refreshbox',
			endpoint: 'http://www.zeit.de/json_update_time/index',
			homepage: 'http://www.zeit.de/index',
			minutes: 5,
			isOn: true,
			timestamp: '',
			updateTime: 1,
			debug: (ZEIT.getQueryVar('aktPopDebug') && console && console.info && console.warn) || false
		}, options);

		//define overlay functions
		var overlay = {
			getHtml: function(){
				var html = '<div class="hp_overlay" id="hp_overlay" data-tracking="refreshOverlay"></div>'
						 	+ '<div class="hp_lightbox" id="hp_lightbox">'
							+ 	'<div class="hp_lightbox__inner">'
							+ 		'ZEIT ONLINE wurde aktualisiert.'
							+ 		'<button type="button" class="hp_lightbox__inner__submit" data-tracking="refreshButton">'
							+ 			'<div class="hp_lightbox__inner__text">Seite neu laden</div>'
							+ 			'<div class="hp_lightbox__inner__image">'
							+ 				'<img src="http://live0.zeit.de/infografik/misc/reload.png">'
							+			'</div>'
							+ 		'</button>'
							+ 		'<button type="button" class="hp_lightbox__inner__cancel" data-tracking="cancel">'
							+ 			'abbrechen'
							+		'</button>'
							+ 	'</div>'	
							+ '</div>';
				return( html );
			},
			prependHtml: function(){
			// prepend html to body
				if( $( '#hp_overlay' ).size() < 1 ) {
					$( 'body' ).prepend( $( this.getHtml() ) );
				}
				$( '#hp_overlay' ).fadeIn();
				$( '#hp_lightbox' ).show();
				this.trackEvent('appear');
			},
			clickCancel: function(){
			// action when cancel button was clicked
				$( '#hp_lightbox' ).hide();
				$( '#hp_overlay' ).hide();
				ZEIT.cookieCreate( 'overlaycanceled', 1, defaults.cookie_time_in_days, '' );
				window.clearTimeout( timer );
				$( document ).off( 'keypress scroll click mousemove' );
				if( defaults.debug ) {
					console.info('AktPop cancelled.');
				}
			},
			clickAnythingElse: function(){
			// action when anything in the lightbox was clicked
				location.reload();
			},
			bindClickEvents: function(){
			// bind click event for lightbox
				var that = this,
					trackingCode = "";
				$( '#hp_lightbox, #hp_overlay' ).on( 'click', function( event ) {
					event.preventDefault();
					trackingCode = $(event.target).data('tracking');
					if( trackingCode !== "") {
						that.trackEvent(trackingCode);
					}
					if( $( event.target ).hasClass( 'hp_lightbox__inner__cancel' ) ){
					// on cancel button
						that.clickCancel();
					} else {
					// anywhere else
						that.clickAnythingElse();
					}
				});
			},
			restartTimer: function( time ) {
				time = time || defaults.minutes;
				// clear and restart timer
				if( !$( '#hp_overlay' ).is(':visible') ) {
					window.clearTimeout( timer );
					overlay.addTimer( time );
					if( defaults.debug ) {
						console.info('Timer restarted.');
					}
				}
			},
			bindResetEvents: function(){
			// bind events to reset timer
				var that = this;
				$( document ).on( 'keypress scroll click mousemove', function() {
					that.restartTimer();
				});
			},
			addTimer: function( min ){
			// add timer
				if( defaults.debug ) {
					console.info('mins: ', min);
				}
				var timeout = min * 60 * 1000;
				timer = window.setTimeout( initPopup, timeout );
			},
			updateTime: function(){
				var that = this,
					request = $.ajax(defaults.endpoint, {dataType: 'jsonp', jsonpCallback: 'askForNicolas'});

				request.done( function( data ){
					// json anfrage ist fertig
					defaults.timestamp = data.last_published_semantic;
					that.addTimer( defaults.minutes );
				});
			},
			isLiveServer: function() {
				return !window.location.hostname.search(/(www.)?zeit\.de/);
			},
			trackEvent: function(track) {
				var garray = [ '_trackEvent', defaults.counting_prefix ];
				if( typeof track !== 'undefined' ) {
					ZEIT.clickWebtrekkOnly( defaults.counting_prefix + '.' + track);
					garray.push( track );
					garray.push( defaults.homepage );
					ZEIT.clickGA( garray );
				}
			}
		};

		//global timer
		var timer = false;

		//initialise popover
		function initPopup(){
			var request = $.ajax(defaults.endpoint, {dataType: 'jsonp', jsonpCallback: 'askForNicolas'});

			request.done( function( data ){
				if( defaults.debug ) {
					console.info(defaults.timestamp, data.last_published_semantic);
				}
				if( defaults.timestamp !== data.last_published_semantic) {
					if( defaults.debug ) {
						console.info('Page was updated.');
					}
					overlay.prependHtml();
					overlay.bindClickEvents();
				} else {
					if( defaults.debug ) {
						console.info('JSON call found no page update.');
					}
					overlay.restartTimer(defaults.updateTime);
				}
			});
		}

		return this.each( function() {
			if( ! overlay.isLiveServer() && ! defaults.debug ) {
				console.warn('AktPopup cancelled because not on live server.');
				return this;
			}
			if( window.location.search.indexOf( 'cancelPopup' ) > -1 && console && console.info && console.warn ) {
				console.log('Popup cancelled by user request');
				return this;
			}
			var cookie = ZEIT.cookieRead( 'overlaycanceled' );
			//only start timer if cookie wasn't set and it is switched on
			if( cookie != 1 && defaults.isOn ) {
				if( defaults.debug ) {
					console.info('AktPop started w/ minutes: ', defaults.minutes, ' and updateTime: ', defaults.updateTime);
				}
				overlay.bindResetEvents();
				overlay.updateTime();
			} else {
				if( defaults.debug ) {
					console.warn('Cookie present, action stopped.');
				}
				return this;
			} 	
		});

	};//end of plugin
})( jQuery );
