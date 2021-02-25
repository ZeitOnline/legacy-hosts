/*
* Colorbox Popup Plugin
* Delivers an url-configurable Version of Colorbox
* 
* Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*
* @author Nico Bruenjes
*
*/
(function ($) {
    $.fn.colorpopup = function () {
        
        // Querystring teilen
        splitQuery = function (parms, splitchar) {
			var qsParm = {};
			for (var i = 0; i < parms.length; i++) {
				var pos = parms[i].indexOf(splitchar);
				if (pos > 0) {
					var key = parms[i].substring(0, pos);
					var val = parms[i].substring(pos + 1);
					qsParm[key] = val;
				}
			}
			return qsParm;
		};
    
        // einen Querystring auslesen
        getQuery = function (query) {
			if (query !== '') {
				var parms = query.split('&');
				return this.splitQuery(parms, "=");
			}
			return false;
		};
    
        return this.each(function(){
            var q = getQuery($(this).attr("href"));
            var title = $(this).attr('title');
            $(this).colorbox({
                iframe: true,
                width: q.width,
                height: q.height,
                opacity: 0.9,
                initialWidth: 10,
                initialHeight: 10,
                speed: 800,
                close : "Schliessen",
                title: title
            }).css({paddingRight: "25px", background: "transparent url(img/thickbox.gif) no-repeat 100% 50%"});
        });
    };
})(jQuery);