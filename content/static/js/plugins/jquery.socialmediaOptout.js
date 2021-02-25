(function($) {
	
	var defaults, self;
	var loc = window.location;
	
	var getCookieValue = function (cookieName) {	
		return ZEIT.cookieRead(cookieName);				 
	};
	
	var settings = {
		debug: ZEIT.getQueryVar('smdebug') || false,
		cookieList: ['fb', 'twitter', 'google'],
		cookieSettings: { 
			cookiePrefix: 'zon-smk-optIn',
			domain: 'zeit.de',
			validFor: 365
		},
		snippet: '<div>Social-Media Dienste <span>%active</span></div>'
	};
	
	var methods = { 
		
		init: function( options ) {
	
			self = this;
			defaults = $.extend(settings, options);
			
			return this.each( function() {
				
				if (defaults.debug) {
					console.info("debugging mode enabled, hello @ll");
				}
				
				$('ul.tools').hide();
				
				
				$(this).bind("click", function( evt ){
					evt.preventDefault();
					var action = "optout";
					if( $(this).hasClass("SMKdeactivate") ) {
						$(this).smkSettings("deleteCookies");
					} else {
						action = "optin";
						$(this).smkSettings("setCookies")
					}
					if (defaults.debug) console.info("hp.article.datenschutz.socialmedia." + action);
					ZEIT.clickWebtrekk("hp.article.datenschutz.socialmedia." + action);
					document.location.reload();
				});
		
				if(  $(this).smkSettings("checkCookies") ) {
					
					$(this).empty().addClass('SMKdeactivate').append( $( defaults.snippet.replace('%active', 'deaktivieren') ));
					
				} else {
					
					$(this).empty().addClass('SMKactivate').append( $( defaults.snippet.replace('%active', 'aktivieren') ));
				}
				
				
			});
			// end of init
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
			return ( $(this).smkSettings("checkCookies") );
		},
		deleteCookies: function () {
			/**
			 * deletes for the permission cookies
			 * @return bool
			 */
			$.each(defaults.cookieList, function( key, value) {
				ZEIT.cookieErase( defaults.cookieSettings.cookiePrefix + '-' + value );
			});
			return ( ! $(this).smkSettings("checkCookies") );
		}	
	};
	
	$.fn.smkSettings = function( method ) {

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