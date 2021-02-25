(function ($) {

    $.fn.eilmeldung = function (options) {
    
     	var options = $.extend({
			debug: false,
			blacklist: ['services.zeit.de', 'www.zeit.de', 'localhost'],
			src: 'http://json.zeit.de/eilmeldung/eilmeldung?callback=?'
		}, options);
		
		isOnBlacklist = function() {
			return $.inArray(true, jQuery.map(options.blacklist, function(n, i) {
				if(location.href.indexOf(n) > -1) { return true; }
			}));
		};

        var that = this;
        
        return this.each(function () {
			if(isOnBlacklist() < 0) {
				if(location.href.indexOf('zip6') > -1 || options.debug) {
					options.src = 'http://zip6.zeit.de/preview-json/eilmeldung/eilmeldung?callback=?';
				}
				$.getJSON(options.src, function(json) {
					if(json) {
						var article = json['article'];
						var head = {};
						if(article[0].head !== undefined) {
							$(article[0].head).each(function(i) {
								if($(article[0].head).get(i).attribute.ns == 'http://namespaces.zeit.de/CMS/workflow') {
									head[$(article[0].head).get(i).attribute.name] = $(article[0].head).get(i).attribute.value;
								}
							});
						}
						if(article[1]['body'][0].division !== undefined) {
							var mybody = article[1]['body'][0].division;
						}
						if(head !== undefined && mybody !== undefined) {
							if(head.published=="yes" || options.debug) {
								var t = head.date_last_published; // 2010-02-09T09:18:52.472128+00:00
								var diff = t.substring(t.lastIndexOf('+')+1, t.lastIndexOf(':')) == "00" ? 2 : 0;
								var h = t.substring(t.lastIndexOf("T")+1, t.lastIndexOf("."));
								var hrs = h.split(":");
								hrs[0] = parseFloat(hrs[0])+diff;
								var b = $(mybody).append('&nbsp;<span>|&nbsp;'+ hrs[0] + ':' + hrs[1] +'</span>');
								var em = $('<div class="newsflash clear"><div class="inner clear"><div class="flash">Eilmeldung</div><div class="msg">'+ $(b).html() +'</div></div></div>');
								if($('#header #place_3').size() > 0) {
									// vor dem Banner platzieren
									$(em).hide().insertBefore('#header #place_3').show(100);
								} else {
									// sonst am Ende
									$(em).hide().appendTo(that).show(100);
								}
							}
							
						}
					}
				});
			}
        });
        
    };

})(jQuery);