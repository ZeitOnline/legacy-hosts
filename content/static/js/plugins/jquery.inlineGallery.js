(function ($) {
    /*
    * Zeit Online InlineGallery Plugin
    * unobstrusive image gallery with ajax loading pictures
    *
    * Copyright (c) 2011 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Nico Bruenjes
    * @version 3.2
	*
	*
    *
    */

	$.fn.inlineGallery = function ( options ) {

		var win = window,
		defaults = $.extend({
			json: {
				preview: "http://zip6.zeit.de/preview-json/",
				live: "http://json.zeit.de/"
			},
			img: {
				preview: "http://zip6.zeit.de:9000/cms/work",
				live: "http://images.zeit.de"
			},
			xml: "http://xml.zeit.de"
		}, options);

		getJsonSource = function () {
			var url = $("a img", this).parent().attr('href').replace("http://", "");

			if ( url.indexOf('localhost') > -1 ) {
				// bspw. localhost.zeit.de:8080/preview/digital/mobil/2014-10/biga-smartphone
				// ==> http://json.zeit.de/digital/mobil/2014-10/biga-smartphone
				url = url.replace(/localhost(\.)?(.*)?\:8080\/preview\//, "http://json.zeit.de/");

			} else if ( url.indexOf('zip6') > -1 || url.indexOf('cms-backend') > -1 ) {
				//bspw. cms-backend.zeit.de/preview/digital/mobil/2014-10/biga-smartphone
				// //preview-json/digital/mobil/2014-10/biga-smartphone
				url = url.replace(/(cms\-backend|zip6)\.zeit\.de\/preview/, 'http://$1.zeit.de/preview-json');
			} else {
				// bspw. www.zeit.de/digital/mobil/2014-10/biga-smartphone
				// ==> http://json.zeit.de/digital/mobil/2014-10/biga-smartphone
				url = url.replace(/(www\.)?zeit.de\//, 'http://json.zeit.de/');
			}

			return url;

		};

		return this.each( function(){

			var mid = ( Math.floor ( Math.random ( ) * 10000000 ) ),
				mysource = getJsonSource.call(this),
				status = win.location.hostname.indexOf("zip6") > -1 ? 'preview' : 'live',
				that = this,
				data = {},
				__json = [],
				count = 0,
				picture = 1;

			$(this).attr( "id", 'gal_' + mid);

			$(this).bind("dataReady", function( evt ) {
				count = data.blocks.length;
				if( count > 0) {
					var __first = "";
					// Houston, we have some data
					if( typeof data['first-image'] !== 'undefined' ) {
						if( $.trim($(data['first-image'].text).text()) !== "" ) {
							__first = data['first-image'].text;
						}
					}

					$.each( data.blocks, function ( i, block ) {
						var o = {};

						$.each( block, function ( j, item )  {

							if(typeof item.title !== "undefined") o.title = item.title;
							if( i === 0 && __first !== "") {
								o.text = __first;
							} else if (typeof item.text !== "undefined" && $(item.text).text() !== "") {
								o.text = item.text;
							}
							if(typeof item.caption !== "undefined" && $.trim(item.caption) !== "") o.caption = item.caption;
							if(typeof item.image !== "undefined") {
								if(typeof item.image.path !== "undefined") o.path = item.image.path.replace( defaults.xml, defaults.img[status] );
								if(o.path) {
									$( "<img>" ).attr( "src", o.path ); //preload image
								}
								if(typeof item.image.bu !== "undefined" && $.trim(item.image.bu) !== "") o.bu = item.image.bu;
								if(typeof item.image.copyright !== "undefined") {
									if(typeof item.image.copyright.value !== "undefined") {
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
								if ($('#bildrechte').size() > 0 && o.copyright !== "") {
									$('<li>' + o.copyright + '</li>').prependTo('#bildrechte ol');
								}
							};

						});
						__json[i] = o;
					});

					var me = evt.target;

					$( me ).on("click", ".fwd, img", function( evt ) {
						evt.preventDefault();
						if (picture < count) {
							 picture++;
						} else {
							picture = 1;
						}
						$(me).trigger("showPicture", false);
					});

					$( me ).on("click", ".rwd", function( evt ) {
						evt.preventDefault();
						if (picture - 1 > 0) {
							 picture--;
						} else {
							picture = count;
						}
						$(me).trigger("showPicture", false);
					});

					$(me).trigger("showPicture", true);

				}
			}); // end of dataReady-binding

			$(this).bind("showPicture", function( evt, notcount ){
				var myitem = __json[picture - 1],
					gallery_text_html = "<strong>" + picture + " von " + count + "</strong>",
					checkOutput = function ( item ) {
						return typeof item !== "undefined" ? "&nbsp;|&nbsp;" + item : "";
					};

				$( ".gal_text", this ).html(
					gallery_text_html +
					checkOutput(myitem.text) +
					checkOutput(myitem.caption) +
					checkOutput(myitem.copyright)
				);


				$( "a[target='_blank'] > img", this ).attr( "src", myitem.path );
				if (!notcount) {
					ZEIT.clickWebtrekk( "bgSlider" );
					ZEIT.clickIVW();
				}


			});

			$.ajax({
				url: mysource,
				dataType: 'jsonp',
				success: function(json) {
					data = json;
					$(that).trigger("dataReady");
				}
			});

		});

	};

})(jQuery);
