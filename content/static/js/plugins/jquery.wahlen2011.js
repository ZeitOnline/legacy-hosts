(function ($) {    
    /*
    * Zeit Online Wahlen 2012 Plugin
    * 
    * Copyright (c) 2009-2011 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Nico Bruenjes
    * @version 3.1
    * 
    * total sinnvoll, das mit der Jahreszahl im Datei- und Funktionsnamen
    * 
    */


	$.fn.wahlen2011 = function ( defaults ) {
		var preview = (window.location.href.indexOf("www.zeit") < 0) ? "http://zip6.zeit.de" : "http://www.zeit.de",
		options = $.extend({
			type: "desktop",
			desktop: {
				divId: "wahl2011_540",
				cssClass: "inlineframe",
				frameId: "wahl_2011_frame_desktop",
				frameSrc: "-540.html",
				height: 330,
				width: 540
			},
			tablet: {
				divId: "wahl2011_780",
				cssClass: "inlineframe",
				frameId: "wahl_2011_frame_ipad",
				frameSrc: "-740.html",
				height: 330,
				width: 740
			}
		}, defaults);
		
		var buildframe = function ( src  ) {
			var frametype = options.type;
			return '<div id="' + options[options.type].divId + '"><iframe class="' + options[options.type].cssClass + '" id="' + options[options.type].frameId + '" src="' + src + options[options.type].frameSrc + '" width="' + options[options.type].width + '" height="' + options[options.type].height + '" scrolling="no" frameborder="0"></iframe></div>';
		};
        
		return this.each (function () {
                var tickersrc = $(this).attr("data-source") !== undefined ? preview + $(this).attr("data-source") : "http://www.zeit.de/ticker/wahlen-2011/sachsen-anhalt";
			if(options.type == "desktop" || $(this).hasClass("article-module")) {
				$(this).replaceWith( buildframe( tickersrc  ) );
			} else {
				$(this).remove();
				$("li.lead").append( buildframe( tickersrc  ) );
			}
			
		});
		
    };
  
})(jQuery);
