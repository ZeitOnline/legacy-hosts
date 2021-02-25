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
    $.fn.ZEITComments = function (options) {
        
        var options = $.extend({
            sendurl: "http://community.zeit.de/services/json",
            suffix: "?callback=?",
            replytext: "Antwort auf: ",
            limit: 1500,
            sendable: false,
            linktext: "Vielen Dank! Ihr Beitrag wird in wenigen Momenten veröffentlicht. Er erscheint dann <span>bei den neuesten Kommentaren.</span>",
            gotolink: "",
			throbber: false,
			cbhtml: '<div class="newcomments" style="width:550px;height:220px;margin:0;padding:0"><div class="commentform" style="padding:10px"><h3>Kommentar als bedenklich melden</h3><p>Warum halten Sie diesen Kommentar für bedenklich?</p><p style="margin-top:5px"><textarea id="dtext" style="width:500px;height:120px"></textarea></p><p><button id="dbut">Abschicken</button> <span style="font-size:11px">oder <a href="#" id="dlink">abbrechen und Fenster schliessen</a></span></p></div></div>',
            titlewarning: "Bitte geben Sie Ihrem Kommentar eine aussagekräftige Überschrift",
			reply: {},
			uid: ZEIT.cookieRead('drupal-userid') || 0
        }, options);
        
        // print out a formatted date
        displayDate = function (date) {
            var ret = {};
            ret.day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            ret.month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth()+1) : date.getMonth()+1;
            ret.year = date.getFullYear();
            ret.hour = date.getHours();
            ret.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            return ret.day + '.' + ret.month + '.' + ret.year + " um " + ret.hour + ":" + ret.minute;
        };
        
        // check if sendbutton should be enabled or vice versa
        enDisable = function() {
            $("#send_msg").attr("disabled", "disabled");
            options.sendable = false;
            var messlength = $('#comment_msg').val().length;
			var subj = $('#subject_msg').val();
			subj = subj.replace(/^\s+/, '').replace(/\s+$/, '');
            var subjectlength = subj.length;
			
            if(messlength > 0 & messlength <= options.limit & subjectlength > 4 & $('#subject_msg').val() !== options.titlewarning) {
                $("#send_msg").attr("disabled", "");
                options.sendable = true;
            }
        };
        
        resetForm = function () {
            $('#comment_msg').val("");
            $('#subject_msg').val(options.titlewarning);
            $("#send_msg").attr("disabled", "disabled");
        };

		escapeText = function (text) {
			return text.replace(/#/g, '%23').replace(/&/g, '%26').replace(/\?/g, '%3F').replace(/\+/g, '%2B');
		};

		$.fn.throbber = function () {
			if(options.throbber) {
				options.throbber = false;
				$('.commentthrobber').hide();
			} else {
				options.throbber = true;
				var w = $(this).width()+40; // adding padding
				var h = $(this).height()+60; // adding padding
				$('.commentthrobber').css({
					position: "absolute",
					width: w,
					height: h,
					left: 0,
					top: 0,
					zIndex: 10000,
					background: "#333 url(http://images.zeit.de/static/img/commentthrobber.gif) 50% 50% no-repeat",
					opacity: 0.5
				}).show();
			}
		};
		
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
					$.fn.colorbox({html:options.cbhtml, open:true, width:"580px", height:"325px", overlayClose: false, close: "Schliessen"}, function() {
						$('#dbut').attr("disabled", "disabled");
						
						$('#dtext').keyup(function(){
							if($('#dtext').val() !== "") {
								$('#dbut').attr("disabled", "");
							} else {
								$('#dbut').attr("disabled", "disabled");
							}
						});
						$('button#dbut').click(function(evt){
							evt.preventDefault();
							if($('#dtext').val() !== '') {
								d.note =  escapeText($.trim($('#dtext').val().substring(0, options.limit)));
								$.getJSON(options.sendurl + options.suffix, 'method=flag.flagnote&flag_name='+d.flag_name+'&uid='+d.uid+'&content_id='+d.content_id+'&note='+$.json.serialize(d.note), function (data) {
					            	if(data) {
	                                	if(!data['#error']) {
	                                        $this.parent().html("Ihre Meldung wird an die Redaktion weitergeleitet.");
											$.fn.colorbox.close();
	                                 	} else {
											console.info(data);
											$.fn.colorbox.close();
										}
	                            	}
	                            });
							}
						});
					});
				} else { // Kommentar empfehlen
					var recomtext = d.flag_name == "kommentar_empfohlen" ? "Empfohlener Kommentar" : "Meine Empfehlung";
					$.getJSON(options.sendurl + options.suffix, 'method=flag.flag&flag_name='+d.flag_name+'&content_id='+d.content_id, function (data) {
                        if(data) {
                            if(!data['#error']) {
								if(d.flag_name=="leser_empfehlung") alert("Danke! Sie haben diesen Kommentar empfohlen. Ihre Empfehlung erscheint in Kürze.");
                               	$this.parent().parent().addClass("recommended");
                               	$('<div class="is-flagged">'+recomtext+'</div>').insertBefore($this.parent());
                               	$this.parent().remove();
                            }
                        }
                    });
				}
			}
		};
        
        return this.each(function () {
			$('a#dlink').live("click", function(evt) {
				evt.preventDefault();
				$.fn.colorbox.close();
			});
            if($('.newestcomments', this).size() > 0) {
                options.gotolink = $('.newestcomments', this).attr('href');
            }
            // reset the form on load
            resetForm();
            // flag comments
			$(".comment_tools a", this).live("click", function(evt) { $(this).flagComment(evt); });
            // show replies
            $('.showresponses').click(function() {
                $(this).parent().children('.response').toggle(100);
                var scopa = $(this).parent();
                if ($('.showresponses span', scopa).text() == 'anzeigen') {
                    $('.showresponses span', scopa).text('verbergen');
                } else {
                    $('.showresponses span', scopa).text('anzeigen');
                }
                ZEIT.clickIVW();
                ZEIT.clickWebtrekk('comments_reaction');
            });
            // catch clicks on Reply-Links ("Antworten")
            $(".reply a").live("click", function (evt) {
                evt.preventDefault();
                // set text
                var parent = $(this).parents("li");
                options.reply.id = $(this).attr("rel");
                options.reply.subject = $(".subject:first", parent).text();
                options.reply.text = $("p:first", parent).text();
                options.reply.date = parent.next(".user").find(".date").text();
                options.reply.name = parent.next(".user").find(".name cite a").text();
                console.debug(options.reply);
                $('#isreplyto').html(options.replytext + options.reply.subject);
                // scroll to form
                $("html,body").stop().animate({scrollTop: $('#commentform').offset().top}, {speed: 800} );
            });
            $('#subject_msg').focus(function() {
				if($(this).val() == options.titlewarning) {
					$(this).val("");
				} else {
					$(this).select();
				}
                enDisable();
            }).blur(function () {
				if($(this).val().length === 0) $(this).val(options.titlewarning);
                enDisable();
            });
            $('#comment_msg').focus(function() {
                enDisable();
            }).blur(function () {
                enDisable();
            });
            // counting characters
            $('#comment_msg').keyup(function () {
                var l = options.limit - $(this).val().length;
                if(l < 21 & l > 10) {
                    $("#charcount").css("color", '#900').html(l);
                } else if(l < 11) {
                    $("#charcount").css("color", '#ff0000').html(l);
                } else {
                    $("#charcount").css("color", '#777').html(l);
                }
                // activate button?
                enDisable();
            });
            // added testing for subject_msg
            $('#subject_msg').keyup(function () {
                enDisable();
            });
            $("#commentform .button").click(function (evt) {
                evt.preventDefault();
                // disable button to prevent double posting
                $(this).attr("disabled", "disabled");
                // trigger submission
                $(this).parents("form").trigger("submit");
            });
            // check form and send
            $('"#commentform', this).submit(function (evt) {
                evt.preventDefault();
				$(".commentform").throbber();
                // get actual date and time
                var date = new Date();
                // record the comment
                var text = $('#comment_msg').val();
                var subject = $("#subject_msg").val();
                // send data
                if(options.sendable) {
                    var date = new Date();
                    // dragons up here: do we really need to escape &, ? and #
                    var d = {
                        nid: $("#node_id").val(),
						uid: options.uid,
                        comment: escapeText($.trim(text.substring(0, options.limit))),
                        subject: escapeText($.trim(subject))
                    };
                    if(options.reply.id) {
                        d.pid = options.reply.id;
                    }
					try {
                    	$.getJSON(options.sendurl + options.suffix, 'method=comment.save&comment='+$.json.serialize(d), function (data) {
	                        if(data) {
	                            if(!data['#error']) {
	                                // delete form content
	                                resetForm();
	                                // show that we are working
	                                var fertig = $('<div></div>').html(options.linktext).addClass('commentissent').hide();
									$(".commentform").throbber();
	                                $(fertig).insertBefore($('#commentform')).show(100);
	                                if(options.gotolink !== '') {
	                                    $('span', fertig).addClass('gotolink').click(function (evt) {
	                                        evt.preventDefault();
	                                        window.location.href = options.gotolink;
	                                    }).hover(function () {
	                                        $(this).css("cursor", "pointer");
	                                    }, function () {
	                                        $(this).css("cursor", "default");
	                                    });
	                                }
	                                //$("#commentform").fadeOut(40);
	                                ZEIT.clickIVW();
	                                ZEIT.clickWebtrekk('submit_comment');  
	                            } else {
									throw "Es ist ein Problem beim Speichern des Kommentares aufgetreten.";
								}
	                        } else {
								throw "Es ist ein Problem beim Versand des Kommentars aufgetreten.";
							}
	                    });
	           		} catch(e) {
						alert(e + " Bitte versuchen Sie es zu einem spaeteren Zeitpunkt erneut.");
						$(".commentform").throbber();
					}
                } else {
                    enDisable();
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