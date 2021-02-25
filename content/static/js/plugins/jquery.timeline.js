/**
* Zeit Online Timelineobject Plugin
* adds a widget for displaying timelined informations in articles
* 
* Copyright (c) 2011 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
* 
* @author Nico Bruenjes
* @version 1.0
*
*/
( function( $ ) {
	
	$.fn.timeline = function ( options ) {
		
		var defaults = $.extend({
			width: 240,
			pos: 0,
			rwdclass: "rwdnotactive",
			fwdclass: "fwd",
			easing: "swing",
			duration: 300
		}, options),
		__width = $( "dt", this ).size() * defaults.width,
		__stopright = ( __width - ( defaults.width * 2 ) ) * ( -1 ),
		__stopleft = 0,
		__objects = '<div class="timelineleftbutton navbutton ' + defaults.rwdclass + '"></div><div class="timelinerightbutton navbutton ' + defaults.fwdclass + '"></div><div class="timeline_collection" style="width:' + __width + 'px">';
		
		var that = this;
		
		var setClasses = function() {
			if( defaults.pos === __stopleft ) {
				$( ".timelineleftbutton" )
				.removeClass( "rwd" )
				.addClass( "rwdnotactive" );
			} else {
				$( ".timelineleftbutton" )
				.removeClass( "rwdnotactive" )
				.addClass( "rwd" );
			}
			if( defaults.pos == __stopright ) {
				$( ".timelinerightbutton" )
				.removeClass( "fwd" )
				.addClass( "fwdnotactive" );
			} else {
				$( ".timelinerightbutton" )
				.removeClass( "fwdnotactive" )
				.addClass( "fwd" );
			}
		};
		
		return this.each( function() {
			
			$( "dt", this ).each( function( i ) {
				var d = '<div class="timeline_item"><div class="timeline_title">';
				d += $( this ).html();
				d += '</div><div class="timeline_content">';
				d += $( this ).next( 'dd' ).html();
				d += '</div></div>';
				__objects += d;
			});
			__objects += "</div>";
			
			$( "dl", this ).replaceWith( $( __objects ) );
			$( this ).show(200);
			
			$( this ).on( "mousedown mouseup", ".navbutton", function( ) {
				$( this ).toggleClass( "pressed" );
			} );
			
			$( this ).on( "click", ".navbutton", function( evt ) {
				evt.preventDefault();
				if( $( evt.target ).hasClass( "fwd" ) ) {
					if ( defaults.pos > __stopright ) {
						defaults.pos = defaults.pos - defaults.width;
					}
					$( '.timeline_collection', that ).animate( {
						marginLeft: defaults.pos
					}, defaults.duration, defaults.easing );	
					ZEIT.clickIVW();
				} else if( $( evt.target ).hasClass( "rwd" ) ) {
					if( defaults.pos < __stopleft ) {
						defaults.pos = defaults.pos + defaults.width;
					}
					$( '.timeline_collection', that ).animate( {
						marginLeft: defaults.pos
					}, defaults.duration, defaults.easing );	
					ZEIT.clickIVW();
				}
				setClasses();
			});
			
			$('.timeline_collection').bind('touchstart', function() {
				if(event.touches.length == 1) {
					options.xstart = event.touches[0].pageX; 
				}
			});
			
			$('.timeline_collection').bind('touchmove', function() {
				options.xmoved = event.touches[0].pageX - options.xstart;
			});
			
			$('.timeline_collection').bind('touchend', function(){
				if(options.xmoved > 50) {
					// alert("left2right")
					$('.navbutton.rwd').click();
				} else if(options.xmoved < -50) {
					// alert("right2left")
					$('.navbutton.fwd').click();
				}
				options.xstart = 0;
				options.xmoved = 0;
			});
			
			$('.timeline_collection').bind('touchcancel', function(){
				options.xstart = 0;
				options.xmoved = 0;
			});
			
		} );
		
	};
	
})( jQuery );