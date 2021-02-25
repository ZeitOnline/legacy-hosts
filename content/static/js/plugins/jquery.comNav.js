(function ($) {

    $.fn.comNav = function (settings) {

		var options = $.extend({
			comperpage: 8,
			comstart: 0,
			min: 2,
			url: "",
			mode: "",
			targettext: "Zu den Kommentarseiten: ",
			margin: 5,
			delay: 1000
		}, settings),
		shown = false,
		target, to;

		// wenn wir sonst nix zu tun haben, schreiben wa mal 'ne rekursive Funktion
		var checkTeiler = function(n) {
			if(n % 5 === 0) {
				return n;
			} else {
				n++;
				return checkTeiler(n);
			}
		};

		// heroisch leiten wir aus Texten auf der Seite unsere Zahlen ab
		var numberOfCommentPages = function() {
			var n = $('.numbers', that).first().text().match(/\d+\s?\/\s?\d+/)[0].split("/");
			options.comstart = Number(n[0].replace(" ",""));
			return Number(n[1].replace(" ",""));
		};

		var buildLink = function (count, start) {
			var loc = window.location,
			link = loc.protocol + "//" + loc.host + loc.pathname;
			var queries = ZEIT.getQuery( loc.search );
			if( options.mode == "seite-") {
				// fuer seitenschaltung
				if( link.search(/seite-\d+/) > -1 ) {
					link = link.replace(/seite-\d+/, "seite-" + count);
				} else {
					link = link + "/seite-" + count;
				}
				link = '<a href="' + link + '" ';
			} else {
				// für kommentarschaltung
				if ( queries ) {
					queries.commentstart = start;
				} else {
					queries = {commentstart: start};
				}
				link += '?' + $.param(queries) + "#comments";
				link = '<a href="' + link + '" ';
			}
			if( count == options.comstart ) {
				link += 'class="isactualcomment" ';
			}
			link += '>' + count + '</a>';
			return link;
		};

		// ach Du gute Guete
		var buildDiv = function(n) {
			var diff = checkTeiler(n) - n;
			var d = '<div class="commentnavoverlay" id="commentnavoverlay"><div class="closethis">'+ options.targettext +'</div>';
			for( var i=1; i <= n; i++ ) {
				var c = ((i-1) * options.comperpage) + 1;
				d += buildLink(i, c);
			}
			for( var j=1; j<=diff; j++ ) {
				d+='<span class="empty">&nbsp;</span>';
			}
			d += '</div>';
			if($('#commentnavoverlay').size() < 1) $(d).hide().appendTo("body");
		};

		var isinview = function ( elem, elemTop ) {
			var docViewTop = $(window).scrollTop(),
			docViewBottom = docViewTop + $(window).height(),
			elemBottom = elemTop + $(elem).height();

			return ( (elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
		};

		$( this ).bind( "comnav:open", function( evt, data ) {
			var $$ = $(evt.target),
			$overlay = $('#commentnavoverlay'),
			left = $$.offset().left + ( $$.width() / 2 ) - ( $overlay.width() / 2 ),
			top = $$.offset().top + $$.height() + options.margin;
			if ( ! isinview('#commentnavoverlay', top) ) {
				// show above evt.target
				top = $$.offset().top - $overlay.height() - ( options.margin * 2 );
			}
			$overlay
			.hide()
			.css({
				left: left,
				top: top
			})
			.show(200, function () {
				shown = true;
			});
		});

		$( this ).bind( "comnav:close", function( evt, data ) {
			to = clearTimeout(to);
			to = setTimeout(function(){
				var ps = $(target).parentsUntil( '#commentnavoverlay' );
				if( ps.size() > 0 ) {
					if( $.inArray(that.get(0), ps) == -1 ) {
						$('#commentnavoverlay').hide();
					}
				}
			}, 1000);
		});

        var that = this;

        return this.each(function () {
			// temporäre Deaktivierung auf Schlagworseiten
			if( window.location.href.search("/schlagworte/") > -1) {
				return;
			}
			$("body").bind("mousemove", function(evt) {
				target = evt.target;
			});
			$( document ).on( "mouseleave", '#commentnavoverlay', function () {
				$( that ).trigger("comnav:close");
			});
			var number = numberOfCommentPages();
			if(number > options.min) {
				// build the hidden div
				buildDiv(number);
				// eventinize
				$( '.numbers', this )
				.css( 'cursor', 'pointer' )
				.bind( 'mouseenter', function( evt ) {
					$( this ).trigger( "comnav:open" );
				})
				.bind( 'mouseleave', function( evt ) {
					$( this ).trigger( "comnav:close" );
				});
			} else {
				return false;
			}
        });
    };

})(jQuery);