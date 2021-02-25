(function ($) {

	$.fn.beforeAfter = function ( options ) {

		var options = $.extend({
			leftgap: 10,
			rightgap: 10,
			defaultgap: "50%",
			animate: false,
			startgap: 0,
			xray: false,
			data: {}
		}, options);

		var template = '<p class="copyright">%copyright</p><div class="imgBeforeAfter"></div><p class="caption">%caption</p>';


		var buildData = function() {
			options.data = {};
			for (var i = 0; i < this.attributes.length; i++) {
				var attrib = this.attributes[i];
				var name = attrib.name.replace("data-","").replace("-","");
				options.data[name] = attrib.value;
			}

			if(
				typeof options.data.img_left === "undefined"
				|| typeof options.data.img_right === "undefined"
				|| typeof options.data.width === "undefined"
				|| typeof options.data.height === "undefined"
			) {
				// not enough data, exit!
				return false;
			}

			var c = "%c1 | %c2";
			if(typeof options.data.copyright_left_text != "undefined") {
				if(typeof options.data.copyright_left_link != "undefined") {
					var l = '<a href="'+options.data.copyright_left_link+'">%c1</a>';
					c = c.replace("%c1", l);
				}
				c = c.replace("%c1", options.data.copyright_left_text);
			} else {
				c = c.replace("%c1 | ","");
			}

			if(typeof options.data.copyright_right_text != "undefined") {
				if(typeof options.data.copyright_right_link != "undefined") {
					var l = '<a href="'+options.data.copyright_right_link+'">%c2</a>';
					c = c.replace("%c2", l);
				}
				c = c.replace("%c2", options.data.copyright_right_text);
			} else {
				c = c.replace("%c2 ","");
			}

			options.data.copyright = c !== "" ? c : "";

			if(typeof options.data.startgap != "undefined") {
				options.defaultgap = options.data.startgap;
			}

			if( typeof options.defaultgap == "string" && options.defaultgap.lastIndexOf("%") ==  options.defaultgap.length - 1 ) {
				var f = Number(options.defaultgap.replace("%",""));
				options.startgap = options.data.width * f / 100;
			} else {
				options.startgap = options.defaultgap;
			}

			return true;
		};


		return this.each( function () {

			var self = $(this);
			if( !buildData.apply(this) ) return false; // exit if not enough dat is supplied

			var divs = $(template.replace("%copyright", options.data.copyright).replace("%caption", options.data.caption)).appendTo( this );
			var me = $(".imgBeforeAfter", this);
			var h = Number(options.data.height);
			var w = Number(options.data.width);

			me.css({'overflow': 'hidden', 'position': 'relative', 'cursor': "pointer", "width": w, "height": h});
			me.append('<div class="ba-mask"></div><div class="ba-bg"></div>');
			me.children('.ba-mask, .ba-bg').width(w).height(h);
			me.children('.ba-mask').css('backgroundImage','url(' + options.data.img_left + ')');
			me.children('.ba-bg').css('backgroundImage','url(' + options.data.img_right + ')');
			me.children('.ba-mask').animate({'width': w - options.startgap}, 400);

			me.bind("mousedown touchstart", function(e){
				e.preventDefault();
				var i = $(this);
				pos_img = i.offset()['left'];
				pos_mouse = e.pageX;		
				new_width = pos_mouse - pos_img;
				img_width = i.width();
				if (new_width > options.leftgap && new_width < (img_width - options.rightgap)) {			
					i.children('.ba-mask').animate({'width': new_width}, 100);
					options.animate = true;
				} else {
					i.children('.ba-mask').stop();
					options.animate = false;
				}
			})

			me.bind("mouseup touchend", function() {
				$(this).children('.ba-mask').stop();
				options.animate = false;
			})

			me.bind("mousemove touchmove", function( e ) {
				e.preventDefault();
				if(options.animate) {
					var i = $(this);
					$(this).children('.ba-mask').stop();
					pos_img = i.offset()['left'];
					pos_mouse = e.pageX;		
					new_width = pos_mouse - pos_img;
					img_width = i.width();
					if (new_width > options.leftgap && new_width < (img_width - options.rightgap)) {			
						i.children('.ba-mask').width(new_width);
					}	
				}
			});
			
			me.bind("mouseout touchcancel", function( e ){
				return false;
				e.preventDefault();
				e.stopPropagation();
			});
			
			
			if(options.data.xray) {
				$('<div class="ba-xray">Röntgen: <span>einschalten</span></div>')
				.insertBefore(me)
				.click( function( e ){
					e.preventDefault();
					var that = this;
					if(!options.xray) {
						options.xray = true;
						me.children('.ba-mask').animate({'width': w }, 400, function(){
							me.children('.ba-mask').fadeTo(400, 0.5);
							$("span", that).html("ausschalten");
						});
					} else {
						options.xray = false;
						me.children('.ba-mask').fadeTo(400,1, function(){
							me.children('.ba-mask').animate({'width': w - options.startgap}, 400);
							$("span", that).html("einschalten");
						});
					}
					
				});
			}

		});

	};

})(jQuery);