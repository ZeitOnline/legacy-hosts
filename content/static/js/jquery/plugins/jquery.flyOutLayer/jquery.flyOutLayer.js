(function($){
    $.fn.flyOutLayer = function(options) {
        var defaults = $.extend({
            offsetX: 0,
            offsetY: 0,
            opacity: 1,
            closeButton: 'img/bookmark_close.gif',
            layerCss: { zIndex: 2, display: 'none', width: '200px', position: 'absolute', background: 'transparent'},
            topCss: {height: '1px'},
            bottomCss: {height: '7px', width: '200px', background: 'transparent url(img/bookmarkpfeil.gif) no-repeat 50% 0', marginTop: '-2px'},
            middleCss: {color: '#333', padding: '5px', float: 'none', clear: 'both', textAlign: 'left', border: '1px solid #ccc', background: '#fff'}
        }, options);
        
        return this.each(function () {
            if ($('div',this).hasClass('flyOutLayer')) {
                // we already have an object
                if (typeof options == 'string') {
                    // extending layer with html
                    $(this).find('.flyOutLayer .mid').html(options);
                }
                $(this).find('.flyOutLayer').show();
                return false;
            }
            obj = $(this);
            var html = null;
            $('<div class="flyOutLayer"><div class="top"></div><div class="mid"></div><div class="bot"></div></div>').appendTo(obj);
            var $layer = $('.flyOutLayer', obj);
            $layer.find('.top').css(defaults.topCss);
            $layer.find('.bot').css(defaults.bottomCss);
            $layer.find('.mid').css(defaults.middleCss);
            var pos = obj.position();
            if (obj.css('position') != 'absolute') {
                x = pos.left;
                y = pos.top;
            }
            if (typeof options == 'string') {
                $layer.find('.mid').html(options);
            }
            if (html) {
                $layer.find('.mid').html(html);
            }
            $layer.css({
                opacity: defaults.opacity,
                position: 'absolute',
                left: x + defaults.offsetX + 'px',
                top: y + defaults.offsetY + 'px'
            }).css(defaults.layerCss);
            if (defaults.closeButton) {
                $('.top', $layer).append('<div style="position:absolute;top:5px;right:5px"><img src="' + defaults.closeButton + '"></div>');
                //$(this).css("cursor", "default");
                $('.top img', $layer).click(function () {
                   $layer.fadeOut()
                });
            } else {
                $layer.click(function () {
                    $(this).fadeOut()}
                );
            }
            if (defaults.show || typeof options == 'string') $layer.show();
        });
    };
   
    $.fn.web2but = function (options) {
       var options = $.extend({
           service: '',
           url: ''
       }, options);
       return this.each(function() {
           switch(options.service) {
               case 'twitter':
                   options.url = 'http://twitter.com/home/?status=' + encodeURIComponent(document.referrer) + ' ' + encodeURIComponent(document.title);
               break;
               case 'facebook':
                   options.url = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(document.referrer) + '&amp;title=' + encodeURIComponent(document.title) + '&amp;desc=';
               break;
               case 'mrwong':
                   options.url = 'http://www.mister-wong.de/index.php?action=addurl&amp;bm_url=' + encodeURIComponent(document.referrer) + '&amp;bm_description=' + encodeURIComponent(document.title);
               break;
               case 'delicious':
                   options.url = 'http://del.icio.us/post?url=' + encodeURIComponent(document.referrer) + '&amp;title=' + encodeURIComponent(document.title);
               break;
           };
           if(options.url !== '') {
               window.open(options.url);
               $('.aqLayer').fadeOut();
           }
       });
    };
})(jQuery);