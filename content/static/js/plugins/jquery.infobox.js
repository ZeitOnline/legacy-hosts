(function ($) {
    
    /*
    * Zeit Online Infobox Plugin
    * unobstrusive infobox with tabbed content
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
    $.fn.infobox = function (options) {
    
        options = $.extend({}, options);
        
        //var that = this;
        
        $.fn.makeNav = function () {
            var node = this;
            var u = $("<ul>");
            $('dt', node).hide().each(function (i) {
                var li = $('<li>' + $(this).html() + '</li>');
                if(i === 0) {
                    $(li).addClass("current");
                }
                $(li).data('id', i)
                .hover(function () {
                    $(this).addClass('hover');
                }, function () {
                    $(this).removeClass('hover');
                })
                .click(function (evt) {
                    $(this).addClass('current').siblings().removeClass('current');
                    $('dd:visible', node).hide();
                    $('dd:eq(' + $(this).data('id') + ')', node).show();
                    ZEIT.clickIVW();
                    ZEIT.clickWebtrekk('infobox');
                })
                .appendTo(u);
            });
            $(node).prepend(u);
            $(node).fadeIn(200);
        };
        
        
        // return the plugin for further binding
        return this.each(function () {
            $('dd', this).css('borderTop', 'none');
            $('dd:gt(0)', this).hide();
            $(this).makeNav();
        });
    };
    
})(jQuery);