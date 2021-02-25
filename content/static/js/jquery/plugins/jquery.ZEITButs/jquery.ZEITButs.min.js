(function($){

    $.fn.ZEITButs = function (options) {
        
		var kw = ($("meta[name='keywords']").size() > 0) ? $("meta[name='keywords']").attr('content').replace(/\,/g,'') : 'ZEIT ONLINE';
		
		var myurl = window.location.href;
		var mysearch = window.location.search;
		var myuri = myurl.replace(mysearch, '');
		var mytitle = document.title;
		if(mytitle.indexOf(' – Seite') > -1) {
			mytitle = mytitle.substr(0, mytitle.indexOf(' – Seite')) + mytitle.substr(mytitle.indexOf(" | "));
		}
		var mydesc = $("meta[name='description']").attr('content');
		if(mydesc.indexOf('des Artikels:') > -1) {
			mydesc = mydesc.split('des Artikels: ')[1];
		}

        var options = $.extend({
            services: {
                twitter: {
                    url: 'http://twitter.com/home/?status='+encodeURIComponent(myuri)+' '+encodeURIComponent(mytitle),
                    icon: 'http://images.zeit.de/bilder/logos/sb-images/twitter_sbm.gif',
                    text: 'Artikel twittern',
                    name: 'Twitter'
                },
                facebook: {
                    url: 'http://www.facebook.com/sharer.php?u='+encodeURIComponent(myuri)+'&amp;t='+encodeURIComponent(mytitle)+'&amp;desc=',
                    icon: 'http://images.zeit.de/bilder/logos/sb-images/facebook_sbm.gif',
                    text: 'Artikel in Facebook aufnehmen',
                    name: 'Facebook'
                },                
                buzz: {
					url:'http://www.google.com/reader/link?url='+encodeURIComponent(myuri)+'&amp;title='+encodeURIComponent(mytitle)+'&amp;snippet='+encodeURIComponent(mydesc)+'&amp;srcURL='+encodeURIComponent('http://www.zeit.de')+'&amp;srcTitle='+encodeURIComponent('ZEIT ONLINE'),
					icon: 'http://images.zeit.de/bilder/logos/sb-images/googlebuzz_sbm.gif',
					text: 'Artikel buzzen',
					name: 'Buzz'
				},
                delicious: {
                    url: 'http://del.icio.us/save?v=5&amp;noui&amp;jump=yes&amp;url='+encodeURIComponent(myuri)+'&amp;title='+encodeURIComponent(mytitle)+'&amp;notes='+encodeURIComponent(mydesc)+'&amp;tags='+encodeURIComponent(kw),
                    icon: 'http://images.zeit.de/bilder/logos/sb-images/delicious20x20.jpg',
                    text: 'Artikel in del.icio.us ablegen',
                    name: 'Delicious'
                },
                studivz: {
                    url: 'http://www.studivz.net/Suggest/Selection/?u=' + encodeURIComponent(myuri) + '&amp;desc=' + encodeURIComponent(mytitle) + '&amp;prov=ZEIT%20ONLINE',
                    icon: 'http://images.zeit.de/static/img/studiVZ.gif',
                    text: 'Artikel bei StudiVZ Freunden empfehlen',
                    name: 'StudiVZ'
                },
				mrwong: {
                    url: 'http://www.mister-wong.de/index.php?action=addurl&amp;bm_url='+encodeURIComponent(myuri)+'&bm_description='+encodeURIComponent(mytitle+', '+mydesc),
                    icon: 'http://images.zeit.de/bilder/logos/sb-images/mister-wong20x20.jpg',
                    text: 'Artikel in Mister Wong ablegen',
                    name: 'Mr. Wong'
                }
            },
            prefix: '<li><div>',
            suffix: '</div><a href="#" id="bm_close">Schließen</a></li>',
            cssClass: 'bookmarkservice',
            title: 'Diesen Artikel bookmarken bei:',
            parenttype: 'li'
        }, options);
        
        buildContainer = function () {
            var main = '';
            var count = 0;
            if(options.title !== "") {
                main += '<p>' + options.title + '</p>';
            }
            for (var key in options.services) {
                main += '<a id="bm_' + key + '" href="' + options.services[key].url + '" title="' + options.services[key].text + '"><img src="' + options.services[key].icon + '" alt="" width="20" height="20" />&nbsp;' + options.services[key].name + '</a>';
            }
            return $(options.prefix + main + options.suffix);
        };
        
        
        return this.each(function () {
            
            var parent = $(this).parents(options.parenttype);
            
            if(parent.size() > 0) {
                var container = buildContainer();
                container.hide().addClass(options.cssClass).insertAfter(parent);
                
                $('.' + options.cssClass + ' a').live('click', function (evt) {
                    evt.preventDefault();
                    if($(this).attr('id') == "bm_close") {
                        $('.'+options.cssClass).slideToggle(300);
                    } else {
                        $('.'+options.cssClass).slideToggle(200);
						var w = "";
						if($(this).attr("id")=="bm_buzz") {
							w = "width=520,height=440";
						}
						window.open($(this).attr('href'), "Bookmarker", w);
                    }
                }); 
            }
            
            $(this).click(function (evt) {
                evt.preventDefault();
                $('.'+options.cssClass).slideToggle(400);
                ZEIT.clickIVW();
                ZEIT.clickWebtrekk('bookmark');
            });
            
        });
        
    };

})(jQuery);

/*
TODO: Plugin kann nicht mehrmals aufgerufen werden! 
*/