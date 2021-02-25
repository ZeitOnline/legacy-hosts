/**
* Zeit Online FacebookWiget Plugin 
* displays facebook widget after checking for user permission
* 
* Copyright (c) 2009-2011 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*
* @author Anika Szuppa
* @author Nico Bruenjes
* @version 1.0
* 
*/
(function($) {
	
	var defaults, self;
	
	var placeholderTemplate = '<div id="fb_placeholder" class="%iconclass"> <div class="fb_ph_head"> <div class="fb_ph_supertitle">%title</div> <div class="fb_ph_headlink"><a href="%informationLink">%informationText</a></div> </div> <div class="fb_ph_body"> <div class="fb_ph_user"></div> <div class="fb_ph_info"> <div class="fb_ph_info_inner"> <div class="fb_ph_text">%text</div> <div class="fb_ph_action" id="ph_action">%action</div> </div> </div> </div> </div>';
	
	var widgetTemplate = '<div id="fb_placeholder" class="nopic %iconclass"> <div class="fb_ph_head"> <div class="fb_ph_supertitle">%title</div> <div class="fb_ph_headlink"><a href="%informationLink">%informationText</a></div> </div><div id="facebookwidgetbody"><div id="activity-root"></div></div></div>';
	
	var appendSmk = function (name, addButton, addSource, addScript) {
		//append smk container
		var rand = parseInt( Math.random() * 100000, 10 );
		$(this).append( '<div class="' + name + '-root" id="' + name + '-root-' + rand + '"></div>' );
		//append content
		if( addScript == true ){
			//solves problem with appending script tag
			document.getElementById( name + "-root-" + rand ).appendChild(addSource);
		} else {
			//append smk source
			$( "#" + name + "-root-" + rand ).append(addSource);
		}
		//add smk button
		if(addButton != false){
			$( "#" + name + "-root-" + rand ).append(addButton);
		}
	};
	
	var buildFromTemplate = function (template, data) {
		$.each( data, function (name, val){
			template = template.replace("%" + name, val);
		});
		var zahl = parseInt(Math.random() * 10 / 3, 10);
		zahl = zahl < 1 ? "fb_ph_icon_001" : "fb_ph_icon_00" + zahl;
		template = template.replace("%iconclass", zahl);
		return template;
	};
	
	var getCookieValue = function (cookieName) {	
		return ZEIT.cookieRead(cookieName);				 
	};
	
	var methods = { 
		
		init: function( options ) {
			
			var settings = {
				debug: ZEIT.getQueryVar('smdebug') || false,
				cookieList: ['fb', 'twitter', 'google'],
				cookieSettings: { 
					cookiePrefix: 'zon-smk-optIn',
					domain: 'zeit.de',
					validFor: 365
				},
				optionsFacebook: {  // settings for facebook like button, https://developers.facebook.com/docs/reference/plugins/like/
					send: false,
					width: 120,
					show_faces: false,
					layout: 'button_count',
					colorscheme: 'light',
					action: 'like',
					font: 'lucida grande',
					ref: '',
					href: "https://www.facebook.com/zeitonline",
					appId: '156184154456122',
					apiURL: '//connect.facebook.net/de_DE/all.js'
				},
				placeholder: {
					title: "Empfehlungen bei Facebook",
					text: '<p>Hier werden aktuelle Empfehlungen aus Ihrem Facebook-Freundeskreis angezeigt.</p><p>Aus Datenschutzgründen werden diese erst geladen, wenn Sie die Social-Media Dienste aktiviert haben. Bitte beachten Sie, dass nach Ihrer Zustimmung Daten mit anderen externen Diensten ausgetauscht werden.</p>',
					action: 'Social-Media Dienste aktivieren',
					informationLink: window.www_root + "/administratives/social-media",
					informationText: "[Datenschutz]"
				},
				inbetweenscreen: {
					text: '<div class="fb_ph_text"><p>Die Verbindung zu folgenden Social-Media Diensten wurde hergestellt:</p><p><img src="http://images.zeit.de/static/img/socialmediagrant.gif"></p><p class="reaction">Weitere Informationen zum Datenschutz <a href="' + window.www_root + '/administratives/social-media">erhalten Sie hier</a>.</p></div>',
					timeout: 7 // in sekunden
				},
				recentActivity: {
					title: "Empfehlungen bei Facebook",
					site: "www.zeit.de",
					width: 320,
					height: 240,
					header: false,
					font: "verdana",
					border_color: "%23ffffff",
					recommendations: false,
					colorscheme: "light",
					filter: '',
					ref: 'facebook.zonarticle.klick.article.activityfeed',
					max_age: 7,
					informationLink: window.www_root + "/administratives/social-media",
					informationText: "[Datenschutz]"
				},
				redirectTo : false,
				leadBackToUrl: false
			};
			
			self = this;
			defaults = $.extend(settings, options);
			
			return this.each( function() {
				
				$( this ).empty();
				
				
				$( document ).on("click",'#ph_action', function() {
					$(this).smkFacebookWidget("setCookies");
					$("#fb_placeholder .fb_ph_body")
					.hide(1, function() {
						$('.fb_ph_info_inner', this)
						.empty()
						.append($(defaults.inbetweenscreen.text));
						$(this)
						.show(1, function() {
							var that = this;
							var t = window.setTimeout( function(){
								$("#fb_placeholder").hide(1, function () {
									$(this).remove();
									$(self).smkFacebookWidget("recentActivity");
									$("#fb_backlink").remove();
									$('<div id="fb_backlink"><a href="http://www.facebook.com/zeitonline">ZEIT ONLINE</a> auf Facebook <span id="fb-recom-like"></span></div>').appendTo(self);
									$("#fb-recom-like").smkFacebookWidget("fb");
								});
								
							}, (defaults.inbetweenscreen.timeout * 1000));
						});
						// update Settings
						if( $("#smkSettings").size() > 0 && typeof($.fn.smkSettings) !== "undefined" ) {
							$("#smkSettings").smkSettings();
						}
						// update socialmedia
						if( typeof($.fn.socialmedia) !== "undefined" ) {
							if($(".show_smk").size() > 0) $(".show_smk").socialmedia("articlebar");
							if($(".bookmark").size() > 0) $('.bookmark').socialmedia("toolbox", {smkList:['fbwithsend','google', 'twitter']});
						}
					});
					
					if (defaults.debug) console.info("hp.article.box.socialmedia.optin");
					ZEIT.clickWebtrekk("hp.article.box.socialmedia.optin");
						
				});
				
				if ( ! $(this).smkFacebookWidget("checkCookies") ) {
					// policy anzeigen
					$(this).smkFacebookWidget("placeholder");
					$('<div id="fb_backlink"><a href="http://www.facebook.com/zeitonline">ZEIT ONLINE</a> auf Facebook</div>').appendTo(this);
				} else {
					$(this).smkFacebookWidget( $(this).attr("id") );
					$('<div id="fb_backlink"><a href="http://www.facebook.com/zeitonline">ZEIT ONLINE</a> auf Facebook <span id="fb-recom-like"></span></div>').appendTo(this);
					$("#fb-recom-like").smkFacebookWidget("fb");
				}			
			});
			
		},
		checkCookies: function () {
			/**
			 * checks for the permission cookies
			 * @return bool
			 */
			var bool = true;
			$.each( defaults.cookieList, function ( index, value ) {
				if ( ! getCookieValue( defaults.cookieSettings.cookiePrefix + '-' + value ) ) {
					// if one is false, all are
					bool = false;
				}
			});
			return bool;
		},
		setCookies: function () {
			/**
			 * sets the permission cookies
			 * @return bool
			 */
			$.each(defaults.cookieList, function( key, value) {
				ZEIT.cookieCreate( defaults.cookieSettings.cookiePrefix + '-' + value, true, defaults.cookieSettings.validFor, defaults.cookieSettings.domain );
			});
			return ( $(this).smkFacebookWidget("checkCookies") );
		},
		deleteCookies: function () {
			/**
			 * deletes for the permission cookies
			 * @return bool
			 */
			$.each(defaults.cookieList, function( key, value) {
				ZEIT.cookieErase( defaults.cookieSettings.cookiePrefix + '-' + value );
			});
			return ( ! $(this).smkFacebookWidget("checkCookies") );
		},
		fb: function (send) {
			/**
			 * prints out a facebook like button
			 * @returns void
			 */
			//implement asynchronus loading
			window.fbAsyncInit = function () {
				FB.init({appId: defaults.optionsFacebook.appId, status: true, cookie: true, xfbml: true});
			};
			
			$('<div id="fb-root"></div>').appendTo("body");

			//prepare script
			var e = document.createElement('script');
			e.type = 'text/javascript';
			e.async = true;
			e.src	= document.location.protocol + defaults.optionsFacebook.apiURL;
			
			var withsend = send === true ? true : defaults.optionsFacebook.send;
			var layout = $(this).hasClass( defaults.nocountclass ) ? 'standard' : defaults.optionsFacebook.layout;

			//prepare like/send button
			var addButton 	= 	'<fb:like '
							+	'href="' + defaults.optionsFacebook.href + '" '
							+	'send="' + withsend + '" '
							+	'width="' + defaults.optionsFacebook.width + '" '
							+	'show_faces="' + defaults.optionsFacebook.show_faces + '" '
							+	'layout="' + defaults.optionsFacebook.layout + '" '
							+	'action="' + defaults.optionsFacebook.action + '" '
							+	'colorscheme="' + defaults.optionsFacebook.colorscheme + '" '
							+	'ref="' + defaults.optionsFacebook.ref + '" '
							+	'font="' + defaults.optionsFacebook.font + '">'
							+	'</fb:like>';

			//append to DOM
			appendSmk.call(this, "fb", addButton, e, true);
		},
		placeholder: function () {
			
			$( buildFromTemplate(placeholderTemplate, defaults.placeholder) ).appendTo( self );
			
		},
		recentActivity: function () {
							
			var frame 	= 	'<iframe id="fb_showrecoms_frame" src="//www.facebook.com/plugins/activity.php?'
						+	'site=' + defaults.recentActivity.site
						+	'&width=' + defaults.recentActivity.width
						+	'&height=' + defaults.recentActivity.height
						+	'&header=' + defaults.recentActivity.header
						+	'&border_color=' + defaults.recentActivity.border_color
						+	'&recommendations=' + defaults.recentActivity.recommendations
						+	'&colorscheme=' + defaults.recentActivity.colorscheme
						+	'&filter=' + defaults.recentActivity.filter
						+	'&ref=' + defaults.recentActivity.ref
						+	'&max_age=' + defaults.recentActivity.max_age
						+	'&font=' + defaults.recentActivity.font
						+	'&linktarget=_parent" scrolling="no" allowtranparency="true" frameborder="0"></iframe>';
			
			$( buildFromTemplate(widgetTemplate, defaults.recentActivity) ).prependTo( self );
			
			$(frame)
			.css({
				width: defaults.recentActivity.width,
				height: defaults.recentActivity.height,
				overflow: "hidden",
				border: "none",
				marginTop: "-5px",
				marginLeft: "-10px"
			}).appendTo('#activity-root');
		}
		
	}; // end: methods
	
	$.fn.smkFacebookWidget = function( method ) {

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    

	};

})( jQuery );