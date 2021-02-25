(function ($) {    
    /*
    * Zeit Online Gallery Plugin
    * unobstrusive image gallery with ajax loading pictures
    * 
    * Copyright (c) 2009-2011 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Nico Bruenjes
    * @version 3.11
	*
	*
	* Der Teil für fullsize-Bildergalerien wurde inzwischen
	* in ein neues Plugin (nugallery) ausgelagert, der Code
	* bleibt aber hier, um als legacy-Lösung für alter Galerien
	* bspw. auf community.zeit.de herzuhalten.
    * 
    */
	
	var __imagenumber = 0,
	__win = window.location,
	__doc = document,
	__referrer = "",
	__actualpage = __win.href.search(/\/seite-\d/) > -1 ? __win.pathname.substring( __win.pathname.lastIndexOf("seite-") + 6 ) : 1,
	__actualimage = Number( __win.hash.replace( "#", "" ) ) > 1 ? Number( __win.hash.replace( "#", "" ) ) : __actualpage,
	__jsonPreview = "http://zip6.zeit.de/preview-json/", 
	__jsonUrl = "http://json.zeit.de/",
	__ispreview = __win.hostname.indexOf( "zip6" ) > -1,
	__isvivi = __win.hostname.indexOf( "vivi" ) > -1,
	__images = [],
	__json = [],
	__first = "",
	__title = $("#gal_title").text(),
	methods = {
		init: function( options ) {
			
			var defaults = $.extend({
				blocked: [],
				blockScript: "gallery.blocked.ressorts.js",
				isinline: this.hasClass( "inlinebiga" ),
				scriptUrl: __ispreview ? "http://zip6.zeit.de/zjs/" : "http://scripts.zeit.de/static/js/",
				src: __ispreview ? "http://zip6.zeit.de:9000/cms/work" : "http://images.zeit.de",
				xmlsrc: "http://xml.zeit.de",
				ressorts: {
					ressort: $('body').attr("data-ressort"),
					subressort: $('body').attr("data-sub_ressort")
				}
			}, options),
			self = this, 
			options = defaults;
					
			jsonsource = function () {
				if ( !defaults.isinline ) {
					return __ispreview ? __jsonPreview + "/" + __win.pathname.replace( "/", "" ).split( "/" ).splice( 1 ).join( "/" ) + "?callback=?" : __jsonUrl + __win.pathname + "?callback=?";
				} else {
					// todo inline gallery
					var url = $("a img", self).parent().attr('href').replace("http://", "");
					if ( __ispreview ) {
						url = url.replace(/zip6\.zeit\.de\/{0,1}[^\/]+\//gi, __jsonPreview);
					} else {
						url = url.replace(/(www\.)?zeit.de\//gi, __jsonUrl);
					}
					return url + "?callback=?";
				}
			};
			
			isendpage = function() {
				return $("#contentFlow").size() > 0 ? true : false;
			};		
						
			return this.each( function () {
				$('.back2article').hide();
				var cid = escape(__win.pathname);
				if( __doc.referrer.search( /zeit\.de/ ) != -1 && !ZEIT.cookieRead( cid ) ) {
					ZEIT.cookieCreate( cid, __doc.referrer);
				}
				if ( ZEIT.cookieRead( cid ) ) {
					$('.back2article').show().children("a").attr("href", ZEIT.cookieRead( cid ));
				}
				// initialize for all galleries and fallback
				$( "body" ).bind( "gallery.init", function ( e ) {
					$( "#fwd, #gal_image, #inlinebiga a[target='_blank']" ).bind( "click", function ( e ) {
						if ( !isendpage() ) {
							e.preventDefault();
							methods.nextPicture.call( self, options );
						}
					});
					$( "#rwd" ).bind( "click", function ( e ) {
						if ( !isendpage() ) {
							e.preventDefault();
							methods.prevPicture.call( self, options );
						}
					});
					$.getJSON( jsonsource(), function(json) {
						if ( json ) {
							console.debug(json)
							__imagenumber = json.blocks.length;
							__data = json.blocks;
							
							if(typeof json['first-image'] !== 'undefined') {
								if( $.trim($(json['first-image'].text).text()) != "" ) {
									__first = json['first-image'].text;
								}
							}
							
							$.each( json.blocks, function ( i, block ) {
								var o = {};
								
								$.each( block, function ( j, item )  {
									
									//if(item.name != undefined) o.name = item.name;
									console.debug(item.title)
									if(item.title != undefined) o.title = item.title;
									if( i == 0 && __first != "") {
										o.text = __first;
									} else if (item.text != undefined && $(item.text).text() !== "") {
										o.text = item.text;
									}
									if(item.caption != undefined && $.trim(item.caption) !== "") o.caption = item.caption;
									if(item.image != undefined) {
										if(item.image.path != undefined) o.path = item.image.path.replace( options.xmlsrc, options.src );
										if(o.path) {
											$( "<img>" ).attr( "src", o.path ); //preload image
										}
										if(item.image.bu != undefined && $.trim(item.image.bu) !== "") o.bu = item.image.bu;
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
										// append inline gallery copyrights to copyright menue
										if ( options.isinline ) {
											if ($('#bildrechte').size() > 0 && o.copyright !== "") {
												$('<li>' + o.copyright + '</li>').prependTo('#bildrechte ol');
											}
										}
									};
								
								});
								__json[i] = o;
							});
							//methods.preloadImages.call( self, options );
							if ( options.isinline || __actualimage > 1) methods.showPicture.call( self, options, true );
						}
					});
				});
				
				
				if ( !defaults.isinline ) {
					methods.fitGallery.call( $( "#gal_image" ) );
				}
				
				// check for blocklist
				if ( !defaults.isinline ) {
					if( !ZEIT.getQueryVar("endbiga") ) {
						$.ajax({
						  	url: defaults.scriptUrl + defaults.blockScript,
						  	dataType: "script",
						  	success: function () {
								defaults.blocked = $blocked;
								//defaults.ressorts = getRessorts();
								var isblocked = $.inArray( defaults.ressorts[ "ressort" ], defaults.blocked ) < 0 ? false : true;						
								if ( !isblocked && !__isvivi ) {
									$( "body" ).trigger( "gallery.init" );
								}
							}
						});
					}
				} else {
					$( "body" ).trigger( "gallery.init" );
				}
			});
			
		},
		endpicture: function () {
			var u = "http://" + __win.host + __win.pathname;
			u = u.replace(/seite-\d/, '');
			if( u.lastIndexOf("/") < u.length-1 ) {
				u += "/";
			}
			window.location.href = u + "weitere";
		},
		fitGallery: function () {
			var w = $( this ).width();
			if ( w > 620 ) {
				$( "#caption" ).addClass( "made940" );
			} else {
				$( "#caption" ).removeClass( "made940" );
			}
			if ( w < 620 ) {
				$( this ).addClass( "made620" );
			}
			if ( w > 620 && w < 940 ) {
				$( this ).addClass( "made940" );
			}
		},
		nextPicture : function ( options ) { 
			if ( __actualimage < __imagenumber) {
				__actualimage++;
				methods.showPicture.call( this, options );
			} else {
				__actualimage = 1;
				if ( !options.isinline ) {
					methods.endpicture();
				} else {
					methods.showPicture.call( this, options );
				}
			}
		},
		prevPicture: function ( options ) {
			if ( __actualimage - 1 > 0) {
				__actualimage--;
				methods.showPicture.call( this, options );
			} else {
				__actualimage = __imagenumber;
				if ( !options.isinline ) {
					methods.endpicture();
				} else {
					methods.showPicture.call( this, options );
				}
			}
		},
		showPicture: function ( options, notcount ) {
			var myitem = __json[__actualimage - 1];
			console.debug(myitem)
			if ( !options.isinline) {
				__win.hash = __actualimage;
				$( "#gal_text, #caption, #gal_image, #x_of_y" ).hide();
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
				$( "#x_of_y" ).html( __actualimage + " von " + __imagenumber );
				$( "#gal_image" )
				.removeClass( "made940" )
				.removeClass( "made620" )
				.attr( "src", myitem.path )
				.one( "load", function( e ) {
					methods.fitGallery.call( $( e.target ) );
					$( "#gal_text, #caption, #gal_image, #x_of_y" ).show();
				});
			} else {
				if( $(this).parent().hasClass("article") ) {
					$("#gal_copyright").html(myitem.copyright);
				} else {
					$("#gal_copyright").hide();
				}
				
				// testing if the node.text is empty or keeps an empty paragraph
				if( $(myitem.text).text() != "" ) {
					$( "#gal_text" ).html( "<strong>" + __actualimage + " von " + __imagenumber + "</strong>&nbsp;|&nbsp;" + myitem.text );
				} else {
					if(typeof myitem.caption != "undefined") {
						$( "#gal_text" ).html( "<strong>" + __actualimage + " von " + __imagenumber + "</strong>&nbsp;|&nbsp;" + myitem.caption );
					} else {
						$( "#gal_text" ).html( "<strong>" + __actualimage + " von " + __imagenumber + "</strong>");
					}
				}
				$( "#inlinebiga a[target='_blank'] > img" ).attr( "src", myitem.path );
			}
			if (!notcount) {
                ZEIT.clickWebtrekk( options.isinline ? "bgSlider" : "biga" );
                ZEIT.clickIVW();
            }
		}
	};
	
    $.fn.gallery = function ( method ) {
        if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.gallery' );
		}
    };
    
})(jQuery);