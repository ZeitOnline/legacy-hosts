(function($) {
  /*
    * Zeit Online Audio Plugin
    * depends on jquery.jplayer
    *
    * Copyright (c) 2011 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Marc Tönsing
    * Version 1.0
    */
  $.fn.audio = function (defaults) {
    
    var  mydebug = function(thingtodebug) {
      if(window.console) console.log(thingtodebug);
    }

    return this.each (function (uid) {
      if($.isFunction($.jPlayer)){
        var skinPath = cpath +'audioplayerskin/jplayer.blue.monday.small.css';
        var swfPath = cpath +'audioplayerskin/';
        var mp3url = $(this).attr('href');
        var org_classes =  $(this).attr('class').toString();
        var playlist_markup = '';
        var metadata = $(this).html();

        /* appending skin stylesheet into the DOM for the first instance of the player. */
        if(uid === 0) {
          $('head').append('<link rel="stylesheet" href="' + skinPath + '" type="text/css" />');
        }

        /* receiving the mp3 url from the a tag */
        if(metadata) {
          playlist_markup = '<div class="jp-playlist" id="jp_playlist_' + uid + '"><ul><li>' + metadata + '</li></ul></div>';
        }
        $(this).wrap('<div class="zolaudioplayer" id="zolaudioplayer_' + uid + '">');
        $(this).after('<div class="jp-audio-small ' + org_classes + '"><div class="jp-type-single"><div style="line-height: 0; font-size: 0;" id="jplayer_' + uid + '"></div><div class="jp-interface" id="jp_interface_' + uid + '"><ul class="jp-controls"><li><a tabindex="1" class="jp-play" href="#">play</a></li><li><a tabindex="1" class="jp-pause" href="#">pause</a></li><li><a tabindex="1" class="jp-stop" href="#">stop</a></li><li><a tabindex="1" class="jp-video-play" href="#">jp-video-play</a></li><li><a tabindex="1" class="jp-mute" href="#">mute</a></li><li><a tabindex="1" class="jp-unmute" href="#">unmute</a></li></ul><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div><div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div><div class="jp-current-time"></div><div class="jp-duration"></div></div>' + playlist_markup + '</div></div>');

        /* call jplayer plugin with our parameters */
        $("#jplayer_" + uid).jPlayer({
          ready: function () {
            $(this).jPlayer("setMedia", {
              mp3: mp3url
            });
          },
          swfPath: swfPath,
          solution: 'html, flash',
          supplied: 'mp3',
          preload: false,
          cssSelectorAncestor: '#jp_interface_' + uid,
          errorAlerts: false,
          warningAlerts: false
        })
        .bind($.jPlayer.event.play, function() { // Using a jPlayer event to avoid both jPlayers playing together.
          $(this).jPlayer("pauseOthers");
        });
        
        // remove original anker tag
        $(this).remove();
      }else{
        mydebug('jPlayer Plugin is not loaded');
      }
    });
  };
})(jQuery);