(function ($) {

    $.fn.commentnavigation = function (options) {
    
     	var options = $.extend({
			comperpage: 8,
			comstart: 0,
			ispos: 0,
			min: 2,
			url: "",
			to: ""
		}, options);
		
		// wenn wir sonst nix zu tun haben, schreiben wa mal 'ne rekursive Funktion
		checkTeiler = function(n) {
		    if(n % 5 === 0) {
				return n;
			} else {
				n++;
				return checkTeiler(n);
			}
		};
		
		// heroisch leiten wir aus Texten auf der Seite unsere Zahlen ab
		numberOfCommentPages = function() {
			var n = $('.numbers', that).text();
			options.comstart = n.substring(n.indexOf('Kommentarseite ')+15,n.lastIndexOf('/ '));
			n = n.substring(n.lastIndexOf('/ ')+2);
			return n;
		};
		
		// ach Du gute Guete
		buildDiv = function(n) {
			var diff = checkTeiler(n) - n;
			var d = '<div class="commentnavoverlay" id="commentnavoverlay"><div class="closethis">Zu den Kommentarseiten:</div>';
			for(var i=1; i <= n; i++) {
				var c = ((i-1) * options.comperpage) + 1;
				d += '<a href="' + options.url + '?commentstart=' + c + '#comments' + '"';
				if(i==options.comstart) d += ' class="isactualcomment"';
				d += '>' + i + '</a>';
			}
			for(var i=1;i<=diff;i++) {
				d+='<span class="empty">&nbsp;</span>';
			}
			d += '</div>';
			if($('#commentnavoverlay').size() < 1) $(d).hide().appendTo('body');
		};
		
		setLocation = function() {
			var l = window.location.href;
			if(window.location.search) {
				l = l.substring(0, l.lastIndexOf('?'));
			}
			options.url = l;
		};

        var that = this;
        
        return this.each(function () {
			setLocation();
			var number = numberOfCommentPages();
			var timeout = {};
			if(number > options.min) {
				// build the hidden div
				buildDiv(number);
				// eventinize
				$('.numbers', this).css("cursor", "pointer").mouseover(function(e) {
					var off = $(this).offset();
					var w = $(this).width();
					var x = off.left;
					var y = off.top;
					$('#commentnavoverlay').hide();
					var w = (x + w/2) - ($('#commentnavoverlay').width()/2);
					var h = y + 25;
					$('#commentnavoverlay').css({top: h, left: w}).show(200);
					$('#commentnavoverlay').mouseleave(function(e){
						e.preventDefault();
						$('#commentnavoverlay').hide(200);
					}).mouseenter(function(e){
						e.preventDefault();
					});
				});
			} else {
				return false;
			}
        });
        
    };

})(jQuery);