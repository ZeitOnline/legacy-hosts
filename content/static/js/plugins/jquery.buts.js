/**
* Zeit Online Socialservicebutton Plugin
* adds a widget for posting ZEIT ONLINE articles to different social service
* 
* Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
* 
* @author Nico Bruenjes
* @version 3.0
*
*/
(function($) {
	
	$.fn.buts = function (options) {
		
		var loc = window.location, 
		doc = document, 
		options = $.extend({
			services: {
				twitter: { text: "Artikel twittern", url: "http://twitter.com/" },
				facebook: { text: "Artikel in Facebook aufnehmen", url: "http://www.facebook.com/sharer.php" },
				buzz: { text: "Artikel buzzen", url: "http://www.google.com/reader/link" },
				delicious: { text: "Artikel in del.icio.us ablegen", url: "http://del.icio.us/save" },
				studivz: { name: "StudiVZ", text: "Artikel bei StudiVZ Freunden empfehlen", url: "http://www.studivz.net/Suggest/Selection/" },
				mrwong: { name: "Mr. Wong", text: "Artikel in Mister Wong ablegen", url: "http://www.mister-wong.de/index.php" }
			},
			widgettitle: "Diesen Artikel bookmarken bei:",
			close: "Schließen",
			supertitle: $("#main.article .supertitle").text() || "",
			title: $("#main.article .title").text() || "",
			desc: ( $( "meta[name='description']" ).size() > 0 ) ? $( "meta[name='description']" ).attr( "content" ) : "",
			uri: "http://" + loc.hostname + loc.pathname,
			api: "http://api.bit.ly/v3/shorten",
			apiuser: "zeitonlinetools",
			apikey: "R_962edb74ef51b736414f042c3e826e5d",
			apiformat: "json",
			happy: false
		}, options);
		
		var buildlist = function () {
			var p = $(that).parent(),
			div = "<div id='bms'>";
			$.ajax({
				url: options.api,
				dataType: 'jsonp',
				data: { login: options.apiuser, apiKey: options.apikey, longUrl: options.uri, format: options.apiformat },
				success: function( data ) {
					if(data.status_code == 200) {
						options.uri = data.data.url;
						
						div += "<div class='bmsinner'><p>" + options.widgettitle + "</p>";
						for (var key in options.services) {
							var title = (options.supertitle !== "") ? options.supertitle + ": " + options.title : options.title;
							var addi = options.services[key].url;
							if(key == "twitter") {
								addi += "?status=" + encodeURIComponent(title) + "%20" + encodeURIComponent(options.uri) + encodeURIComponent(" via @zeitonline");
							} else if (key == "facebook") {
								addi += "?src=bm&v=5";
								addi += "&u=" + encodeURIComponent(options.uri);
								addi += "&t=" + encodeURIComponent(title);
							} else {
								addi += "?action=addurl&v=5&noui&jump=yes&prov=ZEIT%20ONLINE&srcTitle=ZEIT%20ONLINE&srcURL=" + encodeURIComponent("http://www.zeit.de");
								addi += "&u=" + encodeURIComponent(options.uri) + "&url=" + encodeURIComponent(options.uri) + "&bm_url=" + encodeURIComponent(options.uri);
								addi += "&t=" + encodeURIComponent(title) + "&title=" + encodeURIComponent(title) + "&desc=" + encodeURIComponent(title) + "&bm_description=" + encodeURIComponent(title);
								addi += "&snippet=" + encodeURIComponent(options.desc) + "&notes=" + encodeURIComponent(options.desc);
							}
							div += "<a target='_blank' class='widget_icon " + key + "' href='" + addi + "'>" + (options.services[key].name === undefined ? key : options.services[key].name) + "</a>";
						}
						div += "<div id='bm_close' class='closer'>" + options.close + "</div>";
						div += "</div></div>";
						$(div).hide().appendTo(p);
						$("#bms").toggle(200);
					}
				}
			});
		};
			
		var that = this;
		
		return this.each( function() {

			$(this).click(function (evt) {
				evt.preventDefault();
				if($("#bms").size() < 1) buildlist();
				$("#bms").toggle(200);
			});
			
			$( document ).on("click", "#bm_close", function(){
				$("#bms").hide(200);
			});
			
		});
		
	};

})(jQuery);