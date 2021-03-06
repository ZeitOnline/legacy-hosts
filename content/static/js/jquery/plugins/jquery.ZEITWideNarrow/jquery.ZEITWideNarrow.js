(function ($) {
    var switchwidth = 1150;
    $.fn.wideNarrow = function () {
        return this.each(function () {
            var w = $(this).width();
            if(w == 0) {
                if($.cookie("zeitstyle")) {
                    $("link").setStyles($.cookie("zeitstyle"));
                }
            } else if (w < switchwidth) {
                $('#informatives').switcher("narrow");
            } else {
                $('#informatives').switcher("wide");
            }
        });
   	};
   	$.fn.switcher = function (task) {
   	    return this.each(function () {
   	        $("link").setStyles(task); // switch stylesheets
   	        $.cookie("zeitstyle", task, { expires: 365, path: '/', domain: 'zeit.de' }); // set cookie
   	        var changeme = "";
   	        if($('.tools', this).size() > 0) {
   	            changeme = $('ul.tools').children().add($('ul.teaserlist li:lt(2)'));
   	        } else {
   	            changeme = $(this).children().children(':lt(2)');
   	        }
   	        changeme.each(function (i) {
   	            if(task=="narrow") {
   	                $(this).addClass("narrowed");
   	            } else {
   	                $(this).removeClass("narrowed");
   	            }
   	        });
   	    });
   	};
   	$.fn.setStyles = function (title) {
   	    return this.each(function(){
   	        if($(this).attr("title") != '') {
	            this.disabled = true;
	            if($(this).attr("title") == title) {
	                this.disabled = false;
	            }
	        }
   	    });
   	};
})(jQuery);