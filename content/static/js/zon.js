(function() {
	var win = window,
		doc = document,
		proto = 'prototype',
		head = doc.getElementsByTagName('head')[0],
		body = doc.getElementsByTagName('body')[0],
		sniff = /*@cc_on!@*/1 + /(?:Gecko|AppleWebKit)\/(\S*)/.test(navigator.userAgent); // 0 - IE, 1 - O, 2 - GK/WK

	var createNode = function(tag, attrs) {
		var attr, node = doc.createElement(tag);
		for (attr in attrs) {
			if (attrs.hasOwnProperty(attr)) {
				node.setAttribute(attr, attrs[attr]);
			}
		}
		return node;
	};

	var load = function(type, urls, callback, scope) {
		if (this == win) {
			return new load(type, urls, callback, scope);
		}

		urls = (typeof urls == 'string' ? [urls] : urls);
		scope = (scope ? (scope == 'body' ? body : head) : (type == 'js' ? body : head));

		this.callback = callback || function() {};
		this.queue = [];

		var node, i = len = 0, that = this;

		for (i = 0, len = urls.length; i < len; i++) {
			this.queue[i] = 1;
			if (type == 'css') {
				node = createNode('link', { type: 'text/css', rel: 'stylesheet', href: urls[i] });
			}
			else {
				node = createNode('script', { type: 'text/javascript', src: urls[i] });
			}
			scope.appendChild(node);

			if (sniff) {
				if (type == 'css' && sniff == 2) {
					var intervalID = setInterval(function() {
						try {
							node.sheet.cssRules;
							clearInterval(intervalID);
							that.__callback();
						}
						catch (ex) {}
					}, 100);
				}
				else {
					node.onload = function() {
						that.__callback();
					}
				}
			}
			else {
				node.onreadystatechange = function() {
					if (/^loaded|complete$/.test(this.readyState)) {
						this.onreadystatechange = null;
						that.__callback();
					}
				};
			}
		}

		return this;
	};
	load[proto].__callback = function() {
		if (this.queue.pop() && (this.queue == 0)) { this.callback(); }
	};

	window.Sid = {
		css: function(urls, callback, scope) {
			return load('css', urls, callback, scope);
		},
		js: function(urls, callback, scope) {
			return load('js', urls, callback, scope);
		},
		load: function(type, urls, callback, scope) {
			return load(type, urls, callback, scope);
		}
	};
})();


(function($) {
	$.fn.videoIcon = function () {
		return this.each (function (i) {
			var href = $(this).parent('a').attr('href');
			if(href.indexOf('zeit.de/video') > -1 && href.indexOf('#autoplay') < 0) {
				href += '#autoplay';
			}

			var imgclass = $(this).attr('class');
			if( !imgclass ){ imgclass = '' }
			var img_parents = $(this).parents();
			var move_bottom = '';
			if( $(img_parents[2]).attr("class") === 'parquet-ressort-teaserlist' ){
			//if we have a parquet image we have to do some modification
				move_bottom = 'style="bottom: -120px"';
			}

			// // video badges/icons are now generated in XSLT
			// if ( $(this).attr('width') < 540 ) {
			// 	// that's a small teaser
			// 	$(this).removeClass().parent('a').wrap('<div class="imgbox ' + imgclass + '"> </div>').prepend('<span class="playimg" ' +move_bottom+ '> </span>').attr('href', href);
			// } else {
			// 	// a big teaser image needs the »video starten« video icon
			// 	$(this).removeClass().parent('a').wrap('<div class="stillImage ' + imgclass + '"> </div>').prepend('<span class="button_large"> </span>').attr('href', href);
			// }
		});
	};
}(jQuery));


(function($){var PREFIX='data-',PATTERN=/^data\-(.*)$/;function dataset(name,value){if(value!==undefined){return this.attr(PREFIX+name,value);}
switch(typeof name){case'string':return this.attr(PREFIX+name);case'object':return set_items.call(this,name);case'undefined':return get_items.call(this);default:throw'dataset: invalid argument '+name;}}
function get_items(){return this.foldAttr(function(index,attr,result){var match=PATTERN.exec(this.name);if(match)result[match[1]]=this.value;});}
function set_items(items){for(var key in items){this.attr(PREFIX+key,items[key]);}
return this;}
function remove(name){if(typeof name=='string'){return this.removeAttr(PREFIX+name);}
return remove_names(name);}
function remove_names(obj){var idx,length=obj&&obj.length;if(length===undefined){for(idx in obj){this.removeAttr(PREFIX+idx);}}
else{for(idx=0;idx<length;idx++){this.removeAttr(PREFIX+obj[idx]);}}
return this;}
$.fn.dataset=dataset;$.fn.removeDataset=remove_names;})(jQuery);(function($){function each_attr(proc){if(this.length>0){$.each(this[0].attributes,proc);}
return this;}
function fold_attr(proc,acc){return fold((this.length>0)&&this[0].attributes,proc,acc);}
function fold(object,proc,acc){var length=object&&object.length;if(acc===undefined)acc={};if(!object)return acc;if(length!==undefined){for(var i=0,value=object[i];(i<length)&&(proc.call(value,i,value,acc)!==false);value=object[++i])
{}}
else{for(var name in object){if(proc.call(object[name],name,object[name],acc)===false)break;}}
return acc;}
function fold_jquery(proc,acc){if(acc===undefined)acc=[];return fold(this,proc,acc);}
$.fn.eachAttr=each_attr;$.fn.foldAttr=fold_attr;$.fn.fold=fold_jquery;$.fold=fold;})(jQuery);

(function ($) {
	var loadversion = typeof window.zeitversion !== 'undefined' ? window.zeitversion : 1234,
		hasConsoleInfo = typeof window.console !== 'undefined' && typeof console.info === 'function';

	$("body").addClass('body-js').addClass('fullwidth');

    if(typeof $.fn.videoIcon === 'function'){
		if(!$('body').hasClass('body-video')){
			$('a[href^="'+ window.www_root +'/video/"] img').videoIcon();
		} else {
			$('a[href^="http://video.zeit.de/"] img').videoIcon();
		}
		//if(window.location.hostname == "zeit.de/video") $('a[href^="/video/"] img').videoIcon();
		$('a.playmedia img').videoIcon();
    }

	if(myagent.toLowerCase().indexOf('windows') > -1) {
		// nicht jedoch auf IE9 und IE10 :P (das hamm wa nu davon)
		var myversion = navigator.userAgent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
		if(myversion == null || parseFloat(myversion[1],10) < 9){
			$("body").addClass('body-iswindows');
		}
    }
	ZEIT.crunchCookies();
	if (window.Z_WT_KENNUNG !== undefined && hasConsoleInfo) {
		console.info('[ZON] Webtrekk-ID: ' + Z_WT_KENNUNG);
	}
	$('.cookieusername').each(function () {
		var t = $(this).text();
		$(this).text(decodeURIComponent(t));
	});

	window.ppath = ZEIT.preview();
	window.cpath = ZEIT.csspath();

	Sid.js(ppath + 'plugins/jquery.referrerCount.js?' + loadversion, function() {
		$(window).referrerCount();
	});

	if($("#module_wahlen2011").size() > 0 || $(".modul_wahlticker_2011").size() > 0) {
		Sid.js(ppath + 'plugins/jquery.wahlen2011.js?' + loadversion, function() {
			$("#module_wahlen2011").wahlen2011( {type:"desktop"} );
			$(".modul_wahlticker_2011").wahlen2011( {type:"desktop"} );
		});
	}
	if($('#zeit_frauenwmticker').size() > 0) {
		Sid.js(ppath + 'plugins/jquery.ticker.js?' + loadversion, function() {
			$('#zeit_frauenwmticker').ticker();
		});
	}

	//back to hp button
	if($('.call-to-action-home').size() > 0) {
		Sid.js(ppath + 'plugins/jquery.back2hpbutton.js?' + loadversion, function() {
			$('.call-to-action-home').back2HpButton();
		});
	}

	if( $('body[data-page_type="article"]').size() > 0 && $('.call-to-action-home').size() === 0 ) {
		Sid.js(ppath + 'plugins/jquery.getexternalreferrer.js?' + loadversion, function() {
			$('body[data-page_type="article"]').getExternalReferrer();
		});
	}

	if($('#zeit_basketballemticker').size() > 0) {
		Sid.js(ppath + 'plugins/jquery.ticker.js?' + loadversion, function() {
			$('#zeit_basketballemticker').ticker({ticker: "bb_mem"});
		});
	}

	if($("#zeit-readersarticle-my-form #edit-article").size() > 0 ) {
		Sid.js(ppath + 'plugins/jquery.formcounter.js?' + loadversion, function() {
			 $("#zeit-readersarticle-my-form #edit-article").formcounter();
		});
	}

	if( $( ".vorher-nachher-bild" ).size() > 0 ) Sid.js(ppath + 'plugins/jquery.beforeAfter.js', function (){
		$(".vorher-nachher-bild").beforeAfter();
	});

	if( $( ".article-body > p" ).size() > 0 ) Sid.js(ppath + 'plugins/jquery.trackInlineLinks.js', function (){
		$( ".article-body > p" ).trackInlineLinks();
	});

	// scripts depending colorbox
	Sid.js(ppath + 'plugins/jquery.colorbox.min.js?' + loadversion, function(){
		if( $('.weather').size() > 0 ) Sid.js( ppath + 'plugins/jquery.wetterNet.js?' + loadversion, function() {
			$('.weather').wetterNet();
		});
		// delegate click events to the #wrapper if possible
		$('#wrapper').delegate("a#drupalregister,a#drupalformregister", "click", function() {
			$(this).colorbox({
	            iframe: true,
	            width: 506,
	            height: 632,
	            opacity: 0.9,
	            speed: 800,
	            close: "Schliessen"
	        });
		}).delegate("a#drupalformlogin, a#drupallogin", "click", function() {
			$(this).colorbox({
	            iframe: true,
	            width: 501,
	            height: 470,
	            opacity: 0.9,
	            resize: false,
	            speed: 800,
	            close: "Schliessen",
	            title: " "
	        }, function() {
				$(this).bind('cbox_closed', function() {
					window.location.reload();
				});
			});
		}).delegate("a.colorbox", "click", function() {
			$(this).colorbox({
	            current : "{current}/{total}",
	            transition: "elastic",
	            maxWidth: "99%",
	            maxHeight: "99%",
	            opacity: 0.9,
	            close : "Schliessen"
	        });
		}).delegate("a.meinestartseite", "click", function() {
			$(this).colorbox({
	            iframe: true,
				innerWidth: 690,
				innerHeight: 512,
				opacity: 0.9,
				speed: 800,
				close: "Schliessen",
				title: "So machen Sie ZEIT ONLINE zu Ihrer Startseite."
	        });
		}).delegate("a.drupalsendarticle", "click", function() {
			$(this).colorbox({
	            iframe: true,
				innerWidth: 474,
				innerHeight: 668,
				opacity: 0.9,
	            speed: 800,
	            close: "Schliessen",
				scrolling: false,
				title: " "
	        });
		});
		/*$('#bottom').delegate(".footer2 a[href='#bildrechte']", "click", function( evt ) {
			evt.preventDefault();*/
			/*if( $("#bildrechte > table").size() < 1 ) {
				$('<table id="br"></table>').appendTo("#bildrechte");
				var code = "<tr>";
				$("#bildrechte li").each(function(i) {
					var src = $(this).dataset("imageurl");
					var txt = $(this).html();
					code += '<td class="bidlrechte-number">' + (i + 1) + '.</td>';
					if(src) {
						code += '<td class="bildrechte-image"><img src="'+ src +'" /></td>';
						code += '<td class="bildrechte-text">' + txt + '</td>';
					} else {
						code += '<td class="bildrechte-text" colspan="2">' + txt + '</td>';
					}
					if((i + 1)%2==0) code += '</tr><tr>';
					$(this).remove();
				});
				code += "</tr>";
				$(code).appendTo("#br");
			}*/
			/*$(this).colorbox({
	            inline:true,
	            href:"#bildrechte",
	            opacity: 0.9,
	            scrolling: true,
	            innerWidth: 660,
				height: "80%",
	            speed: 800,
	            close : "Schliessen",
	            title: "Bildrechte auf dieser Seite"
	        });
		});*/

		if($("#bildrechte").size() > 0) Sid.js(ppath + 'plugins/jquery.bildrechte.js?' + loadversion, function() {
			$('#bottom').delegate(".footer2 a[href='#bildrechte']", "click", function( evt ) {
				evt.preventDefault();
				$("#bildrechte").bildrechte();
			});
		});

		if($("a.colorpopup").size() > 0) Sid.js(ppath + 'plugins/jquery.colorpopup.js?' + loadversion, function() {
			$("a.colorpopup").colorpopup();
		});
	}); // end scripts depending colorbox

	if($('.zol_videohp').size() > 0) Sid.js(ppath + 'plugins/jquery.backbone.videoHp.js?' + loadversion, function() {
	//if($('.zol_videohp').size() > 0) Sid.js(ppath + 'plugins/jquery.videoHp.js?' + loadversion, function() {
		Sid.js('//admin.brightcove.com/js/BrightcoveExperiences.js');

		Sid.js(ppath + 'libs/underscore.js/1.4.4/underscore-min.js', function () {
			Sid.js(ppath + 'libs/backbone.js/1.0.0/backbone-min.js', function () {
					$('.zol_videohp').videoHp();
			});
		});

		//Tracking for the big picture on the left in the big player version.
		$(".zol_videohp").on("click", ".hpplayer_player img, .hpplayer_player .button_large", function(e) {
			var tracking_id_image = "hp.centerpage.teaser.video." + ($('.zol_videohp').prevAll('.parquet-ressort').length + 1) + ".2.a.large.image./video/index" ;
			ZEIT.clickWebtrekkOnly(tracking_id_image);
		});

		//Manual tracking for small teaser, because they are not there on pageload when webtrekk scrapes the site
		$(".zol_videohp").on("click", ".box a, .hpplayer_links a", function(e) {
			var that = $(this);
			e.preventDefault();
			ZEIT.clickWebtrekkOnly(that.attr("id"));
			setTimeout(function(){
				window.location.href = that.attr("href");
			},80);
		});
	});

	// scripts depending toolbox.flashembed
	if($('.zol_video').not('.aud_narrow').size() > 0 || $('.zol_titelfluss').size() > 0) Sid.js(ppath + 'plugins/toolbox.flashembed.js?' + loadversion, function() {
		// brightcove video magic
		if($('.zol_video').not('.aud_narrow').size() > 0) Sid.js(ppath + 'plugins/jquery.video.js?' + loadversion, function() {
			$('.zol_video').not('.aud_narrow').video();
		});
		// zeit title meta data plugin
		if($('.zol_titelfluss').size() > 0) Sid.js(ppath + 'plugins/jquery.titelfluss.js?' + loadversion, function() {
			$('.zol_titelfluss').titelfluss();
		});
		// Videomosaic
		if($('#videomosaic').size() > 0) Sid.js(ppath + 'plugins/jquery.videoMosaic.js?' + loadversion, function() {
			$('#videomosaic').videoMosaic();
		});
	}); // end of scripts depending on jquery.jplayer.min
	/* Audioplayer 2012: HTML & JS based */
	if($('.aud_narrow').size() > 0 || $('.zol_video.quiz').size() > 0) Sid.js(ppath + 'libs/jplayer/2.2.0/jquery.jplayer.min.js?' + loadversion, function () {
		Sid.css(cpath + 'audioplayer.css?' + loadversion);
		Sid.js(ppath + 'libs/jquery-ui/1.10.1/jquery-ui.min.js?' + loadversion, function () {
			Sid.js(ppath + 'plugins/jquery.audioplayer.js?' + loadversion, function() {
				if ( window.location.hostname === 'blog.zeit.de' ) {
					$('.aud_narrow').audioplayer({
						'xml_filepath'        : 'http://blog.zeit.de/wp-content/themes/zeitonline_2013/audioplayer/audio_xsite_xml_proxy.php?audio-xml-url=http://phpscripts.zeit.de/audioplayer/audios/',
						'player_template_url' : 'http://blog.zeit.de/wp-content/themes/zeitonline_2013/audioplayer/audioplayer.html',
						'jplayer_swf'         : 'http://blog.zeit.de/wp-content/themes/zeitonline_2013/audioplayer/Jplayer.swf'
					});
				} else if ( window.location.hostname === 'styx.zeit.de' ) {
					$('.aud_narrow').audioplayer({
						'xml_filepath'        : 'http://phpscripts.zeit.de/audioplayer/audios/',
						'player_template_url' : 'http://styx.zeit.de/static/js/templates/audioplayer.html',
						'jplayer_swf'         : 'http://styx.zeit.de/rebrush_frontdev/js/libs/jplayer/2.2.0/Jplayer.swf'
					});
				} else if ( window.location.hostname === 'localhost' ) {
					$('.aud_narrow').audioplayer({
						'xml_filepath'        : 'http://phpscripts.zeit.de/audioplayer/audios/',
						'player_template_url' : 'http://localhost:8080/js/templates/audioplayer.html',
						'jplayer_swf'         : 'http://localhost:8080/js/libs/jplayer/2.2.0/Jplayer.swf'
					});
				} else {
					$('.aud_narrow, .zol_video.quiz').audioplayer();
				}
			});
		});
	});

	/* ZOL-Audio Player Premium-Bereich */
    if($('.zol_audio').size() > 0) Sid.js(ppath + 'plugins/jquery.jplayer.min.js?' + loadversion, function() {
		// brightcove video magic
		if($('.zol_audio').size() > 0) Sid.js(ppath + 'plugins/jquery.audio.js?' + loadversion, function() {
			$('.zol_audio').audio();
		});
	}); // end of scripts depending on jquery.jplayer.min

    /* Quiz Script */
    if($( '.zol_jsquiz' ).size() > 0) Sid.js( ppath + 'plugins/jquery.jsquiz.js?' + loadversion, function() {
		$( '.zol_jsquiz' ).jsQuiz( { type: $( '.zol_jsquiz' ).attr( 'data-type' ),  format: $( '.zol_jsquiz' ).attr( 'data-format' )});
	}); // end of scripts depending on jquery.jsquiz.js

	if($('.infobox').size() > 0) Sid.js(ppath + 'plugins/jquery.infobox.js?' + loadversion, function() {
		$('.infobox').infobox();
	});


	if ($('#js-parquet-carousel').size() > 0 && $('#js-parquet-shopcarousel').size() > 0 ) {
		loadFotoCarousel(1);
	}
	else if($('#js-parquet-carousel').size() > 0) {
		loadFotoCarousel();
	}
	else if($('#js-parquet-shopcarousel').size() > 0) {
		loadShopCarousel();
	}

	/* Homepage Photo Carousel */
	function loadFotoCarousel (loadAll) {
		Sid.js( ppath + 'libs/bxslider/4.0/jquery.bxslider.min.js?' + loadversion, function() {
			Sid.js( ppath + 'plugins/jquery.parquetCarousel.js?' + loadversion, function() {
				Sid.css( ppath + 'libs/bxslider/4.0/jquery.bxslider.css?' + loadversion, function() {});
				$('#js-parquet-carousel').parquetCarousel();
				//Clicktracking Carousel Next/Prev Buttons
				$("#js-parquet-carousel .bx-controls-direction a").on("click", function(e) {
					var tracking_id = "hp.centerpage.teaser.parquet." + ($('#js-parquet-carousel').prevAll('.parquet-ressort').length + 1) + ".carousel.showslide./index";
					ZEIT.clickWebtrekkOnly(tracking_id);
				});
				if(loadAll == 1) {
					loadShopCarousel();
				}
			});
		});
	}

	/* Zeit Shop Carousel */
	function loadShopCarousel () {
		Sid.js( ppath + 'libs/bxslider/4.0/jquery.bxslider.min.js?' + loadversion, function() {
			Sid.js( ppath + 'plugins/jquery.parquetShopCarousel.js?' + loadversion, function() {
				Sid.css( ppath + 'libs/bxslider/4.0/jquery.bxslider.css?' + loadversion, function() {});
				$('#js-parquet-shopcarousel').parquetCarousel();
				//Clicktracking Carousel Next/Prev Buttons
				$("#js-parquet-shopcarousel .bx-controls-direction a").on("click", function(e) {
					var tracking_id = "hp.centerpage.teaser.parquet." + ($('#js-parquet-shopcarousel').prevAll('.parquet-ressort').length + 1) + ".shopcarousel.showslide./index";
					ZEIT.clickWebtrekkOnly(tracking_id);
				});
			});
		});
	}


	if($('#bottompic').size() > 0) Sid.js(ppath + 'plugins/jquery.bottompic.js?' + loadversion, function() {
		$('#bottompic').bottompic();
	});

    if($('.zol_inlinelabel').size() > 0) Sid.js(ppath + 'plugins/jquery.inlinelabel.js?' + loadversion, function() {
			$('.zol_inlinelabel').inlinelabel();
		});

	if($('#main.rankings').size() > 0) Sid.js(ppath + 'plugins/jquery.tabs.js?' + loadversion, function() {
		$('#main.rankings').tabs();
	});

	if($('.informatives .rankings.tabbed').size() > 0) Sid.js(ppath + 'plugins/jquery.tabs.js?' + loadversion, function() {
		$('.informatives').tabs();
	});

	if( ! $('body').dataset('hide_socialmedia') && ( $(".show_smk").size() > 0 || $(".bookmark").size() > 0) ) {

		Sid.js(ppath + 'plugins/jquery.socialmedia.js?' + loadversion, function() {
			$('body').socialmedia();
			$(".show_smk").socialmedia("articlebar");
			$('.bookmark').socialmedia("toolbox", {smkList:['fbwithsend','google', 'twitter']});
		});
	}

	if( ! $('body').dataset('hide_fb_ra') && ( $('.article').size() > 0 && $('.tools').size() > 0) && $('#module_facebook_connect_box').size() < 1 ) {

		Sid.js(ppath + 'plugins/jquery.fb_recentActivity.js?' + loadversion, function() {
			var winloc = window.location.href;
			if (winloc.indexOf('/administratives/social-media') < 0 ) {
				var wgt = $('<li id="recentActivity" class="show_facebook_widget">recent activity</li>');
				var target = $('#informatives > .teaserlist > li:nth-child(3)');
				$(wgt).insertBefore(target);
				$(wgt).smkFacebookWidget();
			}
		});
	}

	if( $('#module_facebook_connect_box').size() > 0 ) {
		Sid.js(ppath + 'plugins/jquery.fb_recentActivity.js?' + loadversion, function() {
			var fb_options = {};
			var fb_class = "show_facebook_widget";
			if( $('body').dataset('page_type') == "rankings" ) {
				fb_options.recentActivity = {
					title: "Empfehlungen bei Facebook",
                    site: "www.zeit.de",
                    width: 430,
                    height: 320,
                    header: false,
                    font: "verdana",
                    border_color: "%23ffffff",
                    recommendations: false,
                    colorscheme: "light",
                    filter: '',
                    ref: 'facebook.zonarticle.klick.article.activityfeed',
                    max_age: 7,
                    informationLink: window.www_root + "/administratives/social-media",
                    informationText: "[Datenschutz]"
				};
				fb_class += " fb_widget_wide";
			}
			$('#module_facebook_connect_box').attr("id", "recentActivity").addClass(fb_class).smkFacebookWidget(fb_options);
		});
	}

	//in article toolbox
	if($(".zol_inarticletools").size() > 0) {
		Sid.js(ppath + 'plugins/jquery.inarticleTools.js?' + loadversion, function() {
			$(".zol_inarticletools").inarticleTools();
		});
	}

	if($("#smkSettings").size() > 0) {
		Sid.js(ppath + 'plugins/jquery.socialmediaOptout.js?' + loadversion, function() {
			$("#smkSettings").smkSettings();
		});
	}

	if ( $('.twitterFollowlink').size() > 0 ) {
		Sid.js(ppath + 'plugins/jquery.twitterFollowlink.js?' + loadversion, function() {
			$('.twitterFollowlink').twitterFollowlink();
		});
	}

	//load dpa ticker
	if($('#dpaticker').size() > 0 ) Sid.js(ppath + 'plugins/jquery.dpaticker.js?' + loadversion, function() {
		$('#dpaticker').dpaticker();
	});

	if($('form.standardform').size() > 0 || $('.zol-accordion').size() > 0) {
		$('head').append($('<link rel="stylesheet" type="text/css" href="' + cpath + 'ui/smoothness/jquery-ui-1.8.9.custom.css" />'));
		$.getScript(ppath + 'libs/jquery-ui/1.10.1/jquery-ui.min.js', function() {

			$('.date1 input').datepicker({
	            changeMonth: true,
	            changeYear: true,
	            currentText: 'Heute',
	            dateFormat: 'dd.mm.yy',
	            dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
	            firstDay: 1,
	            inline: true,
	            maxDate: '+0',
	            minDate: new Date(1946, 2 - 1, 20),
	            monthNames: ['Januar','Februar','Märrz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
	            monthNamesShort: ['Jan','Feb','Mrz','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
	            nextText: 'Vor',
	            prevText: 'Zurück',
	            yearRange: '1946:2020'
	        });



	        $('.date2 input').datepicker({
	            changeMonth: true,
	            changeYear: true,
	            currentText: 'Heute',
	            dateFormat: 'dd.mm.yy',
	            dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
	            firstDay: 1,
	            inline: true,
	            maxDate: '+0',
	            minDate: new Date(1946, 2 - 1, 20),
	            monthNames: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
	            monthNamesShort: ['Jan','Feb','Mrz','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
	            nextText: 'Vor',
	            prevText: 'Zurück',
	            yearRange: '1946:2020'
	        });

			$("#wrapper").delegate('.daterange .date span.calIcon', "click", function() {
				$(this).prev('input').focus();
			}).delegate('input[name="q"]', 'focus', function(){
				$(this).select();
			});

            $(".zol-accordion").accordion({ header: ".header",autoHeight: false});
		});


	}

	if($('.body-gallery').size() > 0 ) Sid.js(ppath + 'plugins/jquery.nugallery.js?' + loadversion, function() {
		$('.body-gallery #main').nugallery();
	});

	if($('.inlinebiga').size() > 0) Sid.js(ppath + 'plugins/jquery.inlineGallery.js?' + loadversion, function() {
		$('.inlinebiga').inlineGallery();
	});

	if($('.timeline').size() > 0) Sid.js(ppath + 'plugins/jquery.timeline.js?' + loadversion, function() {
		$('.timeline').timeline();
	});

	if($('.newcomments').size() > 0) Sid.js(ppath + 'plugins/jquery.comments.js?' + loadversion, function() {
		$('.newcomments').comments();
	});

	if($('.quizform').size() > 0 || $('.quiz').size() > 0) Sid.js(ppath + 'plugins/jquery.quizSend.js?' + loadversion, function() {
		$('.quizform').quizSend();
		$('.quiz form').quizSend();
	});

	if($('.zeitkommentare').size() > 0) Sid.js(ppath + 'plugins/jquery.comNav.js?' + loadversion, function() {
		$('.zeitkommentare .pagenav').comNav();
	});

	if($('.body-tags .teaserlist .pagenav').size() > 0) Sid.js(ppath + 'plugins/jquery.comNav.js?' + loadversion, function() {
		$('.body-tags .teaserlist .pagenav').comNav({mode: "seite-", comperpage: 15, targettext: "Zu den Seiten: "});
	});

	if($('body[data-page_type="homepage"]').size() > 0) Sid.js(ppath + 'plugins/jquery.hpOverlay.js?' + loadversion, function() {
		Sid.js('http://scripts.zeit.de/static/js/hpoverlay.config.js?' + loadversion, function() {
			$('body[data-page_type="homepage"]').hpOverlay( overlayConf );
		});
	});

	// Bytefm Player
	$('.bytefm_player').click( function() {
		window.open( $(this).attr('href'), 'ByteFM-Player', 'width=220,height=500' );
		return false;
	});
	$('.dlf_player').click( function() {
		window.open( $(this).attr('href'), 'DLF-Player', 'width=640,height=445' );
		return false;
	});

	if($('a.bytefm_player img').size() > 0) {
		$('a.bytefm_player img').parent().addClass('bytefmplayer_js');
	}
	if($('a.dlf_player img').size() > 0) {
		$('a.dlf_player img').parent().addClass('dlfplayer_js');
	}
	if($('img[src$="static/img/player_0001_normal.jpg"]')) {
		$('img[src$="static/img/player_0001_normal.jpg"]').wrap('<div class="bytefmbigplayer_js></div>');
	}

	//Clicktracking für den Call-To-Action-Button (Startseite) am Ende eines Artikels
	$(".call-to-action-home").on("click", function(e) {
		e.preventDefault();
		ZEIT.clickWebtrekkOnly('hp.article.end.start');
		var ga_code = ["_trackEvent", "articleend", "start", window.location.href];
		ZEIT.clickGA( ga_code );
		setTimeout(function() {
		document.location.href = window.www_root;
		}, 100);
	});

	//Clicktracking for Handelsblatt/WiWo RSS-Feed in Parquet
	var rssPositionNum = $(".parquet-rss").prev('.parquet-ressort').find('.parquet-ressort-articleteaser-large, .parquet-ressort-articleteaser-regular').length + 1;
	var rssPositionChar = String.fromCharCode(96 + rssPositionNum);
	var rssGeneralPos = $('.parquet-rss').prevAll('.parquet-ressort').length;
	var rssTrackingId = "hp.centerpage.teaser.parquet." + rssGeneralPos + ".3." + rssPositionChar + ".rss./index";
	$(".parquet .parquet-rss a").attr('id', rssTrackingId);

	//clear stock and weather widget
/*	$(".stocks, .weather, .newsletter-mailsubmit").find("input[type='text']").focus(function(){
		if($(this).attr('data-value') === undefined){
			$(this).attr('data-value',$(this).val());
		}

		if($(this).val() === $(this).attr("data-value")){
			$(this).val('');
		}
	});

	$(".stocks, .weather, .newsletter-mailsubmit").find("input[type='text']").blur(function(){
		if($(this).val() === ''){
			$(this).val($(this).attr("data-value"));
		}
	});
*/

	Sid.js(ppath + 'plugins/jquery.placeholder.js?' + loadversion, function() {
		$('input').placeholder();
	});

	// delegate the logout action
	$("#wrapper").delegate("a#logout", "click", function(evt) {
        evt.preventDefault();
		ZEIT.cookieErase('drupal-userid');
		ZEIT.cookieErase('drupal-username');
		ZEIT.cookieErase('drupal-useradmin');
		ZEIT.cookieErase('drupal-author');
        var i = $('<iframe></iframe>').css({height: "1px", width: "1px", position: "absolute", left: "-5000em", top: "-5000em", border: "none"});
        $(i).appendTo('body');
        $(i).attr('src','http://community.zeit.de/logout');
		// falls das Sessioncookie noch da ist, weg damit
		var sessname = ZEIT.cookieSearchName('SESS');
		if(sessname !== null) {
			ZEIT.cookieErase(sessname);
		}
        window.setTimeout(function(){window.location.reload();}, 2000);
    });

	// header search box behaviour
	$(".js-sitesearch-submitbutton").one("click", function(e) {
		e.preventDefault();
		$(".js-sitesearch-itext").focus().css("cursor", "text");
	});
	$(".js-sitesearch-itext").one("focus", function() {
		$(".js-sitesearch-submitbutton").off();
		$(this).css("cursor", "text");
	});

	// enable ESI via jQuery plugin
	if ( $("#wrapper div[data-type = 'esi-content']").size() > 0 ) {
		Sid.js( ppath + 'libs/esiparser/esiparser.js?' + loadversion, function() {
			do_esi_parsing( document );
			if (hasConsoleInfo) {
				console.info('[ESI] parsing directive via JS');
			}
		})
	} else if ( $("#js-parquet-terminkalender").size() > 0 ) loadCarouselHamburgEvents();

	// event listener for ESI parsing completion
	$( "#wrapper" ).on( "esi-parsing-complete", loadCarouselHamburgEvents );

	function loadCarouselHamburgEvents() {
		if (hasConsoleInfo) {
			console.info('[PLUGIN] loading: Hamburg Events Carousel');
		}
		Sid.js( ppath + 'libs/bxslider/4.0/jquery.bxslider.min.js?' + loadversion, function() {
			Sid.js( ppath + 'plugins/jquery.hamburgEventsCarousel.js?' + loadversion, function() {
				Sid.css( ppath + 'libs/bxslider/4.0/jquery.bxslider.css?' + loadversion, function() {});
				$('#js-parquet-terminkalender').terminSlider();
			});
		});
	}


	if(ZEIT.cookieRead('device-view') == 'mobile-desktop' && ZEIT.cookieRead('hide-mobile-info') == null) {
		$( ".outerspace" ).before( "<div class='back-to-mobile'><span class='close-button'></span><a href='#' class='back-to-mobile-link'><span class='mobile-icon'></span><span class='info-text'>Zur mobilen Ansicht von <br> ZEIT ONLINE wechseln</span><span class='arrow'></span></a></div>" );

		$( ".back-to-mobile .close-button" ).on( "click", function() {
			$(".back-to-mobile").hide();
			ZEIT.cookieCreate("hide-mobile-info", "yes", 2);
		});

		var lhome = /(www\.)?zeit.de(\:8080\/preview)?\/index/gi,
			lprint = /(www\.)?zeit.de(:8080\/preview)?\/\d{4}\/\d{2}\/[^(index)]+/gi,
			lressort = /(www\.)?zeit.de(:8080\/preview)?\/(politik|wirtschaft|meinung|gesellschaft|kultur|wissen|digital|studium|karriere|lebensart|reisen|auto|mobilitaet|sport|hamburg)\/(.+)/gi;

		$( ".back-to-mobile-link" ).on( "click", function(e) {
			e.preventDefault();
			ZEIT.cookieCreate("device-view", "mobile-mobile", 7, ".zeit.de");
			if( lhome.test(location.href) || lprint.test(location.href) || lressort.test(location.href) ) {
				ZEIT.clickWebtrekkOnly("hp.banner.mobilseite.title" + window.location.pathname);
				var ga_code = ["_trackEvent", "mobilseite", "click", window.location.href];
				ZEIT.clickGA( ga_code );
				setTimeout(function(){
					cleanURL = window.location.href.split("?")[0]
					window.location = cleanURL;
				},80);
			} else {
				ZEIT.clickWebtrekkOnly("hp.banner.mobilseite.title/index");
				var ga_code = ["_trackEvent", "mobilseite", "click", "http://www.zeit.de/index"];
				ZEIT.clickGA( ga_code );
				setTimeout(function(){
					window.location = "http://www.zeit.de/index";
				},80);
			}
		});
	}


})(jQuery);
