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
    
        return this.each(function(){
			var h = $(this).attr("href"), title = $(this).attr('title');
			var q = h.split("?");
			q = ZEIT.getQuery("?" + q[1]);
            $(this).colorbox({
				href: h,
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