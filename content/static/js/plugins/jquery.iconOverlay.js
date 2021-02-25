(function($) {
    /*
    * Zeit Online Icon Overlay Plugin Plugin
    * This script puts a magnifier icon on pictures
    * 
    *  
    * Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Nico Brünjes
    *
    */
    $.fn.iconOverlay = function (options) {
        
        var options = $.extend({
            className: "overlayIcon"
        }, options);
        
        return this.each(function () {
            $("<img />").attr("src", 'http://images.zeit.de/static/img/thickbox.gif').addClass(options.className).addClass("oI" + $(this).css("float")).insertBefore(this);
        });
        
    };

    
})(jQuery);