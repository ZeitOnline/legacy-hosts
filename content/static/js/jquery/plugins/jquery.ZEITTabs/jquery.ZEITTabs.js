(function ($) {

    /*
    * Zeit Online Tabs Plugin
    * displaying information in tabs
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
    $.fn.ZEITTabs = function (options) {
    
        options = $.extend({
            active: "mostread"
        }, options);
    
        
        return this.each(function () {
            var that = $(this);
            $('ul li a', that).click( function (e) {
                e.preventDefault();
            }).focus(function() {
                $(this).blur();
            });
            if($('ul li.active', that).size() < 1) {
                $('ul li.'+ options.active, that).addClass('active');
            }
            $('ol:not(.' + options.active + ')', that).hide();
            $('ul li', that).hover( function () {
                $(this).addClass('hoverTab');
            }, function () {
                $(this).removeClass('hoverTab');
            });
            $('ul li', that).click(function () {
                if(!($(this).hasClass('active'))) {
                    $(this).parent().children('.active').removeClass('active');
                    var cln = $(this).removeClass('hoverTab').attr('className');
                    $('ol', that).hide();
                    console.debug($('ol.' + cln, that), cln);
                    $('ol.' + cln, that).show();
                    $('ul li.' + cln).addClass('active');
                }
                ZEIT.clickIVW();
                ZEIT.clickWebtrekk('tabs');
            });
        });
    };


})(jQuery);