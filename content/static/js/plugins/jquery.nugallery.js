(function ($) {
    /*
    * Zeit Online Nu Gallery Plugin
    * image gallery with ajax loading pictures
    *
    * Copyright (c) 2011 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Nico Bruenjes
    * @version 1
    *
    */

	$.fn.nugallery = function ( options ) {
		var __w = window,
		__win = __w.location,
		__ishistory = (navigator.userAgent.match(/Firefox/i) !== null && navigator.appVersion.match(/5/) !== null),
		__actualimage = 1,
		__max = 1,
		__notfotopage = ( $( "#gal_image" ).size() < 1 ),
		__blocked = true, // changed to be alwas true, TT-263
		__ispreview = (__w.www_root !== "http://www.zeit.de"),
		__isvivi = (__win.hostname.indexOf( "vivi" ) > -1),
		__json = {},
		self = this,
		__options = $.extend({
			blockScript: "gallery.blocked.ressorts.js",
			jsonsrc: {
				live: "http://json.zeit.de",
				preview: "http://cms-backend.zeit.de/preview-json"
			},
			scriptURL: __w.js_path,
			src: __ispreview ? "http://zip6.zeit.de:9000/cms/work" : "http://images.zeit.de",
			ressorts: {
				ressort: $('body').attr("data-ressort"),
				subressort: $('body').attr("data-sub_ressort")
			},
			xmlsrc: "http://xml.zeit.de"
		}, options);

		// load data
		startGallery = function () {
			// get actual and max
			var txt = $("#x_of_y").text();
			var splt = txt.split(" ");
			__actualimage = getPageNumber();
			__max = splt[2];
			// de-ajaxified TT-263
			// gallery blocked for ajax functionality?
			// $.ajax({
			// 	//url: __options.scriptURL + "/" + __options.blockScript,
			// 	url: 'http://scripts.zeit.de/static/js/gallery.blocked.ressorts.js',
			// 	dataType: 'script',
			// 	success: function (data, textstatus) {
			// 		// toDo: ggf. Abfrage auf Subressort hinzufuegen
			// 		__blocked = ( $.inArray( __options.ressorts[ "ressort" ], $blocked ) > -1 );
			// 		$( self ).trigger( "gallery.initialised" );
			// 	}
			// });
			$( self ).trigger( "gallery.initialised" );

		};

		// legacy dimension checking for old galleries
		fixDimensions = function () {
			var w =  0;
			var img = $( "#gal_image" );
			var ii = $("<img/>") // Make in memory copy of image to avoid css issues
			.load(function(evt) {
				w = this.width;
				$("#caption").removeClass("made620").removeClass("made940");
				if ( w > 620 ) {
					$( "#caption" ).addClass( "made940" );
				}
				$( "#gal_image" ).removeClass("made620").removeClass("made940");
				if ( w < 620 ) {
					$( "#gal_image" ).addClass( "made620" );
				}
				if ( w > 620 && w < 940 ) {
					$( "#gal_image" ).addClass( "made940" );
				}
			}).attr("src", img.attr("src"));
		};

		// show an element
		showElement = function ( nr ) {
			var myitem = ( nr ) ? nr : __json[__actualimage - 1];

			$("#gal_title").text(__title); // fixed bug where… TT-263

			if(myitem.title) {
				$("#gal_title").text(myitem.title);
			} else {
				$("#gal_title").text(__title);
			}
			if(myitem.text) {
				$( "#gal_text" ).html( myitem.text );
			} else {
				$( "#gal_text" ).html("");
			}
			$( "#caption" ).html( function (i) {
				var ret = "";
				if( myitem.caption != undefined ) {
					ret += myitem.caption + "&nbsp;";
				}
				if(myitem.caption != undefined && myitem.copyright != undefined) {
					ret += "|";
				}
				if(myitem.copyright != undefined) {
					ret += "&nbsp;" + myitem.copyright;
				}
				return ret;
			} );
			$( "#x_of_y" ).html( __actualimage + " von " + __max );
			$( "#gal_image" )
			.removeClass( "made940" )
			.removeClass( "made620" )
			.attr( "src", myitem.path )
			.attr( "alt", function(){
				return myitem.caption != undefined ? myitem.caption : "";
			})
			.attr( "title", function(){
				return myitem.caption != undefined ? myitem.caption : "";
			});
			// count me
			if ( !__blocked && !__isvivi) {
				ZEIT.clickWebtrekk( "biga" );
				ZEIT.clickIVW(true);
			}
			// legacy
			fixDimensions();
		};

		// get the actual page number from location
		getPageNumber = function () {
			var u = "http://" + __win.host + __win.pathname;
			u = u.replace(/seite-\d+/, '') + "seite-";
			var nr = Number( __win.href.replace( u, "") ) || 1;
			return nr;
		};

		// make url interchangeable
		normalizeURL = function () {
			var u = "http://" + __win.host + __win.pathname;
			u = u.replace(/seite-\d+/, '');
			if( u.lastIndexOf("/") < u.length-1 ) {
				u += "/";
			}
			return u;
		};

		// show gallery endpage
		showWeitere = function () {
			window.location.href = normalizeURL() + "weitere";
		};

		//reset hover class
		resetHover = function(className,removeClass){
			$( className ).removeClass( removeClass )
		}

		// Events
		$( this ).bind("gallery.initialised", function (evt) {

			// keypress initialize buttons
			$( "body" ).bind( "keyup", function ( evt ) {

				if( evt.which == 39 ){
					//forward
					evt.preventDefault();

					$( ".biganav .fwd" ).addClass( "biganav_fwd" );
					window.setTimeout( "resetHover(' .biganav .fwd ', ' biganav_fwd ')" , 200 );

					if ( !__blocked && !__isvivi && !__notfotopage ) {
						//ajax
						$( self ).trigger( "gallery.next", evt );
					}else{
						//non ajax
						location.href = $( ".biganav .fwd" ).attr( "href" );
					}
				}else if( evt.which == 37 ){
					//backward
					evt.preventDefault();
					$( ".biganav .rwd" ).addClass("biganav_rwd");
					window.setTimeout( "resetHover(' .biganav .rwd ', ' biganav_rwd ')" , 200 );

					if ( !__blocked && !__isvivi && !__notfotopage) {
						//ajax
						$( self ).trigger( "gallery.prev" );
					}else{
						//non ajax
						location.href = $( ".biganav .rwd" ).attr( "href" );
					}
				}
			});

			if ( __blocked || __isvivi) {
				$( self ).trigger( "gallery.ready" );
			} else {
				// initialize buttons
				$( ".biganav .fwd, #gal_image" ).bind( "click", function ( evt ) {
					evt.preventDefault();
					$( self ).trigger( "gallery.next", evt );
				});
				$( ".biganav .rwd" ).bind( "click", function ( evt ) {
					evt.preventDefault();
					$( self ).trigger( "gallery.prev" );
				});
				// fetch data
				$.ajax({
					url: __ispreview ? __options.jsonsrc.preview + "/" + __win.pathname.replace( "/", "" ).split( "/" ).slice( 1 ).join( "/" ) + "?callback=?" : __options.jsonsrc.live + "/" + __win.pathname + "?callback=?",
					dataType: 'jsonp',
					success: function ( json ) {
						var __first = "";
						// special: first-image
						if(typeof json['first-image'] !== 'undefined') {
							if( $.trim($(json['first-image'].text).text()) != "" ) {
								__first = json['first-image'].text;
							}
						}
						// iterate over the json-data and build imageobjects from it
						$.each( json.blocks, function ( i, block ) {
							var o = {};
							$.each( block, function ( j, item )  {
								// title
								if(item.title != undefined) o.title = item.title;
								// text
								if( i == 0 && __first != "") {
									o.text = __first;
								} else if (item.text != undefined && $(item.text).text() !== "") {
									o.text = item.text;
								}
								// caption
								if(item.caption != undefined && $.trim(item.caption) !== "") o.caption = item.caption;
								// image
								if(item.image != undefined) {
									// image.path
									if(item.image.path != undefined) o.path = item.image.path.replace( __options.xmlsrc, __options.src );
									// bu
									if(item.image.bu != undefined && $.trim(item.image.bu) !== "") o.bu = item.image.bu;
									// copyright
									if(item.image.copyright != undefined) {
										if(item.image.copyright.value != undefined) {
											if( $.trim(item.image.copyright.value) != "©" ) {
												o.copyright = '<a class="copyright" href="'+item.image.copyright.link+'" target="_blank">'+item.image.copyright.value+'</a>';
											}
										} else {
											if( $.trim(item.image.copyright) != "©" ) {
												o.copyright = item.image.copyright;
											}
										}
									}
								}
							});
							__json[i] = o;
						});
						// i am ready
						$( self ).trigger( "gallery.ready" );
					} // end of callback
				});

			}

		});

		$( this ).bind("gallery.ready", function (evt) {
			if( __actualimage > 1 ) {
				showElement();
			} else {
				fixDimensions();
			}
		});

		$( this ).bind("gallery.next", function (evt, data) {
			if ( __actualimage < __max) {
				__actualimage++;
				showElement();
			} else {
				showWeitere();
			}
		});

		$( this ).bind("gallery.prev", function (evt) {
			if ( __actualimage - 1 > 0) {
				__actualimage--;
				showElement();
			} else {
				showWeitere();
			}
		});

		return this.each( function () {
			// start fetching images
			fixDimensions();
			__actualimage = getPageNumber();
			startGallery();
		});


	};


})(jQuery);
