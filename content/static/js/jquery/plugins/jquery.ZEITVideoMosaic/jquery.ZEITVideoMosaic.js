/**
 * ZEITVideoMosaic
 * Supplies a extended Video Search for ZEIT ONLINE Video Application
 *
 * @author Brünjes, Nico
 * @date 2010-03-24
 * @requires jQuery Version 1.3
 *
 * @copyright (c) 2010 ZEIT ONLINE
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function ($) {

    $.fn.ZEITVideoMosaic = function (options) {
    
    	var defaults = $.extend({
			solradress: 'http://www.zeit.de/solr/select/?',
			mode: "",
			idstring: "http://video.zeit.de/video/",
			searchdefault: 'Suchbegriff eingeben',
			querytype: ' type:"zeit.brightcove.interfaces.IVideo" -expires:[* TO NOW] published:"published"',
			queryrows: 15,
			querysuffix: '&version=2.2&indent=on&wt=json&fl=teaser_title,id,graphical-preview-url-large',
			ressorttext: 'Alle Videos aus dem Ressort ',
			serientext: 'Alle Videos aus der Serie ',
			suchetext: 'Alle Videos zum Suchbegriff ',
			novideotext: 'Leider konnten keine Videos gefunden werden.',
			minheight: 490,
			imgwidth: 140,
			imgheight: 79,
			start: 0,
			sortoption: 'created desc',
			throbbersrc: 'http://images.zeit.de/static/img/ajax-loader.gif'
		}, options);
		
		buildquery = function(obj) {
			// return a formatted query to the solr server
			var q = "";
			switch(obj.type) {
				case "ressort": 
					q = encodeURIComponent('ressort:"'+obj.value+'"');
					$('#mosaictitle').html(defaults.ressorttext + '<span>„' + obj.value + '”</span>');
					break;
				case "serie": 
					q = encodeURIComponent('serie:"'+obj.value+'"');
					$('#mosaictitle').html(defaults.serientext + '<span>„' + obj.value + '”</span>');
					break;
				default:
					q = encodeURIComponent('"'+obj.value+'"');
					$('#mosaictitle').html(defaults.suchetext + '<span>„' + obj.value + '”</span>');
			}
			if(typeof obj.start == 'undefined') obj.start = 0;
			var query = defaults.solradress;
			query += 'q=' + q + encodeURIComponent(defaults.querytype);
			query += '&sort=' + defaults.sortoption + '&start='+obj.start+'&rows='+defaults.queryrows+defaults.querysuffix;
			return(query);
		};
		
		pager = function(num, start, obj) {
			$('.pagenav', that).hide();
			var pages = Math.ceil(num/defaults.queryrows);
			var page = Math.ceil(start/defaults.queryrows) + 1;
			if(pages > 1) {
				var left = start === 0 ? $('<span class="rwd_inactive" title="Vorherige Seite"></span>') : $('<a href="#" class="rwd" title="Vorherige Seite">« Previous Page</a>');
				var right = page == pages ? $('<span class="fwd_inactive" title="Nächste Seite"></span>') : $('<a href="#" class="fwd" title="Nächste Seite">Next Page »</a>');
				var text = $('<span class="numbers">Seite ' + page + '/' + pages + '</span>');
				$('.pagenav', that).hide().empty().append(left).append(text).append(right).fadeIn(400);
				$('.pagenav a.rwd', that).click(function(evt) {
					evt.preventDefault();
					obj.start = obj.start-defaults.queryrows;
					$(this).trigger('solrquery', obj);
				});
				$('.pagenav a.fwd', that).click(function(evt) {
					evt.preventDefault();
					obj.start = obj.start +defaults.queryrows;
					$(this).trigger('solrquery', obj);
				});
			}
		};
		
		init = function() {
			$('#resultlist').height(defaults.minheight);
			// add listener to form element
			$("#vq").val(defaults.searchdefault);
			$('form', that).submit(function(evt) {
				evt.preventDefault();
				var v = $("#vq").val();
				if(v != defaults.searchdefault) $(this).trigger("solrquery", {type: "q", value: v});
			});
			// add listeners to ressortlist
			$('.ressorts a', that).click(function(evt){
				evt.preventDefault();
				$(this).trigger("solrquery", {type: "ressort", value: $(this).text()});
			});
			// add listener to select item
			$('#serieselect option:first').attr('selected', 'selected');			
			$('#serieselect').change(function(evt) {
				evt.preventDefault();
				if($(this)[0].selectedIndex !== 0)
				$(this).trigger("solrquery", {type: "serie", value: $("option:selected", this).attr('value')});
			});
		};
		
		videoID = function(id) {
			return id.replace(defaults.idstring, "vid");
		};
		
		buildgrid = function(docs) {
			var ul = $('<ul>').addClass('teaserlist t6').hide();
			$.each(docs, function(index, value) {
				var img = $('<img src="' + value['graphical-preview-url-large'] + '" width="' + defaults.imgwidth + '" height="' + defaults.imgheight + '">');
				var li = '<li class="box"><a href="#" class="playmedia" data-mediaid="' + videoID(value.id) + '"><img src="' + value['graphical-preview-url-large'] + '" width="' + defaults.imgwidth + '" height="' + defaults.imgheight + '"><div class="title">' + value.teaser_title + '</div></a></li>';
				$(li).appendTo(ul);
			});
			$("li:nth-child(5n+1)",ul).css("clear","left");
			return(ul);
		};
		
		var that = this;
        
        return this.each( function() {
			$("#vq").focus(function(){
				$(this).val('');
			});
			// hide pager
			$('.pagenav', that).css('visibility', 'hidden');
        	// initialise
			init();
			// bind the search event
			$(this).bind('solrquery', function(e, obj) {
				var myquery = buildquery(obj);
				$('#resultlist').css('background', "url(" + defaults.throbbersrc + ") no-repeat 50% 50%");
				$('#resultlist').empty();
				$('.pagenav', that).css('visibility', 'hidden');
				$.ajax({
					url: myquery,
					dataType: 'jsonp',
					jsonp: 'json.wrf',
                                        jsonpCallback: "jsonp13371337",
					success: function(data) {
						if(data) {
							// buildgrid
							if(data.response.numFound > 0) {
								var markup = buildgrid(data.response.docs);
								$("li:nth-child(5n)",markup).addClass('last');
								// paginate
								pager(data.response.numFound, data.response.start, obj);
								// hide throbber
								$('#resultlist').css('background', "none");
								// show grid
								$(markup).appendTo('#resultlist').show(400);
								if(data.responseHeader.params.q.indexOf('serie:') < 0) {
									$('#serieselect')[0].selectedIndex = 0;
								}
								$("#vq").val(defaults.searchdefault).blur();
								$('.pagenav', that).css('visibility', 'visible');
							} else {
								// no results
								var err = '<div class="novideos"><div>' + defaults.novideotext + '</div></div>';
								$('#resultlist').css('background', "none");
								$(err).hide().appendTo('#resultlist').fadeIn(1000);
								$('#serieselect')[0].selectedIndex = 0;
								$("#vq").val(defaults.searchdefault);
							}
						}
					}
				});
				
			});
			// fire first query
			$(this).trigger('solrquery', {type: "ressort", value: 'Politik'});
        });
        
    };

})(jQuery);

