(function ($) {    
    /*
    * Zeit Online Ticker Plugin
    * 
    * Copyright (c) 2009-2011 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Nico Bruenjes
    * @version 1.0
    * 
    * 
    * 
    */



	$.fn.ticker = function ( defaults ) {
		
		var win = window, __ispreview = win.location.href.indexOf('zip6') > -1, $node = $('#dpa_app_appender'), __is_iphone = navigator.userAgent.match(/iPhone/i) !== null;
		var options = $.extend({
			url: "http://www.zeit.de/fb_fwm/",
			usrType: win.is_iPad ? "pad" : "phone",
			ticker: "ffwm"
		}, defaults);
        
		return this.each (function () {
			if( options.ticker == "ffwm" ) {
				$.getScript(options.url + "zeit/js/click.js");
				win.competition = options.ticker;
				$.getScript(options.url + win.competition + '/js/jquery.tmpl.min.js');
				$.getScript(options.url + win.competition + '/js/jquery.address-1.4.min.js');
				win.htmlvars = {};
				win.htmlvars.competitionId	= "fb_fwm";		
				win.htmlvars.source 		= "dpa";
				win.htmlvars.seasonId		= "s2011";	
				win.htmlvars.language 		= "de";
				win.htmlvars.pathSrc		= options.url + win.competition + "/src/"
				win.htmlvars.pathFeed		= options.url + win.competition + "/feed/"
				win.htmlvars.pathCSS		= options.url + "zeit/feed/";
				win.htmlvars.pathImage		= options.url + win.competition + "/images/";
				win.htmlvars.pathConfig		= win.htmlvars.pathFeed+win.htmlvars.seasonId+"/config/"+win.htmlvars.language+"/dpa/";
				win.htmlvars.updateTime		= "30";
				$.getScript(htmlvars.pathSrc+"Main.js?"+new Date().getTime());
				Sid.css(htmlvars.pathCSS+"general_html.css?"+new Date().getTime())
				if(__is_iphone) {
					Sid.css(htmlvars.pathCSS+"general_html_"+ options.usrType +".css?"+new Date().getTime());
				}
			} else if (options.ticker == "bb_mem") {
				
				$.getScript(options.url + "js/click.js");
				win.competition = options.ticker;
				$.getScript(options.url + 'js/jquery.min.js');				
				win.htmlvars 				= {};
				win.htmlvars.source 		= "dpa";
				win.htmlvars.competitionId	= options.ticker;
				win.htmlvars.seasonId		= "s2011";
				win.htmlvars.language 		= "de";
				win.htmlvars.pathSrc		= options.url + options.ticker + "/src/";
				win.htmlvars.pathFeed		= options.url + options.ticker + "/feed/";
				win.htmlvars.pathCSS		= options.url + "feed/";
				win.htmlvars.pathImage		= options.url + options.ticker + "/images/";
				win.htmlvars.pathConfig		= htmlvars.pathFeed+htmlvars.seasonId+"/config/"+htmlvars.language+"/dpa/";
				win.htmlvars.updateTime		= "30";
				
				$.getScript(htmlvars.pathSrc+"Main.js?"+new Date().getTime());
				Sid.css(htmlvars.pathFeed+htmlvars.seasonId+"/css/general_htmlAdmin.css?"+new Date().getTime());
				Sid.css(htmlvars.pathCSS+"general_html.css?"+new Date().getTime());
				if(__is_iphone) {
					Sid.css(htmlvars.pathCSS+"general_html_"+ options.usrType +".css?"+new Date().getTime());
				}
				
			} else {
				return this;
			}
		});
		
    };
  
})(jQuery);