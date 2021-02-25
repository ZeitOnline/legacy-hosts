/*
*
* loader.js - ZEIT ONLINE
* supplies the ZEIT.namespace and functions for page startup
*
* HINT/WARNING:
* Supplied with this file is the ZEIT.namespace which we deliver as a toolbox for building
* pages with ZEIT ONLINE habits. We encourage you to use this library and will keep it backwards
* compatible. ALL OTHER PIECES OF THIS FILE ARE NOT GURANTEED, ARE DELIVERED AS IS AND ALWAYS
* WITHOUT ANY PREVIOUS MESSAGE OBJECT OF CHANGE. JUST DON'T USE THEM.
*
*/

/*global jQuery */
if(typeof window.www_root == 'undefined') window.www_root = "http://www.zeit.de";
/* Defend prototype.js incombabilities */
jQuery.noConflict();
jQuery.ajaxSetup({
  cache: true
});
/* set document.domain for live server */
if( window.location.href.search(/zeit\.de/) > -1 && window.location.href.search(/zeit\.de\/sport\/olympia-2014-sotschi\/sotschi-ticker/) == -1 ) document.domain = "zeit.de";
var ord = Math.random() * 10000000000000000;
/* browser detection pattern by http://detectmobilebrowsers.com/ */
window.myagent = navigator.userAgent||navigator.vendor||window.opera;
window.is_mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|mobile.+firefox|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(window.myagent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(window.myagent.substr(0,4));
window.is_iPad = navigator.userAgent.match(/iPad/i) !== null;
window.is_touchable = !!('ontouchstart' in window);
window.is_galaxyTab = navigator.userAgent.match(/GT-P1000/i) !== null  || navigator.userAgent.match(/HTC_Flyer/i) !== null || navigator.userAgent.match(/Playbook/i) !== null;
window.is_Flyer = navigator.userAgent.match(/HTC_Flyer/i) !== null;
window.is_Playbook = navigator.userAgent.match(/Playbook/i) !== null;

/* hide firebug console from IE */
(function(){
	var i, methods = [
		'assert',
		'clear',
		'count',
		'debug',
		'dir',
		'dirxml',
		'error',
		'group',
		'groupCollapsed',
		'groupEnd',
		'info',
		'log',
		'profile',
		'profileEnd',
		'time',
		'timeEnd',
		'timeStamp',
		'trace',
		'warn'];

	if ( typeof window.console === 'undefined' ) {
		window.console = {};
	}

	for ( i = methods.length; i--; ) {
		if ( typeof window.console[ methods[i] ] !== 'function' ) {
			window.console[ methods[i] ] = function(){};
		}
	}
})();


/* the ZEIT namespace */
var ZEIT = function() {
	return {
		/**
		 * Interface for Brightcove-Player Flash-Plugin "ZEITPixel"
		 *
		 * provides a basic interface to react on actions regarding video loading and playback,
		 * and facilitates easier debugging…
		 *
		 * the plugin passes an object named 'videoInfo' to many of the functions.
		 * the 'videoInfo' provides the following keys:
		 *  - videoId
		 *  - videoTitle
		 *  - videoRessort (optional)
		 *  - playerName
		 */
		BrightcovePlayerPlugin : {
			pluginInitialised : function (argument) {
				if ( ZEIT.getQueryVar( "debug" ) == "true" ) {
					console.info("[Brightcove - ZEITPixel Plugin] plugin initialised");
				}
			},
			playerLoaded : function(videoInfo) {
				if ( ZEIT.getQueryVar( "debug" ) == "true" ) {
					console.info("[Brightcove - ZEITPixel Plugin] player loaded\n ->", videoInfo);
				}
			},
			videoStarted : function(videoInfo) {
				var ivwCode = ( videoInfo.videoRessort ? videoInfo.videoRessort + "/" : "diverses/" ) + "video";
				ivwCode = ivwCode.toLowerCase();
				ZEIT.clickIVW( true, ivwCode );
				ZEIT.clickWebtrekk( "redaktion.video...video../" + videoInfo.videoId + "/" + videoInfo.videoTitle + "/START" );

				if ( ZEIT.getQueryVar( "debug" ) == "true" ) {
					console.info("[Brightcove - ZEITPixel Plugin] video started\n ->", videoInfo);
					console.info("[Brightcove - ZEITPixel Plugin] IVW 2.0 code: ", ivwCode);
				}
			},
			videoCompleted : function(videoInfo) {
				ZEIT.clickWebtrekk( "redaktion.video...video../" + videoInfo.videoId + "/" + videoInfo.videoTitle + "/COMPLETE" );

				if ( ZEIT.getQueryVar( "debug" ) == "true" ) {
					console.info("[Brightcove - ZEITPixel Plugin] video completed\n ->", videoInfo);
				}
			}
		},
		hideEmptyAdPlace:function(place) {
			if(window.hiddenplaces===undefined) window.hiddenplaces = {};
			if(jQuery("img[src*='dot.gif']",'#'+place).size() > 0 || jQuery("img[src*='817-grey.gif']",'#'+place).size() > 0 || jQuery("img[src*='zeit_zaehlpixel_kinderzeit']",'#'+place).size() > 0) {
				jQuery('#'+place).hide();
				window.hiddenplaces[place]=true;
			} else window.hiddenplaces[place]=false;
		},
		checkBlocker: function( elemId ) {
			if( jQuery( '#' + elemId + ":hidden").size() > 0 ) {
				if(window._gaq !== undefined ) {
					var path = 'www.zeit.de' + document.location.pathname;
					_gaq.push(['_trackEvent', 'abd', path]);
				}
			}
		},
		clickCC: function () { // loads 1 pixel for internal click counter
			// http://cc.zeit.de/cc.gif?banner-channel=kultur/film/gallery&r='+escape(document.referrer)+'&rand='+Math.random()*10000000000000000
			var ccimg = document.createElement('img');
			var bc = jQuery("body").attr('data-banner_channel') || "";
			var src = 'http://cc.zeit.de/cc.gif?banner-channel=' + bc + '&r=' + escape(document.referrer) + '&rand=' + Math.random()*10000000000000000;
			ccimg.src = src;

		},

		clickIVW: function ( internalcounter, ivwVersion2Code ) { // loads 1 IVW-Counting Pixel
			/**
			 * IVW Version 2.0
			 * the data that we're pushing to the IVW looks something like this:
			 *   iam_data = {
			 *     "st" : "zeitonl", // site/domain
			 *     "cp" : "<xsl:value-of select="$iam_data_cp" />", // seitencode
			 *     "sv" : "ke", // Es wird keine Befragungseinladung ausgeliefert.
			 *     "co" : "URL: <xsl:value-of select="$doc_path" />" // comment
			 *   }
			 */
			if( typeof window.iom !== 'undefined' && typeof window.iam_data !== 'undefined' ) {
				var iam_data = window.iam_data;
				if ( ivwVersion2Code ) {
					iam_data.cp = ivwVersion2Code;
				}
				window.iom.c(iam_data,1);
				if ( internalcounter ) {
					ZEIT.clickCC();
				}
			}
		},
		clickWebtrekk: function (mode) { // sends a click to webtrekk via wt_sendinfo function and to ga via gaq push

			ZEIT.clickWebtrekkOnly( mode );
			ZEIT.clickGA( ['_trackEvent', mode, "click"] );

		},
		clickWebtrekkOnly: function ( linkId ) {
			if( typeof linkId == 'undefined') return;
			if( window.wt !== undefined ) {
				if( window.wt.sendinfo !== undefined ) window.wt.sendinfo({linkId: linkId});
			}
		},
		clickGA: function( ga_array ) {
			if(window._gaq !== undefined ) {
				_gaq.push( ga_array );
			}
		},
		cookieCreate: function (name,value,days, domain) {
			if(arguments.length < 4) domain = "zeit.de";
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				expires = "; expires="+date.toGMTString();
			}
			document.cookie = name+"="+value+expires+"; path=/; domain="+domain;
		},
		cookieRead: function (name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		cookieErase: function (name) {
			ZEIT.cookieCreate(name,"",-1);
		},
		cookieSearchName: function (partofname) {
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				c = c.split("=");
				if(c[0].indexOf(partofname) > -1) return c[0];
			}
			return null;
		},
		crunchCookies: function () {
			if((ZEIT.cookieRead('drupal-username') === null && ZEIT.cookieRead('drupal-userid') !== null) || (ZEIT.cookieRead('drupal-username') !== null && ZEIT.cookieRead('drupal-userid') === null)) {
				var sessname = ZEIT.cookieSearchName('SESS');
				if(sessname !== null) {
					ZEIT.cookieErase(sessname);
					ZEIT.cookieErase('drupal-username');
					ZEIT.cookieErase('drupal-userid');
					ZEIT.cookieErase('drupal-useradmin');
					ZEIT.cookieErase('drupal-author');
				}
			}
		},
		getQuery: function(query) {
			if(query !== '') {
				query = query.substring(1);
				var parms = query.split('&');
				return ZEIT.splitQuery(parms, "=");
			}
			return false;
		},
		getQueryVar: function(varname) {
			var q = ZEIT.getQuery(window.location.search);
			return q[varname] !== undefined ? q[varname] : false;
		},
		getRessort: function(){
			return $('body').attr('data-ressort') || "undefined";
		},
		loadAndClickTracker: function( trackingId, callback ) {
			jQuery.getScript('//scripts.zeit.de/static/js/webtrekk/webtrekk_v3.js', function() {
				var popupwebtrekk = new webtrekkV3({
					linkTrack : "standard",
					heatmap : "0",
					linkTrackAttribute: "id"
				});
				window._gaq = window._gaq || [];
				window._gaq.push(['_setAccount', 'UA-18122964-1']);
				window._gaq.push(['_setDomainName', '.zeit.de']);
				(function() {
					var src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
					jQuery.getScript(src, function() {
						ZEIT.clickWebtrekk( trackingId );
						if (callback && typeof(callback) === "function") {
							callback();
						}
					});
				})();
			});
		},
		logWebtrekkAppend: function(appendstring) {
			var wt_kennung = false;
			wt_kennung = window.Z_WT_KENNUNG+'.'+appendstring;
			if(wt_kennung !== false) {
				var wt_px = '<img alt="" height="1" src="http://zeit01.webtrekk.net/981949533494636/wt.pl?p=205,'+wt_kennung+'&#38;ov=&#38;cr=&#38;oi=&#38;ba=&#38;co=&#38;qn=&#38;ca=&#38;pi=&#38;st=&#38;cd=&#38;cg=&#38;zeit='+ZEIT.throwDice()+'" width="1"/>';
				jQuery("#wrapper").append(jQuery(wt_px));
			}
		},
		mobileRedirect: function() {
			var isTicker = location.href.match(/sport\/(.*)?(-ticker)/i);
			var ticker_mobile = "http://phpscripts.zeit.de/fussball-ticker/mobile/";

			var mobile_alternative = jQuery( "head > meta[ property = 'zeit:mobile_alternative' ]" ).attr( "value" );

			if ( location.href.indexOf( ZEIT.stripTrailingSlash(mobile_alternative) ) != -1 ) {
				// matched the mobile_alternative, bumping out of redirect
				return;
			}

			if( ZEIT.onMobileWhitelist() ) { //jump out if on the whitelist
				return;
			}
			if( ZEIT.getQueryVar("mobile") == "false" ) { // set www cookie and jump out if back with ?mobile=false
				ZEIT.cookieCreate('ZEITmobile', 'www', (1/24/3), 'zeit.de'); // cookieCreate expects a *day* as 3rd parameter, to get 20 minutes, first divide by 24 to get 1 hour, then divide by 3
				return;
			}

			/*
				the ':8080/preview' in the regex shall allow for local testing via /etc/hosts modification
				just let 127.0.0.1 point to www.zeit.de in your /etc/hosts and you are able to test
				mobile redirects way easier
			*/
			var lhome = /(www\.)?zeit.de(\:8080\/preview)?\/index/gi,
				lprint = /(www\.)?zeit.de(:8080\/preview)?\/\d{4}\/\d{2}\/[^(index)]+/gi,
				lressort = /(www\.)?zeit.de(:8080\/preview)?\/(politik|wirtschaft|meinung|gesellschaft|kultur|wissen|digital|studium|karriere|lebensart|reisen|auto|mobilitaet|sport)\/(.+)/gi,
				direction = ZEIT.cookieRead('ZEITmobile'),
				confirmtext = 'Wollen Sie zur mobilen Version dieser Seite wechseln?';

			if( mobile_alternative || lhome.test(location.href) || lprint.test(location.href) || lressort.test(location.href) ) {

				switch( direction ) {
					case 'www':
					// wants desktop, do nothing
					return false;

					case 'mobile':
					// wants mobile, redirect
					if ( mobile_alternative ) {
						// redirecting to mobile alternative
						window.location.href = mobile_alternative;
					} else if( location.hostname == 'blog.zeit.de' ) {
						return false;
					} else if ( isTicker !== null ) {
						// spezialweiterleitungen auf die Fussballticker
						window.location.href = ticker_mobile + isTicker[1] + "-ticker.html"  + window.location.hash;
					} else {
						ZEIT.redirect('http://mobil.zeit.de/');
					}
					break;

					default:
					// don't know, ask for it…
					if( !confirm(confirmtext) ) {
						// abbrechen… to desktop page
						ZEIT.cookieCreate( 'ZEITmobile', 'www', 7, 'zeit.de' );
						jQuery( window ).bind('load', function() {
							ZEIT.clickWebtrekk('hp.mobile.jspopup.nichtzurmobil...../index');
						});
						return false;
					} else {
						// ok, go mobile, but count first
						ZEIT.cookieCreate( 'ZEITmobile', 'mobile', 7, 'zeit.de' );
						if ( mobile_alternative )  {
							window.location.href = mobile_alternative;
						} else if(location.hostname == 'blog.zeit.de') {
							if( ZEIT.cookieRead('ZEITmobile') == 'mobile' ) window.location.reload();
							return false;
						} else if ( isTicker !== null ) {
							// spezialweiterleitungen auf die Fussballticker
							location.href = ticker_mobile + isTicker[1] + "-ticker.html"  + window.location.hash;
						} else {
							ZEIT.loadAndClickTracker('hp.mobile.jspopup.zurmobil...../index', function(){
								ZEIT.redirect('http://mobil.zeit.de/');
							});
						}
					}
				}

			}
		},
		onMobileWhitelist: function() {
			var whitelist = [
				"/datenschutz/malte-spitz-vorratsdaten",
				"/datenschutz/malte-spitz-data-retention",
				"/politik/regierungsbarometer",
				"/wirtschaft/arbeitslosigkeit",
				"/digital/ifg-anfragen",
				"/wissen/2013-05/zeit-mathetest-aufgaben",
				"/politik/deutschland/abgeordnetenbilanz",
				"/2013/33/wahlistik-wahlprognosen-koalitionen",
				"/wirtschaft/2013-08/deutschlandduell-energiewende",
				"/sport/2013-09/100mio",
				"/politik/deutschland/2013-09/twitter-monitor"
			];
			for ( var i = 0, l = whitelist.length; i < l; i++ ) {
				re = new RegExp(whitelist[i]);
				if( re.test( document.location.href ) ) return true;
			}
			return false;
		},
		redirect: function(target) {
			try {
				var r = /http:\/\/(www\.)?zeit.de(?:\:8080\/preview)?\/(.*)/gi,
					d = r.exec(document.location.href);
				if(d) location.href = target + d[2];
			} catch(e) {
				console.error("redirect fail", e);
			}
		},
		resizeIframe: function( id, height ) {
			document.getElementById( id ).height = parseInt( height, 10 );
		},
		splitQuery: function(parms, splitchar) {
			var qsParm = {};
			for (var i=0; i<parms.length; i++) {
				var pos = parms[i].indexOf(splitchar);
				if (pos > 0) {
					var key = parms[i].substring(0,pos);
					var val = parms[i].substring(pos+1);
					qsParm[key] = val;
				}
			}
			return qsParm;
		},
		throwDice: function() {
			return Math.random()*10000000000000000;
		},
		xmlsrc: function() {
			var r = "http://xml.zeit.de/data/navigation.xml";
			if(window.zipserver == 'zip6') {
				r = "http://zip6.zeit.de/preview-xml/data/navigation.xml";
			} else if(location.href.indexOf('zonPad') > -1) {
				r = "xml/navigation.xml";
			}
			return r;
		},
		preview: function (type) {
			if ( type === "css" ) return ZEIT.csspath();
			if ( location.href.search(/https:/) > -1 ) return "https://ssl.zeit.de/images.zeit.de/static/js/";
			if ( typeof window.js_path === "undefined")  return "http://scripts.zeit.de/static/js/";
			return window.js_path + "/";
		},
		csspath: function () {
			if ( location.href.search(/https:/) > -1 ) return "https://ssl.zeit.de/images.zeit.de/static/css/";
			if ( typeof window.css_path === "undefined") return "http://css.zeit.de/static/css/";
			return window.css_path + "/";
		},
		stripTrailingSlash: function(str) {
			if( typeof str !== "undefined" && str.substr( str.length -1 ) == '/' ) {
				return str.substr( 0, str.length - 1 );
			}
			return str;
		}
    };
}();

// opera mobile needs an onload event
if( is_mobile && myagent.search(/opera/gi) > -1) {
	jQuery(document).ready(function(){
		ZEIT.mobileRedirect();
	});
}

// enable HTML5 elements in IE < 9
// source: https://remysharp.com/2009/01/07/html5-enabling-script
(function(){if(!/*@cc_on!@*/0)return;var e = "abbr,article,aside,audio,bb,canvas,datagrid,datalist,details,dialog,eventsource,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video".split(','),i=e.length;while(i--){document.createElement(e[i]);}})();
