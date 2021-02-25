(function ($) {
	
	/*
    * Zeit Online Stylesheet Switcher Plugin
    * switching page width in dependence of browser window width
    * 
    * Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    * @author Nico Bruenjes
    * @version 1.2
    *
    */
    $.fn.ZEITPageWidth = function (options) {
		
		var options = $.extend({
			switchwidth: 1150,
			off: false
		}, options);
		
		var switchStyle = function(styleName) {
			$('link[rel*=style][title]').each(function(i) {
				this.disabled = true;
				if (this.getAttribute('title') == styleName) {
					this.disabled = false;
					ZEIT.cookieCreate('zeitstyle',styleName,365);
				}
			});
			if(isSafariOnTiger()) {
				$('#bottom').hide().show();
			}
			if(document.getElementById('wrapper').style.maxHeight == undefined) { // only IE6
				var changeme = "";
	   	        if($('#informatives .tools').size() > 0) {
	   	            changeme = $('ul.tools').children().add($('ul.teaserlist li:lt(2)'));
	   	        } else {
	   	            changeme = $('#informatives').children().children(':lt(2)');
	   	        }
	   	        changeme.each(function (i) {
	   	            if(styleName=="narrow") {
	   	                $(this).addClass("narrowed");
	   	            } else {
	   	                $(this).removeClass("narrowed");
	   	            }
	   	        });
			}
			
			if($('body.body-angebote #informatives .rsslist').size() > 0) { // SVOE
				$('body.body-angebote #informatives .rsslist').each( function() {
					if(styleName=="narrow") {
	   	                $(this).addClass("narrowed");
	   	            } else {
	   	                $(this).removeClass("narrowed");
	   	            }
				});
			}
		};
		
		var isSafariOnTiger = function () {
			var browser = navigator.userAgent.toLowerCase();
			if(browser.search(/10_4/gi) > -1 && browser.search(/Safari/gi) > -1) {
				return true;
			}
			return false;
		};
		
		/* deprecated */
		var areThereAds = function() {
			/*
			* TODO: Prüfroutine in Absprache mit IQM
			*/
			if(window.location.href.search(/blog\.zeit\.de/) > -1 && $('#wrapper #informatives').size() > 0) {
				if($('#wrapper #informatives').css("display") == 'none') return false;
			}
			return true;
		};
		
		var isExpandable = function() {
			if($('body').hasClass("fullwidth")) {
				return false;
			}
			if(options.off && $('.body-homepage').size() > 0) return false;
			return true;
		};
		
		return this.each(function () {
			if (isExpandable()  && $('#content').size() > 0) { // switch only if skyscraper or wallpaper is present and if #content is there
				var windowwidth = 0; 
				windowwidth = $(this).width(); // reading width
				if(windowwidth === 0) {
					// windowwidth not found: fallback to cookie
	                if(ZEIT.cookieRead("zeitstyle") !==  null) {
	                    $(this).switchStyle(ZEIT.cookieRead("zeitstyle"));
	                }
	            } else if (windowwidth < options.switchwidth) {
	                switchStyle('narrow');
	            } else {
	                switchStyle('wide');
	            }
			}
		});
		
	};
	
})(jQuery);