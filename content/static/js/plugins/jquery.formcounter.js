(function($) {
	
	$.fn.formcounter = function ( defaults ) {
		
		var options = $.extend({
			limit: 3000
		}, defaults);
		
		return this.each( function () {
			
			var lol = options.limit - $(this).val().length;
			
			var htm = '<span id="charcount" style="float: right;">' + lol + '</span>';
			$( this ).parent().parent().prepend( htm );
			
			
			$( this ).bind( 'keyup focus blur', function( evt ) {
				var dis = "disabled";
				if( $( this ).val().length <= options.limit ) {
					dis = "";
				}
				$( '#edit-submit, #edit-preview' ).attr( "disabled", dis );
				$( '#edit-submit, #edit-preview' ).prop( "disabled", dis );
				if( evt.type == "keyup" ) {
					var l = options.limit - $(this).val().length;
	                if ( l < 21 & l > 10 ) {
	                    $( "#charcount" ).css( "color", "#900" ).html( l );
	                } else if( l < 11 ) {
	                    $( "#charcount" ).css( "color", "#ff0000" ).html( l );
	                } else {
	                    $( "#charcount" ).css( "color", "#777" ).html( l );
	                }
				}
			});
			
		});
		
	};
	
})(jQuery);