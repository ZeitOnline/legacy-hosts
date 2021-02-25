(function ($) {

// intern adding "touch-support" for non-touch browsers
var __evs = {
	touchstart: (is_touchable) ? "touchstart" : "click",
	touchend: "touchend",
	touchcancel: "touchcancel",
	click: (is_touchable) ? "touchstart" : "click"
};


$.fn.tabletNav = function ( options ) {
	
	var def = $.extend( {
		menues: ["ressorts","magazine","service","angebote"],
		path: window.zipserver == 'zip6' ? "http://zip6.zeit.de/vruenjes" : "http://www.zeit.de",
		wall_id: "tbl_wallpaper"
	}, options );	
	
	var wallpaper = function () {
		// append the wallpaper to #wrapper
		$('<div id="' + def.wall_id + '">&nbsp;</div>')
		.hide()
		.appendTo( that )
		.css({
			height: $( that ).height(), 
			width: $( that ).width()
		}).bind( __evs.touchstart, function ( e ) {
			e.preventDefault();
			$( this ).trigger( "hidemenues" );
		});
	};
	
	var buildnavi = function () {
		var htm = '<ul class="toplevel">';
		$.each(window.$navi, function( i, n ) {
			if($.inArray(n.name.toLowerCase(), def.menues) > -1) {
				htm += '<li class="'+n.name.toLowerCase()+'"><a href="#">'+n.name+'</a>';
				if(n.items) {
					htm += "<ul>";
					$.each(n.items, function(j, m){
						htm += "<li>";
						if(m.items) {
							htm += '<a class="groupleader" href="' + ( m.href.charAt(0)=="/" ? def.path+m.href : m.href ) +'">'+m.name+'</a><span class="arrow" href="#">&gt;</span>';
							htm += '<ul class="subclass">';
							$.each(m.items, function(k, l){
								htm += '<li><a class="singlelink" href="'+( l.href.charAt(0)=="/" ? def.path+l.href : l.href )+'">'+l.name+'</a></li>';
							});
							htm += '</ul>';
						} else {
							htm += '<a class="leader" href="' + ( m.href.charAt(0)=="/" ? def.path+m.href : m.href ) +'">'+m.name+'</a>';
						}
						htm += "</li>";
					});
					htm += "</ul>";
				}
				htm += '</li>';
			} /* inArray */
		});
		htm += "</ul>";
		return(htm);
	};
	
	var applyEvents = function() {
		$( 'body' ).bind( 'hidediv', function( e ) {
			$( "#" + def.wall_id ).hide();
		}).bind( 'hidemenues', function( e ){
			$( 'ul.toplevel > li > ul:visible' ).hide().trigger( 'hidediv' );
			$( '.toplevel a.active' ).removeClass( 'active' );
			$( '.toplevel .activated').removeClass( 'activated' );
		}).bind( "orientationchange", function() {
			$( this ).trigger( 'hidemenues' );
			$.colorbox.close();
		}).bind( "showmenu", function ( e ) {
			var target = e.target;
			if( $( target ).hasClass( 'active' ) ) {
				$( target ).removeClass( 'active' ).trigger( 'hidediv' ).next( 'ul' ).hide();
			} else {
				$( target ).trigger( 'hidemenues' );
				if( $( target ).parent().parent().offset().top > 500 ) {
					$( "#" + def.wall_id ).css( { top: ( $( ".footernav" ).offset().top - $( "#" + def.wall_id ).height() ) });
				} else {
					$( "#" + def.wall_id ).css( { top: $(" #top ").height() + 48 } );
				}
				$( "#" + def.wall_id ).show();
				$( target ).addClass( 'active' ).next( 'ul' ).show();
			}
		});
		
		// on touch on dark div, hide menues
		$( "#" + def.wall_id ).live( __evs.touchstart , function( e ) {
			e.preventDefault();
			$( this ).trigger( 'hidemenues' );
		});
		
		$( 'ul.toplevel > li > a').live(__evs.touchstart, function( e ) {
			e.preventDefault();
			$( this ).trigger( 'showmenu' );
			
		}).live(__evs.touchcancel, function( e ){
			$( this ).trigger( 'hidemenues' );
		});
		

		$('span.arrow', that).live(__evs.touchstart, function(evt) {
			evt.preventDefault();
			var p = $(this).parent();
			if(!p.hasClass('activated')) {
				$('.activated').removeClass('activated');
				$('span.arrow ~ ul:visible').hide();
				p.addClass('activated').children('ul').show();
			} else {
				$('.activated').removeClass('activated');
				$('span.arrow ~ ul:visible').hide();
			}
		});
	};
	
	var that = this;
	
	return this.each( function () {
		wallpaper();
		var nav = buildnavi();
		$( "#top" ).css({background: 'url("http://images.zeit.de/static/img/1.1/bodybg.png") repeat-x 0 100%'});
		$( '<div class="nav" id="ipad_nav">' + nav + '</div>' ).insertAfter( "#top" );
		$( "#header .pagetime" ).appendTo( '#header .logo' ).show();
		$( "#header .userlogin").appendTo( "#header .logo" ).show();
		$( "#header .login" ).appendTo( '#ipad_nav' ).fadeIn(800);
		$( ".footernav" ).html( nav ).parents( "#bottom").css("visibility", "visible");
		applyEvents();
		//$('.ipad-article #main').css("visibility", "visible");
	});
	
};

$.fn.inlinegallery = function (options) {
	var options = $.extend({
		json: 'json.zeit.de',
		dia: 0,
		frameheight: 780,
		xstart: 0,
		xmoved: 0
	}, options);
	var that = $(this);
	
	var container = '<div id="foto_slider"></div>';
	var mask = '<div id="foto_mask"></div>';
	var frgmt = '<div class="foto"><div class="copyright"></div><div class="image"></div><div class="galbuts"><div class="rwd">Zurück</div><div class="count"></div><div class="fwd">Vor</div></div><div class="fototext"></div></div>';
	
	var jsonsource = function () {
        var me = $("a img", that).parent().attr('href');
		
		// mapping to json-url
		// if previewing on zip6
		if (me.search(/zip6\.zeit\.de/) > -1) {
        	me = me.replace(/zip6\.zeit\.de\/{0,1}[^\/]+/g, options.json);
            return me.indexOf('?') > -1 ? me.substring(0, me.indexOf('?')) + '?callback=?' : me + '?callback=?';
        }
		// if previewing on zip6-alt
		else if (me.search(/zip6\-alt\.zeit\.de/) > -1) {
        	me = me.replace(/zip6\-alt\.zeit\.de\/{0,1}[^\/]+/g, options.json);
            return me.indexOf('?') > -1 ? me.substring(0, me.indexOf('?')) + '?callback=?' : me + '?callback=?';
        }
		// or www.zeit.de
		else if (me.search(/www\.zeit\.de/) > -1) {
        	me = me.replace('www.zeit.de', options.json);
			return me.indexOf('?') > -1 ? me + '&callback=?' : me + '?callback=?';
        }
		// or zeit.de
		else if(me.search(/zeit\.de/) > -1) {
            me = me.replace('zeit.de', options.json);
			return me.indexOf('?') > -1 ? me + '&callback=?' : me + '?callback=?';
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
	
	return this.each(function() {
		
		$(this).bind('moveforward', function(e) {
			e.preventDefault();
			var pos = Number($('#foto_mask').css('left').replace('px',''));
			var mov = 0;
			if(768*(-1)*(options.pics.length-1) < pos) {
				mov = pos-768;
				options.dia = Number($('#nr').html())+1;
				options.frameheight = $('#foto_'+options.dia).height();
				// $('#nr').html(options.dia);
			} else {
				mov = 0;
				options.dia = 1;
				options.frameheight = $('#foto_'+options.dia).height();
				// $('#nr').html('1');
			}
			$('#foto_mask').css('left', mov);
			$('#foto_slider').css('height', options.frameheight);
		});
		
		$(this).bind('movebackward', function(e) {
			e.preventDefault();
			var pos = Number($('#foto_mask').css('left').replace('px',''));
			var mov = 0;
			if(pos < 0) {
				mov = pos+768;
			} else {
				mov = 768*(-1)*(options.pics.length-1);
			}
			$('#foto_mask').css('left', mov); 
		});
		
		$.getJSON(jsonsource(), function(json) {
            if(json) {
				that.empty();
				var c = $(container);
				var m = $(mask);
				options.pics = makeObjectArray(json);
				$.each(options.pics, function(i){
					var f = $(frgmt).attr('id', 'foto_'+ (i+1));
					var copyright = "";
					if(options.pics[i].copyright.text.length > 1) {
	                    if(options.pics[i].copyright.link.length > 0) {
	                        copyright = '<a href="' + options.pics[i].copyright.link + '">' + options.pics[i].copyright.text +'</a>';
	                    } else {
	                        copyright = options.pics[i].copyright.text;
	                    }
						$(f).find('.copyright').html(copyright);
					}
					var img = $('<img>').attr('src', options.pics[i].path.replace('xml','images'));
					$(f).find('.image').html(img);
					if(options.pics[i].text!== undefined && options.pics[i].text.text()!=='') {
						$(f).find('.fototext').html(options.pics[i].text);
					} else if(options.pics[i].caption !== undefined && options.pics[i].caption !=='') {
						$(f).find('.fototext').html(options.pics[i].caption);
					}
					$(f).find('.count').text((i+1) + '/' + options.pics.length);
					$(f).appendTo(m);
				});
				$(m).css('width', 768*options.pics.length);
				$(m).appendTo(c);
				$(c).hide().appendTo(that);
				
				$('.rwd').bind('touchstart, click', function(e){
					e.preventDefault();
					$('#foto_slider').trigger('movebackward');
				});
				$('.fwd').bind('touchstart, click', function(e){
					e.preventDefault();
					$('#foto_slider').trigger('moveforward');
				});
				$('.image').bind('touchstart', function() {
					if(event.touches.length == 1) {
						options.xstart = event.touches[0].pageX; 
					}
				});
				$('.image').bind('touchmove', function() {
					options.xmoved = event.touches[0].pageX - options.xstart;
				});
				$('.image').bind('touchend', function(){
					if(options.xmoved > 50) {
						$('#foto_slider').trigger('movebackward');
					} else if(options.xmoved < -50) {
						$('#foto_slider').trigger('moveforward');
					}
					options.xstart = 0;
					options.xmoved = 0;
				});
				$('.image').bind('touchcancel', function(){
					options.xstart = 0;
					options.xmoved = 0;
				});
				$(c).show();
				$('#foto_1 img').load(function(){
					options.frameheight = $('#foto_1').height();
					$('#foto_slider').css('height', options.frameheight);
					
				});
			}
		});
	});
};

$.fn.gallery = function() {
	
	var options = $.extend({
        src: 'http://images.zeit.de',
        json: 'json.zeit.de',
		imagenumber: 0,
        max: 0,
        mode: '',
		meta: {
			supertitle: $('#gal_container').find('.supertitle').text(),
			title: $('#gal_container').find('.title').text(),
			releasefrgmt: $('#informatives').find('.date').html(),
			keywordsfrgmt: $('#informatives').find('.tags').html(),
			copyrightfrgmt: $('#gal_copyright').html(),
			txtfrgmt: $('#gal_text').html(),
			img: $('#gal_image').attr('src')
		},
		pics: [],
		tests: ['http://www.zeit.de/politik/ausland/2010-07/fs-congo-2'],
		dia: 0,
		frameheight: 780,
		xstart: 0,
		xmoved: 0
    }, options);
    
    var that = $(this);
	var fshdr = '<div id="fsheader"><div id="bts"><div id="bck">Zurück</div><div id="lbl"><span id="nr">1</span>/<span id="of"></span></div><div id="for">Vorwärts</div></div><div id="sp"></div><div id="ttl"></div></div><div id="foto_slider"><div id="foto_mask"></div></div><div id="fsfooter"><div id="dt"></div><div id="kwd"></div></div>';
	var frgmt = '<div class="foto"><div class="fototext"><div class="cap"></div></div><div class="image"></div><div class="cpr"></div><div class="fototext"> <div class="txt"></div></div></div>';
	
	var jsonsource = function () {
        var me = document.location.href; /* http://www.zeit.de/online/xyz/abc */
		var hashbang = me.search("#");
		if(hashbang > -1) {
			me = me.substring(0, hashbang);
		}
		
		if(location.href.indexOf('localhost') > -1) me = "http://json.zeit.de/gesellschaft/zeitgeschehen/2010-08/fs-chile-2";
		
		if (me.search(/zip6\.zeit\.de/) > -1) {
        	me = me.replace(/zip6\.zeit\.de\/{0,1}[^\/]+/g, options.json);
            return me.indexOf('?') > -1 ? me.substring(0, me.indexOf('?')) + '?callback=?' : me + '?callback=?';
        }
		// or www.zeit.de
		else if (me.search(/www\.zeit\.de/) > -1) {
        	me = me.replace('www.zeit.de', options.json);
			return me.indexOf('?') > -1 ? me + '&callback=?' : me + '?callback=?';
        }
		// or zeit.de
		else if(me.search(/zeit\.de/) > -1) {
            me = me.replace('zeit.de', options.json);
			return me.indexOf('?') > -1 ? me + '&callback=?' : me + '?callback=?';
        }
		
    };

	var makeObjectArray = function(json) {
        var a = [];
		var __first = "";
		if(typeof json['first-image'] !== 'undefined') {
			if( $.trim($(json['first-image'].text).text()) != "" ) {
				__first = json['first-image'].text;
			}
		}
        $(json.blocks).each(function (i, item) {
            var p = {};
            $(item).each(function () {
                if(this.name) p.name = this.name;
                if(this.title) p.title = this.title;
				if( i == 0 && __first != "") {
					p.text = $(__first);
				} else if (this.text != undefined && $(this.text).text() !== "") {
					p.text = $(this.text);
				}
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

	
	return this.each(function() {
		if($('#fotostrecke').size() < 1 ) {
			$('<div id="fotostrecke"></div>').insertBefore('#gal_container');
		} else {
			$('#fotostrecke').empty();
		}
		
		$('#fotostrecke').bind('moveforward', function(e) {
			e.preventDefault();
			var pos = Number($('#foto_mask').css('left').replace('px',''));
			var mov = 0;
			if(768*(-1)*(options.pics.length-1) < pos) {
				mov = pos-768;
				options.dia = Number($('#nr').html())+1;
				options.frameheight = $('#foto_'+options.dia).height();
				$('#nr').html(options.dia);
			} else {
				mov = 0;
				options.dia = 1;
				options.frameheight = $('#foto_'+options.dia).height();
				$('#nr').html('1');
			}
			$('#foto_mask').css('left', mov);
			$('#foto_slider').css('height', options.frameheight);
		});
		
		$('#fotostrecke').bind('movebackward', function(e) {
			e.preventDefault();
			var pos = Number($('#foto_mask').css('left').replace('px',''));
			var mov = 0;
			if(pos < 0) {
				mov = pos+768;
				options.dia = Number($('#nr').html())-1;
				options.frameheight = $('#foto_'+options.dia).height();
				$('#nr').html(options.dia);
			} else {
				mov = 0;
				options.dia = Number($('#of').html());
				options.frameheight = $('#foto_'+options.dia).height();
				$('#nr').html($('#of').html());
				mov = 768*(-1)*(options.pics.length-1);
			}
			$('#foto_mask').css('left', mov);
			$('#foto_slider').css('height', options.frameheight);
		});
		
		$.getJSON(jsonsource(), function(json) {
            if(json) {
				options.pics = makeObjectArray(json);
				var h = $(fshdr);
				$(h).hide().appendTo('#fotostrecke');
				$('#sp').html(options.meta.supertitle);
				$('#ttl').html(options.meta.title);
				$('#dt').html(options.meta.releasefrgmt);
				$('#kwd').html(options.meta.keywordsfrgmt);
				$('#of').html(options.pics.length);
				if(window.testgallery) {
					$('#sp').html(options.meta.supertitle);
				}
				$.each(options.pics, function(i){
					var f = $(frgmt).attr('id', 'foto_'+ (i+1));
					var copyright = "";
	                if(options.pics[i].copyright.text.length > 1) {
	                    if(options.pics[i].copyright.link.length > 0) {
	                        copyright = '<a href="' + options.pics[i].copyright.link + '">' + options.pics[i].copyright.text +'</a>';
	                    } else {
	                        copyright = options.pics[i].copyright.text;
	                    }
						$(f).find('.cpr').html(copyright);
	                }
					var imghtml = '<img src="' + options.pics[i].path.replace('xml','images') + '" />';
					$(f).find('.image').html(imghtml);
					
					if(options.pics[i].text || options.pics[i].caption || options.pics[i].bu) {
	                    if(options.pics[i].text!== undefined && options.pics[i].text.text()!=='') {
							$(f).find('.txt').html(options.pics[i].text);

						}
						if(options.pics[i].caption || options.pics[i].bu) {
	                    	if(options.pics[i].caption) $(f).find('.txt').append('<p>' + options.pics[i].caption + '</p>');
							if(options.pics[i].bu && !options.pics[i].caption) $(f).find('.txt').append('<p>' + options.pics[i].bu + '</p>');
						} else {
							$(f).find('.cap').remove();
						}
	                } else {
	                    $(f).find('.txt').remove();
	                }
					$(f).appendTo('#foto_mask');
				});
				$('#foto_mask').css('width', 768*options.pics.length);
				$('#bck').bind('touchstart, click', function(e){
					e.preventDefault();
					$('#foto_slider').trigger('movebackward');
				});
				$('#for').bind('touchstart, click', function(e){
					e.preventDefault();
					$('#foto_slider').trigger('moveforward');
				});
				$('.foto').bind('touchstart', function() {
					if(event.touches.length == 1) {
						options.xstart = event.touches[0].pageX; 
					}
				});
				$('.foto').bind('touchmove', function() {
					options.xmoved = event.touches[0].pageX - options.xstart;
				});
				$('.foto').bind('touchend', function(){
					if(options.xmoved > 50) {
						$('#foto_slider').trigger('movebackward');
					} else if(options.xmoved < -50) {
						$('#foto_slider').trigger('moveforward');
					}
					options.xstart = 0;
					options.xmoved = 0;
				});
				$('.foto').bind('touchcancel', function(){
					options.xstart = 0;
					options.xmoved = 0;
				});
				$(h).show();
				$('#foto_1 img').load(function(){
					options.frameheight = $('#foto_1').height();
					$('#foto_slider').css('height', options.frameheight);
					
				});
			}
		});
	});
};

$.fn.replaceImage = function(options) {
	var options = $.extend({
		width: 148,
		height: 84,
		newwidth: 540,
		newheight: 304,
		replacement: 'http://images.zeit.de/static/img/1.1/ersatzbild.png',
		replacecss: ""
    }, options); 
	
	$this = $(this);
	
	return this.each(function() {
		if ($(this).parent().attr("id") == "relatedArticles-multiColumnList") return;
		if($('img', this).size() == 1) {
			var i = $('img', this);
			i.attr('src', function(){
				return this.src.replace(options.width, options.newwidth).replace(options.height, options.newheight);
			});
			i.one('error', function(){
				i.attr('src', function(){
					return this.src.replace(options.newwidth, options.width).replace(options.newheight, options.height);
				});
			});
		} else {
			if(! $(this).hasClass('weather') && ! $(this).hasClass('rsslist') && ! $(this).hasClass('quiz')) {
				if($(this).hasClass('button')) {
					$('<img src="' + options.replacement + '">').prependTo(this).css(options.replacecss);
				} else if ($('.zol_video', this).size() < 1) {
					$('<img src="' + options.replacement + '">').insertAfter($('.supertitle',this)).css(options.replacecss);
				}
			}
		}
	});
};

$.fn.getTools = function() {
	return this.each(function() {
		var href = window.location.href;
		if(href.indexOf("/angebote/audio/") > -1) {
			var login = $('#informatives .teaserlist:eq(0) li.first');
			var lhtml = login.html() + login.next('li').html();
			$('<div class="premiumspecial" id="pimp">' + lhtml + '</div>').insertBefore('#main h1');
			$('#pimp .supertitle, #pimp .shortteaserlist').remove();
		} else {
			var x = $('#informatives .tools li:not(".toolad")').clone();
			var ul = $('<ul class="tools"></ul>').append(x);
			if($('p.excerpt + object').size() > 0) {
				$(ul).insertAfter('p.excerpt + object', this).wrap("<div></div>");
			} else if($('p.excerpt + div.vorher-nachher-bild').size() > 0) {
				$(ul).insertAfter('div.vorher-nachher-bild:eq(0)', this).wrap("<div></div>");
			} else if($('p.excerpt + div.art_wide').size() > 0) {
				$(ul).insertAfter('div.art_wide', this).wrap("<div></div>");
			} else if($('p.excerpt + iframe').size() > 0) {
				$(ul).insertAfter('iframe', this).wrap("<div></div>");
			} else if($('p.excerpt + ul.video_lead').size() > 0) {
				$(ul).insertAfter('ul.video_lead', this).wrap("<div></div>");
			} else if($('p.excerpt ~ p', this).size() > 0) {
				$(ul).insertAfter('p.excerpt', this).wrap("<div></div>");
			} else if($('.body-videosingle').size() > 0) {
				$(ul).insertBefore('.body-videosingle #main ul.tools', this).wrap('<div id="wearethetools"></div>');
			} else if($('.articleheader').size() > 0) {
				$(ul).insertAfter('.articleheader', this).wrap("<div></div>");
			}
			$("a.drupalsendarticle").colorbox({
	            iframe: true,
				innerWidth: 474,
				innerHeight: 668,
				opacity: 0.9,
	            speed: 800, 
	            close: "Schließen",
				scrolling: false,
				title: " "
	        }, function() {
				$('#cboxOverlay').css({height: $('body').height(), width: $('body').width()});
				$(this).bind('cbox_complete', function(){
					$("#cboxLoadedContent iframe").load(function() {
						$.colorbox.resize({
							innerWidth: ($(this).contents().find('body').width()),
							innerHeight: ($(this).contents().find('body').height())
						});
					});
				});
			});
			/*if ($(".body-videosingle").size() > 0) {
				$('.bookmarkgallery').buts().html("Facebook, Twitter…");				
			} else {
				$('.savebookmark', ul).buts();
			}*/
			$('.bookmark .smk-bookmark').html("Facebook… ");
			if( $(".bookmark > #smk-toolbox-container").size() < 1 ) $("#smk-toolbox-container").hide().insertAfter($('.bookmark'));
			
			if($('li.pages', this).size() > 0) {
				$('li.pages', this).insertAfter('.tools li:last-child', this);
				var lastlink = $('li.pages a:last-child', this).attr("href");
				$('li.pages a:last-child', this).remove();
				var t = $('li.pages', this).html();
				t = t.substring(0, (t.length-3));
				$('li.pages', this).html(t);
				var lesen = '<li class="seitelesen"><a href="'+lastlink+'">Auf einer Seite lesen</a></li>';
				if(window.location.href.indexOf('?page=all') > -1 || window.location.href.indexOf('/komplettansicht') > -1) {
					lesen = '<li class="seitelesen"><a href="'+lastlink+'" class="small">Auf mehreren Seiten lesen</a></li>';
				}
				$('.tools').append(lesen);
			}
			$('li.comments, li.comments a', this).click(function(e){e.preventDefault();});
			$('li.comments', this).css('background-color','#fff').live('touchstart', function(e) {
				e.preventDefault();
				var off = $('#comments').position();
				$('html,body').animate({scrollTop: (off.top - 60)}, 1000, function(){
					window.location.hash = "comments";
				});			
			});
		}
	});
};

$.fn.taglist = function() {
	return this.each(function() {
		var strong = $('<strong id="sostrong">Schlagworte</strong>');
		var list = $('<ul class="inlist">');
		$('a', this).each(function() {
			var li = $('<li>');
			li.append($(this));
			list.append(li);
		});
		$(list).hide();
		$(this).empty().append(strong).append(list);
		$('#sostrong').bind('touchstart', function(evt) {
			evt.preventDefault();
			$(this).toggleClass('active');
			$('.inlist').toggle();
		});
	});
};

$.fn.placeInformatives = function (options) {
	// <div class="'+ myid +'"><span class="anzeige">Anzeige</span><div class="inner"><div>'+ frag +'</div></div></div>
	options = $.extend({
		ad1: "",
		ad2: ""
	}, options);
	var ads = $('.ipad_ad', this);
	var lists = $('.ranking ol', this);
	var frag1, frag2 = $('<li class="infobar"></li>');
	if(lists.size()==2) {
		frag1 = $('<li class="infobar bar1"><div class="ranking"><div class="titlebar"><a href="http://www.zeit.de/ranglisten">[Zur Ranglisten-Übersicht]</a><h3 class="ranktitle">Meistgelesen</h3></div><ol>'+$(lists[0]).html()+'</ol></div><div id="medrec1"><div class="ipad_tile4"><span class="anzeige">Anzeige</span><div class="inner"><div>'+$(ads[0]).html()+'</div></div></div></div></li>');
		frag1 = $(frag1[0]);
		frag2 = $('<li class="infobar bar2"><div id="medrec2"><div class="ipad_tile5"><span class="anzeige">Anzeige</span><div class="inner"><div>'+$(ads[1]).html()+'</div></div></div></div><div class="ranking"><div class="titlebar"><a href="http://www.zeit.de/ranglisten">[Zur Ranglisten-Übersicht]</a><h3 class="ranktitle">Meistkommentiert</h3></div><ol>'+$(lists[1]).html()+'</ol></div></li>');
		frag2 = $(frag2[0]);
	}
	
	frag1.insertBefore($('li.button').eq(4));
	frag2.appendTo($('#main'));
};

$.fn.placeInformativesVideos = function ( options ) {
	return this.each( function() {
		
		var lis = $("#informatives li.mostviewed li.narrow:not(.last)");
		$('<div class="playlisttitle">Empfohlene Videos</div><div class="teaservideolist clear videolist favourites" style="padding-bottom:40px"><ul class="teaserlist" id="placeInformativesVideos"></ul></div>').insertBefore(this);
		$(lis).removeClass("narrow").addClass("box").appendTo("#placeInformativesVideos");
		
	} );
};

$.fn.replaceNumbers = function (options) {
	var that = this;
	return this.each(function () {
        var text = $(this).text().replace('Seite','').replace('Kommentarseite ','').replace(' / ','/');
		$(this).text(text);
    });
};

$.fn.commentNavigation = function(options) {

	var options = $.extend({
		page: 1,
		pages: 1,
		maxitems: 12,
		px: 63,
		url: "",
		p: 1,
		log: 22
	}, options);
	
	var that = this;
	
	var setLocation = function() {
		var l = window.location.href;
		if(window.location.search) {
			l = l.substring(0, l.lastIndexOf('?'));
		}
		options.url = l;
	};
	
	var processmenu = function() {
		var nr = $('.top .numbers', that).text().split('/');
		options.page = Number(nr[0]);
		options.pages = Number(nr[1]);
		options.p = Math.ceil(options.page/(options.maxitems-1));
		var frag = "", code = "", c = 0, width = 0;
		if(options.pages <= 12) {
			for(var i=1;i < options.pages+1; i++) {
				c = ((i-1) * 8) + 1;
				frag += '<li><a href="' + options.url + '?commentstart=' + c + '#comments"';
				if(i == options.page) frag += ' class="act"';
				frag += ">" + i + "</a></li>";
				width += options.px;
			}
			code = '<div id="ccoms"><ul id="commentsnavigation">' + frag + '</ul></div>';
		} else {
			for(var i=1;i <= options.pages+1; i++) {
				if(i == 12) {
					frag += '<li class="dotsleft">…</li><li class="dotsright">…</li>';
					width += (options.px*2);
				} else if(i > 12) {
					if(options.log <= options.pages && i==options.log) {
						frag += '<li class="dotsleft">…</li><li class="dotsright">…</li>';
						width += (options.px*2);
						options.log += 10;
					}
				}
				c = ((i-1) * 8) + 1;
				frag += '<li><a href="' + options.url + '?commentstart=' + c + '#comments"';
				if(i == options.page) frag += ' class="act"';
				frag += ">" + i + "</a></li>";
				width += options.px;
			}
			code = '<div id="ccoms"><ul id="commentsnavigation" style="width:'+width+'px">'+ frag +'</ul></div>';
		}
		$(code).insertBefore($('#comments'));
	};
	
	return this.each(function(){
		setLocation();
		// event
		$('body').bind('switchpage', function(evt) {
			evt.preventDefault();
			var mov = $('#commentsnavigation').css('left');
			mov = Number(mov.replace('px',''));
			if(evt.target.className == "dotsright") {
				mov = mov + 768;
			} else {
				mov = mov - 768;
			}
			$('#commentsnavigation').css('left', mov);
		});
		$('.dotsleft, .dotsright').live('click', function(){
			$(this).trigger('switchpage');
		});
		// aktuelle Seite berechnen
		processmenu();
		if(options.p > 1) {
			for(var i=1; i<options.p;i++) $(this).trigger("switchpage");
		}
	});
	
};

$.fn.comments = function (opts) {
	
	var options = $.extend({
		sendurl: "http://community.zeit.de/services/json",
        suffix: "?callback=?",
		replytext: "Antwort auf: ",
		linktext: 'Vielen Dank! Ihr Beitrag wird in wenigen Momenten veröffentlicht. Er erscheint dann <span id="nkl">bei den neuesten Kommentaren.</span>',
        limit: 1500,
		sendable: false,
		titlewarning: "Bitte geben Sie Ihrem Kommentar eine aussagekräftige Überschrift",
		reply: {},
		uid: ZEIT.cookieRead('drupal-userid') || null,
		gotolink: "",
		cbhtml: '<div id="cbhtml"><div class="commentform" style="padding:10px"><h3>Kommentar als bedenklich melden</h3><p>Warum halten Sie diesen Kommentar für bedenklich?</p><p style="margin-top:5px"><textarea id="dtext" style="width:500px;height:120px"></textarea></p><p><button id="dbut">Abschicken</button> <span style="font-size:11px">oder <a href="#" id="dlink">abbrechen und Fenster schliessen</a></span></p></div></div>'
	}, opts);
	
	resetForm = function() {
		$('#comment_msg').val("");
		if( $('#subject_msg').attr('placeholder') !== undefined ) {
			$('input#subject_msg').val("");
			$('input#subject_msg').attr('placeholder', options.titlewarning);
		} else {
			$('input#subject_msg').val(options.titlewarning);
		}
        $("#send_msg").attr("disabled", "disabled");
	};
	
	init = function() {
		// replace buggy Username
		$('form .cookieusername').text(function(index, text){
			return decodeURIComponent(text.replace(/\+/gi, ' '));
		});
		// place buggy newcommentlink
		if($('.newestcomments:eq(0)').size() > 0) {
			var nc = $('.newestcomments:eq(0)').clone();
			nc.insertAfter('#comments .head').removeClass('newestcomments').attr("id", "nc");
			options.gotolink = nc.attr('href');
		}
		resetForm();
		$('#comments').bind('flag', function(evt, obj) {
			evt.preventDefault();
			var d = {
				uid: options.uid,
				flag_name: obj.type,
				content_id: obj.rel,
				note: ""
            };
			var target = evt.target;
			var pali = $(target).parents("li");
			switch(obj.type) {
				case 'kommentar_bedenklich':
					$(pali).addClass('notified');
					if ( $('#cbhtml').size() > 0 ) {
						$("#cbhtml").parents("li").removeClass("notified");
						$("#cbhtml").hide().remove();
					}
					$(options.cbhtml).hide().appendTo(pali);
					$('#cbhtml .commentform').height($(pali).innerHeight()-40);
					$('#cbhtml').show(100);
					$('#dbut', pali).attr("disabled", "disabled");
					$('#dtext', pali).keyup(function(){
						if($(this).val() !== "") {
							$('#dbut').attr("disabled", "");
						} else {
							$('#dbut').attr("disabled", "disabled");
						}
					});
					$('button#dbut', pali).click( function (evt) {
						evt.preventDefault();
						if($('#dtext').val() !== "") {
							d.note =  escapeText($.trim($('#dtext').val().substring(0, options.limit)));
							$.getJSON(options.sendurl + options.suffix, 'method=flag.flagnote&flag_name='+d.flag_name+'&uid='+d.uid+'&content_id='+d.content_id+'&note='+$.json.serialize(d.note), function (data) {
				            	if(data) {
                                	if(!data['#error']) {
                                        $(target).parent().html("Ihre Meldung wird an die Redaktion weitergeleitet.");
										$("#cbhtml").parents("li").removeClass("notified");
										$("#cbhtml").hide().remove();
                                 	} else {
										console.info(data.join(", "));
										$("#cbhtml").parents("li").removeClass("notified");
										$("#cbhtml").hide().remove();
									}
                            	}
                            });
						}
					});
					break;
				default:
					$.getJSON(options.sendurl + options.suffix, 'method=flag.flag&flag_name='+d.flag_name+'&content_id='+d.content_id, function (data) {
                        if(data) {
                            if(!data['#error']) {
								if(d.flag_name=="leser_empfehlung") alert("Danke! Sie haben diesen Kommentar empfohlen. Ihre Empfehlung erscheint in Kürze.");
                               	$(target).parent().html(obj.type == "kommentar_empfohlen" ? "Empfohlener Kommentar" : "Meine Empfehlung");
                            }
                        }
                    });
					break;
			}
		});
	};
	
	// check if sendbutton should be enabled or disable it
    enDisable = function() {
		$("#send_msg").attr("disabled", "disabled");
		options.sendable = false;
		var ml = $('#comment_msg').val().length;
		var sl = $('#subject_msg').val().replace(/^\s+/, '').replace(/\s+$/, '').length;
		options.sendable = (ml > 0 && ml <= options.limit && sl > 4);
		if ( options.sendable ) $("#send_msg").attr("disabled", "");
    };

	escapeText = function (text) {
		return text.replace(/#/g, '%23').replace(/&/g, '%26').replace(/\?/g, '%3F').replace(/\+/g, '%2B');
	};
	
	return this.each(function () {
		init();
		// catch clicks and taps
		$('#comments').delegate("a, span, input", "click", function(evt) {
			var pa = $(evt.target).parent();
			if( pa.hasClass('reply') ) {
				
				evt.preventDefault();
				var parent = $(evt.target).parents("li");
	            options.reply.id = $(evt.target).attr("rel");
	            options.reply.subject = $(".subject:first", parent).text();
	            $('#isreplyto').html(options.replytext + options.reply.subject);
	            // scroll to form
	            $("html,body").stop().animate({scrollTop: (($('#commentform').offset().top)-60)}, {speed: 800} );
	
			} else if( $(evt.target).is('span') && pa.hasClass('showresponses') ) {
				
				$(evt.target).parent().next('.response').toggle(100);
				$(evt.target).text(function(i, text) {
					return (text == "anzeigen") ? "verbergen" : "anzeigen";
				});
				
			} else if( $(evt.target).is('#send_msg') ) {
				
				evt.preventDefault();
				$(this).attr("disabled", "disabled");
	            $("#commentform").trigger("submit");
	
			} else if ( $(evt.target).is('#nkl') ) {
			
				evt.preventDefault();
				if(options.gotolink !== "") window.location.href = options.gotolink;
				
			} else if ( $(evt.target).parents('.user_recommandation').size() > 0 ) {
				evt.preventDefault();
				$(this).trigger('flag', {
					type: pa.attr("class"),
					rel: $(evt.target).attr("rel")
				});
				
			} else if ($(evt.target).is('#dlink')) {
				evt.preventDefault();
				$("#cbhtml").parents("li").removeClass("notified");
				$("#cbhtml").hide().remove();
			}
		});
		
		$('#subject_msg').bind('focus, blur, keyup', function() { enDisable(); });
        $('#comment_msg').bind('focus, blur', function() {
            enDisable();
        }).keyup(function(){
			var l = options.limit - $(this).val().length;
            if(l < 21 & l > 10) {
                $("#charcount").css("color", '#900').html(l);
            } else if(l < 11) {
                $("#charcount").css("color", '#ff0000').html(l);
            } else {
                $("#charcount").css("color", '#777').html(l);
            }
            // activate button?
            enDisable();
		});
		
		$('#commentform').bind("submit", function (evt) {
			evt.preventDefault();
			if(options.sendable) {
				$(".commentform").addClass('throbbed');
				var d = {
                    nid: $("#node_id").val(),
					uid: options.uid,
                    comment: escapeText( $.trim($('#comment_msg').val().substring(0, options.limit)) ),
                    subject: escapeText( $.trim($("#subject_msg").val()) )
                };
				if(options.reply.id) {
                    d.pid = options.reply.id;
                }
				try {
					$.getJSON(options.sendurl + options.suffix, 'method=comment.save&comment='+$.json.serialize(d), function (data) {
						if(data) {
                            if(!data['#error']) {
                                // delete form content
                                resetForm();
                                // show that we are working
                                $('<div class="commentissent">' + options.linktext + '</div>').hide().insertBefore($('#commentform')).show(100);
                                if(options.gotolink !== '') $('#nkl').addClass('gotolink');
								$(".commentform").removeClass('throbbed');
                            } else {
								console.error(e);
								$(".commentform").removeClass('throbbed');
								throw "Es ist ein Problem beim Speichern des Kommentares aufgetreten.";
							}
                        } else {
							console.error(e);
							$(".commentform").removeClass('throbbed');
							throw "Es ist ein Problem beim Versand des Kommentars aufgetreten.";
						}
					});
				} catch (e) {
					alert(e + " Bitte versuchen Sie es zu einem spaeteren Zeitpunkt erneut.");
					$(".commentform").removeClass('throbbed');
				}
				
			} else {
				// not sendable
				enDisable();
			}
		});
		
	});
		
};

$.fn.bildrechte = function (options) {
	
	var that = this;
	
	return this.each( function (){
		if( $('#bildrechte').size() > 0 && $('#bildrechte ol li').size() > 0) {
			$('<div>Bildrechte</div>').attr("id", "ir_loader").appendTo(this).click(function(){
				$("#imagerights").stop().show(200, function(){
					$('#ir_loader').hide();
				});
			});
			$('#bildrechte').clone().attr("id","imagerights").hide().appendTo(this);
			$('<div>Schliessen</div>').attr("id", "ir_closer").appendTo('#imagerights').click(function(){
				$("#imagerights").stop().hide(200, function(){
					$('#ir_loader').show();
				});
			});
		} 
	});
	
};

$.fn.advisor = function ( options ) {
	
	var defaults = $.extend({
		advice: "ZEIT ONLINE zum Homebildschirm hinzufügen",
		cancel: "nicht mehr anzeigen",
		debug: ZEIT.getQuery(window.location.search),
		inst: 1,
		cookiename: 'bookmark-advisor',
		cookievalue: 1,
		cookiedays: 3 * 365,
		cookiedomain: 'zeit.de'
	}, options);
	
	var source = '<div id="bookmarkadvisor_' + defaults.inst + '" class="bookmarkadvisor"><span class="advicetext">' + defaults.advice + '</span><span class="canceladvice">' + defaults.cancel + '</span>';
	
	return this.each( function () {
		if( $("#ipad_tile1").size() == 0 ||
			($("img[src*='dot.gif']",'#ipad_tile1').size() > 0  
			|| $("img[src*='817-grey.gif']",'#ipad_tile1').size() > 0 
			|| $("img[src*='zeit_zaehlpixel_kinderzeit']",'#ipad_tile1').size() > 0)) {
		
			if( is_iPad && ( defaults.debug.advisor==="true" || !ZEIT.cookieRead( defaults.cookiename ) ) ) {
				var advisor = $( source ).hide().appendTo( this ).fadeIn( 2000 );
				$( ".canceladvice", advisor ).click( function () {
					advisor.hide(200).remove();
					ZEIT.cookieCreate( defaults.cookiename, defaults.cookievalue, defaults.cookiedays, defaults.cookiedomain ); 
				});
			}
			
		}
	});
	
}

/* Premium Pad */
$.fn.premiumPad = function ( options ) {
        
   	var defaults = $.extend({}, options);

	return this.each( function(){
		
		$(this).find("#main p:first").addClass("premiumaufmacher");
		
		var elems = [
			$("#block-user-0").html(),
			$("#block-block-3").html(),
			$("#informatives ul.teaserlist:eq(1) li.first").html(),
			$("#block-menu-menu-info").html()
		];
		
		var str = '<ul id="premiumPad" class="teaserlist">';
		for(var i=0, l=elems.length;i<l;i++) {
			str += "<li class=\"premiumbutton\">" + elems[i] + "</li>";
		}
		str += '</ul>';
		$(str).insertAfter($("#main h2:first-child"));

		$("#premiumPad .form-item-left").each(function(){
			var label = $(this).find("label").text();
			$(this).hide();
			$(this).next(".form-item-right").find("input").attr("placeholder", label);
		});
		
		$(this).find('a[href$=mp3]').each(function(){
			var mp3 = $(this).attr("href");
			$(this).after('<audio src="'+ mp3 +'" controls="controls"></audio>');
			$(this).hide();
		});

	});

};
$(document).ready(function(){
	$('body.body-premium').premiumPad();
});


$.json={serialize:function(value,replacer,space){var i;gap='';var indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.serialize');}
return this.str('',{'':value});},deserialize:function(text,reviver){var j;var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');},f:function(n){return n<10?'0'+n:n;},DateToJSON:function(key){return this.getUTCFullYear()+'-'+this.f(this.getUTCMonth()+1)+'-'+this.f(this.getUTCDate())+'T'+this.f(this.getUTCHours())+':'+this.f(this.getUTCMinutes())+':'+this.f(this.getUTCSeconds())+'Z';},StringToJSON:function(key){return this.valueOf();},quote:function(string){var meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};var escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';},str:function(key,holder){var indent='',gap='',i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'){switch((typeof value)){case'date':this.DateToJSON(key);break;default:this.StringToJSON(key);break;}}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return this.quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=this.str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=this.str(k,value);if(v){partial.push(this.quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=this.str(k,value);if(v){partial.push(this.quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}};

})(jQuery);