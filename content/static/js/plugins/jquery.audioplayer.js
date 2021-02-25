(function ($) {    
/*
* ZEIT ONLINE Audioplayer Plugin
* Copyright (c) 2012 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*
* @author Arne Seemann
* @version 1.0
* 
*/
var win = window;

var methods = {

	init : function( options ) {
		var defaults = $.extend( {
			player_template_url    : 'http://www.zeit.de/static/js/templates/audioplayer.html',
			player_div_id_prefix   : 'zon-audio-player-',
			controls_div_id_prefix : 'zon-audio-controls-',
			xml_filepath           : 'http://www.zeit.de/fb_fwm/audios/',
			media_filepath         : 'http://phpscripts.zeit.de/audioplayer/audios/',
			jplayer_swf            : win.js_path + '/libs/jplayer/2.2.0/',
			poster_width           : 90,
			poster_height          : 90 
			}, options);

			var self = this;

			return this.each( function (player_number) {

				var player_id = $(this).attr('class').replace(/.+aud(\d+).*/, '$1'),
					that = this;


				$.ajax({
					url: defaults.xml_filepath + player_id + '/' + player_id +'.xml',
					success: function(xml){

						var audio_meta = {
							artist   : $(xml).find('artist-name').text(),
							album    : $(xml).find('album-title').text(),
							song     : $(xml).find('short-description').text(),
							duration : $(xml).find('duration').text()
						};
						
						$.get(defaults.player_template_url, function(data){

							$(that).append(data.replace(
								'%player_id', defaults.player_div_id_prefix + player_number).replace(
								'%player_controls', defaults.controls_div_id_prefix + player_number).replace(
								'%song', audio_meta.song).replace(
								'%artist', audio_meta.artist).replace(
								'%album', audio_meta.album).replace(
								'%slider', 'zon-audio-volume-slider-' + player_number));
							
							$("#" + defaults.player_div_id_prefix + player_number).jPlayer({
								ready: function() {
									$(this).jPlayer(
										"setMedia", {
											mp3: defaults.media_filepath + player_id + '/' + player_id + '.mp3',
											poster: defaults.media_filepath + player_id + '/' + player_id + '.jpg'
										}
									);
									$(".slider-box", that).hide(); // set correct intial state for div in jQuery
									/* 
									$("#zon-audio-volume-slider-" + player_number).slider({
										orientation: "horizontal",
										range: "min",
										min: 0,
										max: 100,
										value: 60,
										animate: true
									});
									*/

									var current_user_agent = navigator.userAgent.toLowerCase(),
										mobile_platform = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/, // Useragent RegExp
										is_mobile_platform = mobile_platform.exec(current_user_agent);

									if ( !is_mobile_platform ) {
										$(".zon-volume-menubutton", that).show();
										$(".jp-gui.jp-interface", that).bind("click", function(evt) {
											if ( $(evt.target).hasClass("zon-volume-menubutton") ) {
												evt.preventDefault();
												$(evt.target).blur();
												$(".slider-box", that).show();	
											}
										});
									};

									$(".jp-volume-max", that).bind("click", function(evt) {
										$("#zon-audio-volume-slider-" + player_number).slider( "option", "value", 100 );
									});	

									$(".slider-box", that).bind("mouseleave", function(evt) {
										$(".slider-box", that).fadeOut();
									});
									
									// defensive condition checking avoids interference with jPlayer
									if( $(".jp-duration", that).text() === "00:00" || $(".jp-duration", that).text() === "NaN:NaN" ) {
										if ( audio_meta.duration !== "" ) {
											$(".jp-duration", that).text(audio_meta.duration);
										} else {
											$(".jp-duration", that).text("--:--");
										};
									}
								},
								swfPath: defaults.jplayer_swf,
								size: { 
									width: defaults.poster_width, 
									height: defaults.poster_height
								},
								cssSelectorAncestor: '#' + defaults.controls_div_id_prefix + player_number,
								/*
								cssSelector: {
									volumeBarValue: ".ui-slider-range"
								},
								*/
								wmode: "window", // for FF 3.6 compatibility
								volume: 0.8

								/* jPlayer Defaults */
								// errorAlerts: false   // Enables error reporting through alerts.
								// warningAlerts: false // Enables warning reporting through alerts.
								// solution: "html, flash"
								// supplied: "mp3"
								// cssSelectorAncestor: "#jp_container_1"
								// wmode:"opaque"
							});
						});
					},
					cache : false
				}); // end: $.ajax
			}); // end: return
		} // end: var defaults
	}; // end: init

	$.fn.audioplayer = function ( method ) {

		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || ! method  ) {
			if(this.size() > 0) return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.audioplayer' );
		}

	};

})(jQuery);

