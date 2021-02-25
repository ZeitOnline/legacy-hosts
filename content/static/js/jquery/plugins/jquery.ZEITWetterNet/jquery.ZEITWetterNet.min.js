(function ($) {

    $.fn.wetterNet = function (options) {
    
    
        var options = $.extend({
            town: '',
            href: 'http://zeit.wetternet.de/cgi-bin/zeit/wetter_stadt_zeit.pl',
            width: 460,
            height: 360,
            title: ""
        }, options);
        
        var that = this;
        
        return this.each(function () {
        
            
            $("input[type='text']", that).focus(function(){
                $(this).select();
            });
            
            $("li > strong", that).hover(function(){
                $(this).css({color:'#900', cursor: 'pointer'});
            }, function(){
                $(this).css({color:'#222', cursor: 'default'});
            }).click(function(evt){
                evt.preventDefault();
                var h = options.href + '?aoStadt=' + escape($(this).text());
				console.debug(h);
                $(this).colorbox({
                    href: h,
                    width: options.width,
                    height: options.height,
                    iframe: true, 
                    opacity: 0.9,
                    resize: false,
                    speed: 800, 
                    close : "Schliessen",
                    title: ""
                });
            });
            
            
            $('.weatherform', this).submit(function(evt){
                evt.preventDefault();
                var h = "";
                if($("input[name='aoStadt']", this).val() === unescape('%69%74%20%63%72%6F%77%64')) {
                    h = 'http://images.zeit.de/static/flash/zeit.titelfluss/titelfluss.swf?easteregg=true';
                    options.width = 570;
                    options.height = 407;
                    options.title = '';
                } else {
                    h = options.href + '?aoStadt=' + escape($("input[name='aoStadt']", this).val());
                    options.title = "";
                    options.width = 460;
                    options.height = 340;
                }
                
                $.fn.colorbox({
                    open: true,
                    href: h,
                    width: options.width,
                    height: options.height,
                    iframe: true, 
                    opacity: 0.9,
                    resize: false,
                    speed: 800, 
                    close : "Schliessen",
                    title: options.title
                }); 
            });
       
        });
        
    };

})(jQuery);