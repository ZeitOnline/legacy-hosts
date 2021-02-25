/**
* Zeit Online SocialMediaKomponenten® Plugin
* displays social media components after checking for user permission
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

	// privates
	var defaults,
		self,
		loc = window.location,
		d = document,
		policyTemplate = '<div class="smk-preview"><div class="smk-info">%anchor</div><div class="smk-action smk-hover">%linkText</div><a class="smk-information" href="%informationLink">%informationText</a></div>',
		layerTemplate = '<div class="smk-layer"><div class="smk-layer-close">X</div><div class="smk-layertext">%overlayText&nbsp;<a href="%informationLink">%informationText</a></div><div class="smk-action smk-setcookies">%overlayLinkText</div></div>',
		added = {
			fb: false,
			fbsend: false,
			google: false,
			twitter: false
		},
		pageUrl = "http://www.zeit.de";

	if( undefined != $("meta[property='og:url']").attr("content") ) {
		if( typeof window.www_root != "undefined" || loc.href.indexOf(window.www_root) > -1 ) {
			pageUrl = $("meta[property='og:url']").attr("content").replace(window.www_root, pageUrl);
		} else {
			pageUrl = $("meta[property='og:url']").attr("content");
		}
	} else {
		pageUrl = loc.href;
	}

	var appendSmk = function (name, addButton, addSource) {
		if (! added[name]) {
			var po = d.createElement('script');
			po.type = 'text/javascript';
			po.async = true;
			po.src = d.location.protocol + addSource;
			var s = d.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(po, s);
			added[name] = true;
		}
		var rand = parseInt( Math.random() * 100000, 10 );
		$(this).append( '<div class="' + name + '-root" id="' + name + '-root-' + rand + '">' + addButton + '</div>' );
	};

	var buildFromTemplate = function (template, data) {
		$.each( data, function (name, val){
			template = template.replace("%" + name, val);
		});
		return template;
	};

	var getCookieValue = function (cookieName) {
		return ZEIT.cookieRead(cookieName);
	};

	var methods = {

		init: function( options ) {

			var settings = {
				debug: ZEIT.getQueryVar('smdebug') || false,
				smkList: ['fb', 'twitter', 'google'],
				cookieList: ['fb', 'twitter', 'google'],
				textAnchor: "", // text to display on start of line,
				nocountclass: "smk-no-count",
				touch: "mouseover, click",
				bitLy: { // params for bit.ly service
					api: "http://api.bit.ly/v3/shorten",
					apiuser: "zeitonlinetools",
					apikey: "R_962edb74ef51b736414f042c3e826e5d",
					apiformat: "json"
				},
				cookieSettings: {
					cookiePrefix: 'zon-smk-optIn',
					domain: 'zeit.de',
					validFor: 365
				},
				policyDisplay: {
					anchor: $("body").attr("data-page_type") == "video" ? "Video empfehlen:" : "Artikel empfehlen:", // toDo: in der Aufruf verlegen
					linkText: "Social-Media Dienste aktivieren",
					informationLink: window.www_root + "/administratives/social-media",
					informationText: "[Datenschutz]"
				},
				overlay: { // data for the opt-in overlay
					overlayLinkText: "Social-Media Dienste aktivieren",
					overlayText: "Durch eine Aktivierung der Social-Media-Buttons senden Sie auch Daten an die Netzwerke, wenn Sie nicht mit den Plugins interagieren, aber beim jeweiligen Anbieter eingeloggt sind.",
					informationLink: window.www_root + "/administratives/social-media",
					informationText: "Weitere Informationen"
				},
				optionsFacebook: {  // settings for facebook like button, https://developers.facebook.com/docs/reference/plugins/like/
					send: false,
					width: 113,
					show_faces: false,
					layout: 'button_count',
					colorscheme: 'light',
					action: 'recommend',
					font: 'lucida grande',
					ref: 'facebook.zonarticle.klick.article.recommend',
					href: pageUrl,
					appId: '156184154456122',
					apiURL: '//connect.facebook.net/de_DE/all.js',
					script: "//connect.facebook.net/de_DE/all.js#xfbml=1&appId=156184154456122"
				},
				optionsFacebookSend: { // settings for facebook send button, https://developers.facebook.com/docs/reference/plugins/send/
					colorscheme: 'light',
					font: 'lucida grande',
					ref: 'facebook.zonarticle.klick.article.send',
					href: pageUrl
				},
				optionsGoogle: { // settings for google plus button, http://www.google.com/webmasters/+1/button/
					size: 'medium',
					lang: 'de',
					annotation: 'bubble',
					href: pageUrl,
					script: '//apis.google.com/js/plusone.js'
				},
				optionsStudiVz: {
					url: 'http://www.studivz.net/Link/Share/',
					href: "http://" + loc.hostname + loc.pathname
				},
				optionsTwitter: { // settings for the twitter button, https://dev.twitter.com/docs/tweet-button
					useShortener: false,
					dataVia: 'zeitonline',
					dataText: $("meta[property='og:title']").attr("content") || $('title').text(),
					lang: 'de',
					dataUrl: pageUrl,
					dataCountUrl: pageUrl,
					count: "horizontal",
					script: '//platform.twitter.com/widgets.js'
				}
			};
			self = this;
			defaults = $.extend(settings, options);

			return this.each( function() {
				if (defaults.debug) {
					console.info("debugging mode enabled, hello @ll");
				}

				$(".tools .bookmark").show();

				// bind mouseover for overlay
				$(this).on(defaults.touch, '.smk-hover', function ( evt ) {
					evt.preventDefault();
					$('.smk-layer', self).fadeIn(400);
				});

				// bind close overlay action
				$('.show_smk ', this).on("click", '.smk-layer-close', function ( evt ) {
					evt.preventDefault();
					$('.show_smk .smk-layer', self).fadeOut(100);
				});

				$('#smk-toolbox-container', this).on("click", '.smk-layer-close', function ( evt ) {
					evt.preventDefault();
					$('#smk-toolbox-container').fadeOut(100);
				});

				// bind toolbox action
				$( document ).on("click", ".smk-bookmark", function(evt){
					evt.preventDefault();
					$("#smk-toolbox-container").toggle(100);
				});

				// bind overlay link click to display smk buttons
				$(this).on("click", '.smk-setcookies', function ( evt ) {
					evt.preventDefault();
					$(this).parent().fadeOut(100, function() {
						var parent = $(this).parent();
						$(parent)
						.empty()
						.socialmedia("setCookies")
						.socialmedia("displayButtons");
						// update other plugin
						if(parent.hasClass("smk-toolbox-inner")) {
							if($(".show_smk").size() > 0) $(".show_smk").socialmedia("articlebar");
						} else {
							if($(".bookmark").size() > 0) $('.bookmark').socialmedia("toolbox", {smkList:['fbwithsend','google', 'twitter']});
						}
						// update Settings
						if( $("#smkSettings").size() > 0 && typeof($.fn.smkSettings) !== "undefined" ) {
							$("#smkSettings").smkSettings();
						}
						// update facebook widget
						if( typeof($.fn.smkFacebookWidget) !== "undefined" ) {
							if($("#recentActivity").size() > 0) $("#recentActivity").smkFacebookWidget();
						}
					});
					var position = $(this).parents("#smk-plug").size() > 0 ? "bottom" : "tools";
					if (defaults.debug) console.info("hp.article." + position + ".socialmedia.optin");
					ZEIT.clickWebtrekk("hp.article." + position + ".socialmedia.optin");
				});

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
		deleteCookies: function () {
			/**
			 * deletes for the permission cookies
			 * @return bool
			 */
			$.each(defaults.cookieList, function( key, value) {
				ZEIT.cookieErase( defaults.cookieSettings.cookiePrefix + '-' + value );
			});
			return ( ! $(this).socialmedia("checkCookies") );
		},
		displayButtons: function ( smkList ) {
			/**
			 * prints out the social media komponenten® buttons
			 * @returns void
			 */
			if(!smkList) var smkList = defaults.smkList;
			var container = $('<div class="smk-container"></div>').appendTo( this );
			$('<div class="smk-info">' +	defaults.textAnchor + '</div>').appendTo(container);
			$.map( smkList, function( name ) {
				$( container ).socialmedia( name );
			});
			$('<a class="smk-information" href="' + defaults.policyDisplay.informationLink + '">' + defaults.policyDisplay.informationText + '</a>').appendTo(container);
		},
		fb: function ( send ) {
			/**
			 * prints out a facebook like button
			 * @returns void
			 */
			//implement asynchronus loading

			if ( $('#fb-root').size() < 1 ) $('<div id="fb-root"></div>').appendTo("body");

			var withsend = send === true ? true : defaults.optionsFacebook.send;
			var layout = $(this).hasClass( defaults.nocountclass ) ? 'standard' : defaults.optionsFacebook.layout;
			var id = send ? 'facebook-jssdk-ws' : 'facebook-jssdk';

			var addButton	= '<div class="fb-like" '
							+ 'data-href="' + defaults.optionsFacebook.href + '" '
							+ 'data-send="' + withsend + '" '
							+ 'data-width="' + defaults.optionsFacebook.width + '" '
							+ 'data-show_faces="' + defaults.optionsFacebook.show_faces + '" '
							+ 'data-layout="' + defaults.optionsFacebook.layout + '" '
							+ 'data-action="' + defaults.optionsFacebook.action + '" '
							+ 'data-colorscheme="' + defaults.optionsFacebook.colorscheme + '" '
							+ 'data-ref="' + defaults.optionsFacebook.ref + '" '
							+ 'data-font="' + defaults.optionsFacebook.font + '">'
							+ '</div>';


			//append to DOM
			appendSmk.call(this, "fb", addButton, defaults.optionsFacebook.script);
		},
		fbwithsend: function () {
			/**
			 * prints out a facebook like button with integrated send button
			 * @returns void
			 */
			$(this).socialmedia("fb", true);
		},
		fbsend: function () {
			/**
			 * prints out a facebook send button
			 * @returns void
			 */
			//prepare send button
			if ( $('#fb-root').size() < 1 ) $('<div id="fb-root"></div>').appendTo("body");

			var addButton 	=	'<fb:send '
							+	'href="' + defaults.optionsFacebookSend.href + '" '
							+	'colorscheme="' + defaults.optionsFacebookSend.colorscheme + '" '
							+	'ref="' + defaults.optionsFacebookSend.ref + '" '
							+	'font="' + defaults.optionsFacebookSend.font + '">'
							+	'</fb:send>';

			//append to DOM
			appendSmk.call( this, "fbsend", addButton, defaults.optionsFacebook.script);

		},
		google: function () {
			/**
			 * prints out a google plus button
			 * @returns void
			 */
			//prepare script
			window.___gcfg = {lang:'" + defaults.optionsGoogle.lang + "', parsetags: 'onload'};

			var annotation = $(this).hasClass( defaults.nocountclass ) ? 'none' : defaults.optionsGoogle.annotation;

			//prepare button
			var addButton 	= 	'<div class="g-plusone" '
							+	'data-size="' + defaults.optionsGoogle.size + '" data-href="' + defaults.optionsGoogle.href + '"  data-count="true" data-annotation="' + annotation + '">'
							+	'</div>';

			//append to DOM
			appendSmk.call( this, "google", addButton, defaults.optionsGoogle.script);

		},
		setCookies: function () {
			/**
			 * sets the permission cookies
			 * @returns this
			 */
			return this.each( function(){
				$.each(defaults.cookieList, function( key, value) {
					ZEIT.cookieCreate( defaults.cookieSettings.cookiePrefix + '-' + value, true, defaults.cookieSettings.validFor, defaults.cookieSettings.domain );
				});
			});
		},
		showPolicy: function () {
			/**
			 * prints out the policy information
			 * @returns void
			 */
			$( buildFromTemplate(policyTemplate, defaults.policyDisplay) ).appendTo( this );
			$( buildFromTemplate(layerTemplate, defaults.overlay) ).hide().appendTo( this );
		},
		articlebar: function () {
			return this.each( function(){
				if( ! self.socialmedia("checkCookies") ) {
					$(this).empty();
					$(this).socialmedia("showPolicy");
				} else {
					$(this).empty();
					$(this).socialmedia("displayButtons");
				}
			});
		},
		studiVz: function ( options ) {
			return this.each( function() {
				$(this).bind("click", function(){
					var x = window.open(defaults.optionsStudiVz.url + '&url=' + defaults.optionsStudiVz.href);
				});
			});
		},
		toolbox: function ( options ) {
			/**
			 * prints out the buttons in the articletools
			 * @returns this
			*/
			var that = this;
			return this.each( function() {
				var tpl = '<div class="smk-toolbox" id="smk-toolbox-container"><div class="smk-toolbox-inner" id="smk-toolbox"></div></div>';
				$(tpl).hide().insertAfter(that);
				if( ! self.socialmedia("checkCookies") ) {
					$( buildFromTemplate(layerTemplate, defaults.overlay) ).appendTo("#smk-toolbox");
				} else {
					$("#smk-toolbox").socialmedia("displayButtons", options.smkList);
				}
			});
		},
		twitter: function () {
			/**
			 * prints out a twitter button
			 * @returns void
			*/

			var that = this;

			var count = $(this).hasClass( defaults.nocountclass ) ? 'none' : defaults.optionsTwitter.count;

			$(that).bind("buildTwitterButton", function( evt ) {
				var addButton 	= '<a href="https://twitter.com/share" class="twitter-share-button"'
								+ ' data-counturl="' + defaults.optionsTwitter.dataCountUrl
								+ '" data-url="' + defaults.optionsTwitter.dataUrl
								+ '" data-via="' + defaults.optionsTwitter.dataVia
								+ '" data-text="' + defaults.optionsTwitter.dataText.replace(/\"/gi,'&quot;')
								+ '" data-lang="' + defaults.optionsTwitter.lang
								+ '" data-count="' + count
								+ '">Tweet</a>';
				//append to DOM
				appendSmk.call( that, "twitter", addButton, defaults.optionsTwitter.script);
			});

			$(that).trigger("buildTwitterButton");

		}

	};

	$.fn.socialmedia = function( method ) {

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.socialmedia' );
		}

	};

})( jQuery );
