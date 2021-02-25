(function ($) {    
    /*
    * Zeit Online Gallery Plugin
    * unobstrusive image gallery with ajax loading pictures
    * 
    * Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Nico Bruenjes
    * @version 2.1
    * 
    */
    $.fn.ZEITGallery = function (options) {
        
        var options = $.extend({
            src: 'http://images.zeit.de',
            json: 'json.zeit.de',
			jsonpreview: 'zip6.zeit.de/preview-json',
            forwardtitle: "Ein Bild vor",
            inline: false,
            imagenumber: 0,
            max: 0,
            mode: '',
			preview: 'http://zip6.zeit.de:9000/cms/work',
			referrer: '',
			blocked: []
        }, options);
        
        var that = $(this);
        
        var jsonsource = function () {
            var me = "";
            // getting the url
			if(!options.inline) {
				// big gallery: json-url comes from location
                var me = document.location.href; /* http://www.zeit.de/online/xyz/abc */
				var hashbang = me.search("#");
				if(hashbang > -1) {
					me = me.substring(0, hashbang);
				}
            } else {
				// inline gallery: json-url comes from link
                me = $("a img", that).parent().attr('href');
            }
			
			// mapping to json-url
			// if previewing on zip6
			if (me.search(/zip6\.zeit\.de/) > -1) {
            	me = me.replace(/zip6\.zeit\.de\/{0,1}[^\/]+/g, options.jsonpreview);
				console.info("ZIP6", me);
                return me.indexOf('?') > -1 ? me.substring(0, me.indexOf('?')) + '?callback=?' : me + '?callback=?';
            }
			// or www.zeit.de
			else if (me.search(/www\.zeit\.de/) > -1) {
            	me = me.replace('www.zeit.de', options.json);
                console.info("zeit.de", me);
				return me.indexOf('?') > -1 ? me + '&callback=?' : me + '?callback=?';
            }
			// or zeit.de
			else if(me.search(/zeit\.de/) > -1) {
                me = me.replace('zeit.de', options.json);
                console.info("zeit.de", me);
				return me.indexOf('?') > -1 ? me + '&callback=?' : me + '?callback=?';
            }

        };
        
        // get the path for showing images
        var getImagePath = function (path) {
			var me = document.location.href;
			if (me.search(/zip6\.zeit\.de/) > -1) {
				return path.replace('http://xml.zeit.de', options.preview);
			} else {
				return path.replace('http://xml.zeit.de', options.src);
			}
        };

		// redirect to endpage
		var endpage = function() {
			var u = "http://"+window.location.host+window.location.pathname;
			window.location.href = u + "?endbiga=end";
		};
        
        // previous pic
		var previous = function (e) {
			if(options.imagenumber - 1 >= 0) {
				options.imagenumber--;
				showImage();
			} else if(options.mode=='bgSlider') {
				options.imagenumber = options.pics.length-1;
				showImage();
			} else {
				endpage();
			}
        };
        
        // next pic
        var next = function (e) {
			if(options.imagenumber + 1 < options.pics.length) {
				options.imagenumber++;
				showImage();
			} else if(options.mode=='bgSlider') {
				options.imagenumber = 0;
				showImage();
			} else {
				endpage();
			}
        };
        
        var makeObjectArray = function(json) {
            var a = [];
            $(json.blocks).each(function (i, item) {
                var p = {};
                $(item).each(function () {
                    if(this.name) p.name = this.name;
                    if(this.title) p.title = this.title;
                    if(this.text) p.text = $(this.text);
                    if(this.caption) p.caption = this.caption;
                    if(this.image) {
						p.bu = this.image.bu ? this.image.bu : "";
						p.path = this.image.path;
						if(typeof this.image.copyright !== "undefined") {
							if(typeof this.image.copyright === "string") {
								p.copyright = {text: this.image.copyright, link: ""};
							} else {
	                        	p.copyright = {text: this.image.copyright.value || "" , link: this.image.copyright.link || ""};
							}
	                    } else {
							p.copyright = {text: "", link: ""};
						}
					}
                });
                a.push(p);
            });
            return(a);
        };
        
        // preloading images
        var preload = function () {
            $(options.pics).each(function (i, item) {
                $('<img />').attr('src', getImagePath(item.path));
            });
            initialImage();
        };
        
        var getQuery = function(query) {
			if(query!=='') {
				var parms = query.split('&');
				return splitQuery(parms, "=");
			}
			return false;
		};
		
		var getRessorts = function() {
			// $('meta[name=zeit::ressort]').attr('content') $('meta[name=zeit::sub_ressort]').attr('content')
			var ret = {ressort: false, subressort: false};
			if($('meta[name=zeit::ressort]').attr('content') != undefined) {
				ret.ressort = $('meta[name=zeit::ressort]').attr('content');
			}
			if($('meta[name=zeit::subressort]').attr('content') != undefined) {
				ret.subressort = $('meta[name=zeit::subressort]').attr('content');
			}
			return ret;
		};
		
		splitQuery = function(parms, splitchar) {
			var qsParm = {};
			for (var i=0; i<parms.length; i++) {
				var pos = parms[i].indexOf(splitchar);
				if (pos > 0) {
					var key = parms[i].substring(0,pos);
					var val = parms[i].substring(pos+1);
					qsParm[key] = val;
				}
			}
			return qsParm;
		};
        
        // the right width for the old pictures
        var makeWide = function () {
            if($("#gal_image").width() > 540) {
                $("#gal_text").addClass('clipping');
				console.info("Clipped: ", $("#gal_image").width());
            } else {
                $("#gal_text").removeClass('clipping');
            }
        };
        
        // set initial image
        var initialImage = function () {
            var q = getQuery(window.location.search.substring(1));
            if(q.page > 0 && !options.inline) {
                options.imagenumber = q.page-1;
            }
            showImage(true);
        };
        
        // changes to the actual image
		var showImage = function (notcount) {
		    $('img', $this).fadeTo(30, 1, function() {
    	        if(options.pics[options.imagenumber].title) {
    	            $("#gal_title").html(options.pics[options.imagenumber].title);
    	        } else {
    	            $("#gal_title").html("&#160;");
    	        }
                $("#gal_image").attr("src", getImagePath(options.pics[options.imagenumber].path)).one('load', function(e){
					if(!options.inline) makeWide();
				});
                $("#gal_text").html('');
                if(options.pics[options.imagenumber].text || options.pics[options.imagenumber].caption || options.pics[options.imagenumber].bu) {
                    if(options.pics[options.imagenumber].text!== undefined && options.pics[options.imagenumber].text.text()!=='') {
						$("#gal_text").html(options.pics[options.imagenumber].text);
						
					}
                    if(options.pics[options.imagenumber].caption) $("#gal_text").append('<p>' + options.pics[options.imagenumber].caption + '</p>');
					if(options.pics[options.imagenumber].bu && !options.pics[options.imagenumber].caption) $("#gal_text").append('<p>' + options.pics[options.imagenumber].bu + '</p>');
                } else {
                    $("#gal_text").html('<p>&nbsp;</p>');
                }
				$('#gal_text p a').attr('target','_blank');
                var copyright = "";
                if(options.pics[options.imagenumber].copyright.text.length > 1) {
                    if(options.pics[options.imagenumber].copyright.link.length > 0) {
                        copyright = '<a href="' + options.pics[options.imagenumber].copyright.link + '">' + options.pics[options.imagenumber].copyright.text +'</a>';
                    } else {
                        copyright = options.pics[options.imagenumber].copyright.text;
                    }
                }
                $("#gal_copyright").html(copyright);
                $("#x_of_y").html((options.imagenumber + 1) + " von " + options.pics.length);
                $('img', $this).fadeTo(200, 1);
                if(!notcount) {
                    ZEIT.clickWebtrekk(options.mode);
                    ZEIT.clickIVW();
                }
		    });
        };
        
        return this.each(function () {
			$this = $(this);
            var source = jsonsource();
            if(!options.inline) {
                options.mode = 'biga';
				var ressorts = getRessorts();
				
				if(document.referrer.search(/zeit\.de/) != -1 ) {
					if(window.location.hash.substring(1) !== '') {
						options.referrer = decodeURIComponent(window.location.hash.substring(1));
					} else {
						options.referrer = document.referrer;
					}
					$('.back2article').show().children("a").attr("href", options.referrer).click(function (evt) {
						evt.preventDefault();
						window.location.href = options.referrer;
					});
				} else {
					$('.back2article a').parent().hide();
				}
				
                $.getJSON(source, function(json) {
                    if(json) {
                        // add events to the buttons
						if(window.location.search != "?endbiga=end") {
                        	$("a#rwd").click(function (e) {
								if($.inArray(ressorts['ressort'].toLowerCase(),options.blocked) == -1) {
	                            	e.preventDefault();
	                            	previous(e);
								} else {
									if(options.referrer !== '') {
										$(this).attr('href', $(this).attr('href') + '#' + encodeURIComponent(options.referrer));
									}
								}
	                        });
	                        $("a#fwd, #gal_image").click(function (e) {
								if($.inArray(ressorts['ressort'].toLowerCase(),options.blocked) == -1) {
	                            	e.preventDefault();
		                            next(e);
								} else {
									if(options.referrer !== '') {
										$(this).attr('href', $(this).attr('href') + '#' + encodeURIComponent(options.referrer));
									}
								}
	                        });
	                        $("#gal_image").hover(function () {
	                            $(this).attr("title", options.forwardtitle).css('cursor', "pointer");
	                        }, function () {
	                            $(this).css('cursor', "default");
	                        });
						}
                        options.pics = makeObjectArray(json);
                        if($.inArray(ressorts['ressort'].toLowerCase(),options.blocked) == -1) preload();
                    }
                });
            } else {
                options.mode = 'bgSlider';
                $.getJSON(source, function(json) {
                    if(json) {
                        $('#gal_text').before('<p><strong>Bild <span id="x_of_y">1 von 5</span></strong> | </p>');
                        $("a[target=_blank]", $this).attr("title", options.forwardtitle).children('img').attr("id", "gal_image");
                        $("a#rwd").click(function (e) {
                            e.preventDefault();
                            previous(e);
                        });
                        $("a#fwd").add("#inlinebiga a[target=_blank]").click(function (e) {
                            e.preventDefault(); 
                            next(e);
                        });
						if($("#gal_copyright").size() > 0) {
							if($("#gal_copyright").text() !== "") {
								if($('#bildrechte').size() > 0) {
									$('<li>'+$("#gal_copyright").text()+'</li>').prependTo('#bildrechte ol');
								}
							}
						}
                        options.pics = makeObjectArray(json);
                        preload();
                    }
                });
            }
        });
    };
    
})(jQuery);