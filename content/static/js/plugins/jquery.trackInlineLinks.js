/*
* Zeit Online track inline links plugin
*
* Copyright (c) 2015 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* @author Anika Szuppa
*/

(function( $ ) {
	$.fn.trackInlineLinks = function( options ) {

		//define object
		var linkAction = {
			//get number of page
			getPage: function(){
				
				path = window.location.pathname;
				ispage = path.indexOf( '/seite-' );
				page = '1'
				
				if ( ispage > -1 ) {
					page = path.substr( ispage + 7, path.length);
				}

				return page;
			},
			//get position of paragraph
			getIndex: function( element, page ){
				
				index = $( ".article-body > p" ).index( element );

				if ( page != '1' ) {
					index++;
				}

				return index;

			},
			//bind event
			init: function( $link ){

				$link.on( 'click', function( event ){
					para = $( this ).parents( 'p' );
					page = linkAction.getPage();
					index = linkAction.getIndex( para, page );
					mode = 'stationaer.intext.' + index  + '/' + page + '..' + $( this ).text() + '|' + $( this ).attr( 'href' );
					ZEIT.clickWebtrekk( mode );
				})
			}
		}

		//run through elements
		return this.each( function() {

			if ( $( this ).attr( 'class' ) != 'excerpt' ) {
				links = $( this ).find( 'a' );
				$.each( links, function( key, value ){
					linkAction.init( $( value ) );
				});
			}
		});

	};
})( jQuery );