(function ($) {
    /*
    * Zeit Online Comment Plugin
    * unobstrusive Comment deliviering into our community system
    * 
    * Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Nico Bruenjes
    *
    */
    $.fn.comments = function (options) {

		var options = $.extend({
			sendurl: "http://community.zeit.de/services/json",
			sendurl_checkusername: "http://community.zeit.de/user/usernamecheck",
			//sendurl: "http://community.staging.zeit.de/services/json",
			//sendurl_checkusername: "http://community.staging.zeit.de/user/usernamecheck",
			//sendurl: "http://com.zondev.com/services/json",
			//sendurl_checkusername: "http://com.zondev.com/user/usernamecheck",
            suffix: "?callback=",
			title: {
				min: 4,
				warning: "Bitte geben Sie Ihrem Kommentar eine aussagekräftige Überschrift"
			},
			limit: 1500,
			climit: 600,
			replytext: "Antwort auf: ",
			uid: ZEIT.cookieRead('drupal-userid') || 0,
			cbhtml: '<div class="newcomments" style="width:550px;height:220px;margin:0;padding:0"><div class="commentform" style="padding:10px"><h3>Kommentar als bedenklich melden</h3><p>Warum halten Sie diesen Kommentar für bedenklich?</p><p style="margin-top:5px;text-align:right;padding-right:28px"><span id="ccharcount">600</span></p><p><textarea id="dtext" style="width:500px;height:120px"></textarea></p><p style="font-size:12px;margin-bottom:10px">Nutzen Sie dieses Fenster, um Verstöße gegen die <a href="http://www.zeit.de/administratives/2010-03/netiquette" target="_blank">Netiquette</a> zu melden. Wenn Sie einem Kommentar inhaltlich widersprechen möchten, <a href="http://community.zeit.de/user/login/remote" id="loginbut">melden Sie sich gerne an</a> und beteiligen Sie sich an der Diskussion.</p><p><button id="dbut">Abschicken</button> <span style="font-size:11px">oder <a href="#" id="dlink">abbrechen und Fenster schliessen</a></span></p></div></div>'
		}, options);
		
		var escapeText = function (text) {
			return text.replace(/#/g, '%23').replace(/&/g, '%26').replace(/\?/g, '%3F').replace(/\+/g, '%2B');
		}
		
		var trim = function ( str ) {
			return str.replace(/^\s+/, '').replace(/\s+$/, '');
		};

		var generateJSONPNumber = function() {
   	        return (1361462065627 + Math.floor(Math.random()*101));
   	      };

		$("#commentform").bind( "comments.enable", function ( e ) {
			// checking if the form is sendable,
			// namely, if all pre-conditions are met
			$( "#send_msg" ).attr( "disabled", "disabled" );
			var d = $( "#username_check" ).length; // content of the comment title
			var c = $( "#user_name" ).val(); // content of the comment title
			var u = $( "#username_check_status" ).text(); // content of the comment title
			var s = $( "#subject_msg" ).val(); // content of the comment title
			var l = $( "#comment_msg" ).val().length; // lengt of the comment
			if ((d == 0 || trim( u ) == 'Verfügbar :)') && s !== options.title.warning && trim( s ).length > options.title.min && l > 0  && l <= options.limit ) {
				$( "#send_msg" ).removeAttr( "disabled" );
			}
      if (trim( c ).length > 2) {
        $("#user_name_check_go").css('color', '#000'); 
        $("#user_name_check").css('color', '#000'); 
        $("#user_name_check").css('cursor', 'pointer'); 
      } else {
        $("#user_name_check_go").css('color', '#bbb'); 
        $("#user_name_check").css('color', '#ccc'); 
        $("#user_name_check").css('cursor', 'default'); 
      }
		}).bind( "comments.reset", function ( e ) {
			$( "#comment_msg" ).val( "" );
            $( "#subject_msg" ).val( options.title.warning );
            $( "#send_msg" ).attr( "disabled", "disabled" );
		});

    $('#user_name_check').click(function() {
        var s = $( "#subject_msg" ).val(); // content of the comment title
			  var l = $( "#comment_msg" ).val().length; // lengt of the comment
        var username = $('#user_name').val();
         $('#user_name_check_go').hide();
         $('#waiter').show();
        $.ajax({
            url: options.sendurl_checkusername+"?user_name="+username,
            jsonpCallback: 'jsonp' + generateJSONPNumber(),
            dataType: 'jsonp',
            success: function(data) {
            $('#waiter').hide();
            $('#user_name_check_go').show();
              if(data.message == 'Username available') {
                $('#user_name').css('color', 'green');
                $('#user_name').css('background-color', '#aaeeaa');
                $('#username_check_status').text('Verfügbar :)');
                if (s !== options.title.warning && trim( s ).length > options.title.min && l > 0  && l <= options.limit ) {
                  $('#send_msg').removeAttr( "disabled", "disabled" );
                }
              } else {
                $('#user_name').css('color', 'red');
                $('#user_name').css('background-color', '#eeaaaa');
                $('#send_msg').attr( "disabled", "disabled" );
                $('#username_check_status').text('Leider nicht verfügbar oder ungültig :(');
              }
            },
            error: function() {
              $('#send_msg').attr( "disabled", "disabled" );
              alert('Überprüfung war leider nicht möglich. Bitte (später) nochmal versuchen.');
            }
        });
        return false;
    });

		$.fn.flagComment = function(evt) {

			if($(this).parent().hasClass('kommentar_empfohlen') || $(this).parent().hasClass('kommentar_bedenklich') || $(this).parent().hasClass('leser_empfehlung')) {
				evt.preventDefault();
				var d = {
					uid: options.uid,
					flag_name: $(this).parent().attr("class"),
					content_id: $(this).attr("rel"),
					note: ""
	            };
				$this = $(this);
				if(d.flag_name == 'kommentar_bedenklich') { // kommentar als bedenklich melden mit Begruendung

					$.colorbox({html:options.cbhtml, open:true, width:"580px", height:"430px", overlayClose: false, close: "Schliessen"}, function() {
						$('#dbut').attr("disabled", "disabled");
						
						$('#dtext').keyup(function(){
							var l = options.climit - $(this).val().length;
							if(l < 21 & l > 10) {
								$("#ccharcount").css("color", '#900').html(l);
							} else if(l < 10) {
								$("#ccharcount").css("color", '#ff0000').html(l);
							} else {
								$("#ccharcount").css("color", '#777').html(l);
							}
							
							// activate button?
							if($('#dtext').val() !== "" && $('#dtext').val().length < (options.climit + 1)) {
								$('#dbut').removeAttr("disabled");
							} else {
								$('#dbut').attr("disabled", "disabled");
							}
						});
						
						if(options.uid > 0) {
							$("#loginbut").text("nutzen Sie das Kommentarformular").attr("href", "#commentform").click(function(e){
								e.preventDefault();
								$.colorbox.close();
								var p = $this.parents("li");
								$(".reply a", p).click();
							});
						} else {
							$('#loginbut').click(function(e){
								e.preventDefault();
								$('a#drupallogin').click();
							});
						}
						
						$('button#dbut').click(function(evt){
							evt.preventDefault();
							if($('#dtext').val() !== '') {
								d.note =  escapeText($.trim($('#dtext').val().substring(0, options.limit)));

								$.ajax({
				        			url: options.sendurl + '?method=flag.flagnote&flag_name='+d.flag_name+'&uid='+d.uid+'&content_id='+d.content_id+'&note='+$.json.serialize(d.note),
				        			jsonpCallback: 'jsonp' + generateJSONPNumber(),
				                    dataType: 'jsonp',
				                    success: function(data) {
				                    	if(data) {
		                                	if(!data['#error']) {
		                                        alert("Danke! Ihre Meldung wird an die Redaktion weitergeleitet.");
												$.colorbox.close();
		                                 	} else {
												$.colorbox.close();
											}
		                            	}
				                    }
				                 });

							}
						});
					});
				} else { // Kommentar empfehlen

					var recomtext = d.flag_name == "kommentar_empfohlen" ? "Empfohlener Kommentar" : "Meine Empfehlung";

						$.ajax({
			        			url: options.sendurl + '?method=flag.flag&flag_name='+d.flag_name+'&content_id='+d.content_id,
			        			jsonpCallback: 'jsonp' + generateJSONPNumber(),
			                    dataType: 'jsonp',
			                    success: function(data) {
			                    	if(data) {
			                            if(!data['#error']) {
											if(d.flag_name=="leser_empfehlung") alert("Danke! Sie haben diesen Kommentar empfohlen. Ihre Empfehlung erscheint in Kürze.");
			                               	$this.parent().parent().addClass("recommended");
			                               	$('<div class="is-flagged">'+recomtext+'</div>').insertBefore($this.parent());
			                               	$this.parent().remove();
			                            }
			                        }
			                    }
			                  });

				}
			}
		};
		
		return this.each( function () {
			$('.showresponses').click(function() {
				if($(this).parent().hasClass("antwortauf")) {
					var h = $(this).find("a").attr("href");
					window.location.href = h;
				} else {
					$(this).siblings('.response').toggle(100);
	                var scopa = $(this).parent();
	                if ($('.showresponses span', scopa).text() == 'anzeigen') {
	                    $('.showresponses span', scopa).text('verbergen');
	                } else {
	                    $('.showresponses span', scopa).text('anzeigen');
	                }
	                ZEIT.clickIVW();
	                ZEIT.clickWebtrekk('comments_reaction');
				}
            });
			$( document ).on("click", 'a#dlink', function(evt) {
				evt.preventDefault();
				$.colorbox.close();
			});
			$( ".comment_tools", this ).on("click", "a", function(evt) { $(this).flagComment(evt); });
			$(".reply a").bind( "click", function ( e ) {
                e.preventDefault();
                // set text
                var parent = $(this).parents("li");
                $( "#parent_id" ).val( $( this ).attr( "rel" ) );
                $('#isreplyto').html( options.replytext + $( ".subject:first", parent ).text() );
                // scroll to forms
                $("html,body").stop().animate({scrollTop: $('#commentform').offset().top}, {speed: 800} );
            });
			$( "#commentform" ).trigger( "comments.reset" );
			$("#subject_msg").bind( "focus", function(){
				if($(this).val() == options.title.warning) {
					$(this).val("");
				} else {
					$(this).select();
				}
				$( "#commentform" ).trigger( "comments.enable" );
			}).bind( "blur keyup", function( e ) {
				if($(this).val().length === 0) $(this).val(options.title.warning);
				$( "#commentform" ).trigger( "comments.enable" );
			}).bind( "keyup", function( e ) {
				$( "#commentform" ).trigger( "comments.enable" );
			});
			$('#comment_msg').bind( "keyup", function () {
                var l = options.limit - $(this).val().length;
                if ( l < 21 & l > 10 ) {
                    $( "#charcount" ).css( "color", "#900" ).html( l );
                } else if( l < 11 ) {
                    $( "#charcount" ).css( "color", "#ff0000" ).html(l);
                } else {
                    $( "#charcount" ).css( "color", "#777" ).html(l);
                }
                $( "#commentform" ).trigger( "comments.enable" );
            });
			$('#user_name').bind( "keyup", function () {
                if ($(this).val().length > 2) {
                  $( "#commentform" ).trigger( "comments.enable" );
                }
            });
		});

    };

	 /**
	 * labs_json Script by Giraldo Rosales.
	 * Version 1.0
	 * Visit www.liquidgear.net for documentation and updates.
	 *
	 *
	 * Copyright (c) 2009 Nitrogen Design, Inc. All rights reserved.
	 * 
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 * 
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 **/

	/**
	 * HOW TO USE
	 * ==========
	 * Serialize:
	 * var obj = {};
	 * obj.name = "Test JSON";
	 * obj.type = "test";
	 * $.json.serialize(obj); //output: {"name":"Test JSON", "type":"test"}
	 * 
	 * Deserialize:
	 * $.json.deserialize({"name":"Test JSON", "type":"test"}); //output: object
	 * 
	 */

	$.json = {
	    serialize:function(value, replacer, space) {
	        var i;
	        gap = '';
	        var indent = '';

	        if (typeof space === 'number') {
	            for (i = 0; i < space; i += 1) {
	                indent += ' ';
	            }

	        } else if (typeof space === 'string') {
	            indent = space;
	        }

	        rep = replacer;
	        if (replacer && typeof replacer !== 'function' &&
	                (typeof replacer !== 'object' ||
	                 typeof replacer.length !== 'number')) {
	            throw new Error('JSON.serialize');
	        }

	        return this.str('', {'': value});
	    },

	    deserialize:function(text, reviver) {
	        var j;
	        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	        function walk(holder, key) {
	            var k, v, value = holder[key];

	            if (value && typeof value === 'object') {
	                for (k in value) {
	                    if (Object.hasOwnProperty.call(value, k)) {
	                        v = walk(value, k);
	                        if (v !== undefined) {
	                            value[k] = v;
	                        } else {
	                            delete value[k];
	                        }
	                    }
	                }
	            }
	            return reviver.call(holder, key, value);
	        }

	        cx.lastIndex = 0;

	        if (cx.test(text)) {
	            text = text.replace(cx, function (a) {
	                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            });
	        }

	        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	            j = eval('(' + text + ')');
	            return typeof reviver === 'function' ? walk({'': j}, '') : j;
	        }

	        throw new SyntaxError('JSON.parse');
	    },

	    f:function(n) {
	        return n < 10 ? '0' + n : n;
	    },

	    DateToJSON:function(key) {
	        return this.getUTCFullYear() + '-' + this.f(this.getUTCMonth() + 1) + '-' + this.f(this.getUTCDate())      + 'T' + this.f(this.getUTCHours())     + ':' + this.f(this.getUTCMinutes())   + ':' + this.f(this.getUTCSeconds())   + 'Z';
	    },

	    StringToJSON:function(key) {
	        return this.valueOf();
	    },

	    quote:function(string) {
	        var meta = {'\b': '\\b','\t': '\\t','\n': '\\n','\f': '\\f','\r': '\\r','"' : '\\"','\\': '\\\\'};
	        var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	        escapable.lastIndex = 0;
	        return escapable.test(string) ?
	            '"' + string.replace(escapable, function (a) {
	                var c = meta[a];
	                return typeof c === 'string' ? c :
	                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            }) + '"' :
	            '"' + string + '"';
	    },

	    str:function(key, holder) {
	        var indent='', gap = '', i, k, v, length, mind = gap, partial, value = holder[key];

	        if (value && typeof value === 'object') {
	            switch((typeof value)) {
	                case 'date':
	                    this.DateToJSON(key);
	                    break;
	                default:
	                    this.StringToJSON(key);
	                    break;
	            }
	        }

	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }
	        switch (typeof value) {
	            case 'string':
	                return this.quote(value);
	            case 'number':
	                return isFinite(value) ? String(value) : 'null';
	            case 'boolean':
	            case 'null':
	                return String(value);
	            case 'object':
	                if (!value) {
	                    return 'null';
	                }
	                gap += indent;
	                partial = [];

	                if (Object.prototype.toString.apply(value) === '[object Array]') {
	                    length = value.length;

	                    for (i = 0; i < length; i += 1) {
	                        partial[i] = this.str(i, value) || 'null';
	                    }

	                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
	                    gap = mind;
	                    return v;
	                }

	                if (rep && typeof rep === 'object') {
	                    length = rep.length;
	                    for (i = 0; i < length; i += 1) {
	                        k = rep[i];
	                        if (typeof k === 'string') {
	                            v = this.str(k, value);
	                            if (v) {
	                                partial.push(this.quote(k) + (gap ? ': ' : ':') + v);
	                            }
	                        }
	                    }
	                } else {
	                    for (k in value) {
	                        if (Object.hasOwnProperty.call(value, k)) {
	                            v = this.str(k, value);
	                            if (v) {
	                                partial.push(this.quote(k) + (gap ? ': ' : ':') + v);
	                            }
	                        }
	                    }
	                }

	                v = partial.length === 0 ? '{}' :
	                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
	                            mind + '}' : '{' + partial.join(',') + '}';
	                gap = mind;
	                return v;
	        }
	    }
	};
        
})(jQuery);
