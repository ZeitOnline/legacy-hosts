/*
* Zeit Online Video & Audio Embedding Plugin
* This script embeds videos and audios from div tags and uses class names as parameters
* 
* set url parameter "&debug=true" to enable debug mode!
*
* depends on jquery.swfobject: jquery.thewikies.com/swfobject/
*  
* Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*
* @author Marc Tönsing, Nico Brünjes
* Version 1.2 "solar"
*/

(function($) {
	
  $.fn.ZEITVideo = function (defaults) {
	$(".playmedia").live("click", function(e){
	  e.preventDefault();
	  $(window).scrollTop(0);
	  $.fn.playMedia($(this).attr("data-mediaid"));
	});

	var options = $.extend({
	  debug             : ZEIT.getQuery(window.location.search),
	  cache_url         : 'http://services.brightcove.com/services/messagebroker/amf',
	  api_read_key      : 'Y-oebuXNRyvEBf14nwn0Z4OgaFaxhT28c7eeHSPMvOMVr78dvsdyhQ..',
	  api_base_url      : 'http://www.zeit.de/solr/select/?q=',
	  idstring			: "http://video.zeit.de/video/",
	  api_suffix_url	: '"&version=2.2&indent=on&wt=json&fl=id,title,teaser_text,date-last-modified,referenced,h264_url,graphical-preview-url-large',
	  service_url       : 'http://c.brightcove.com/services/viewer/federated_f9',
	  cp_player_class	: 'videocpplayer', 		// die Klasse des Players auf der VideoCP
	  bc_api_class		: 'use_bc_api',
	  use_bc_api		: false, 				// Benutze die Brightcove API beim Einbinden des Players
	  use_html5			: false,
	  autoplay 			: false,
	  // Parameter für Audio, Video und Playlisten
	  mediatypes : {
		pls : {
		  publisher_id	: 18140073001,
		  playerid    	: 64924251001, //player with gui elements
		  playerid_beta : 64924251001, //player with gui elements
		  urlpostfix  	: 'isVid=1&isUI=1&%40videoList=',
		  api_command 	: 'uuid:"http://video.zeit.de/playlist/'
		},
		vid : {
		  publisher_id	: 18140073001,
		  playerid    	: 71289488001, //player with gui elements
		  playerid_beta : 73538928001, //player with gui elements
		  urlpostfix  	: 'isVid=1&isUI=1&videoSmoothing=true&%40videoPlayer=',
		  api_command 	: 'uuid:"http://video.zeit.de/video/'
		},
		aud : {
		  publisher_id	: 35067911001,
		  playerid    	: 41331465001, //player with gui elements
		  playerid_beta : 41331465001, //player with gui elements
		  urlpostfix  	: 'isUI=true&isAudio=true&%40audioPlayer=ref:'
		}
	  },
	  // Legt die Playertypen fest
	  playertypes : {
		art_wide          : {
		  width           : 540,
		  height          : 304,
		  wrap            : 'block',
		  title           : 'false', 	// Title Markup
		  description     : '<p class="caption"></p>',
		  markup_after	  : false,
		  desc_field      : 'teaser_text',
		  pls_meta		  : false,
		  showSingleLink  : " [Video kommentieren]",
		  showDate		  : false
		},
		videocpplayer         : {
		  width           : 540,
		  height          : 304,
		  wrap            : 'block throbber',
		  title           : '<div class="headline"></div>',
		  description     : '<p class="caption"></p>',
		  desc_field     	: 'teaser_text',
		  get_1st_pls_meta: true,
		  markup_after	: false,
		  pls_meta		: true,
		  showSingleLink	: "Video kommentieren und weiterempfehlen",
		  showDate		: " | # | "
		},
		aufmacher           : {
		  width           : 540,
		  height          : 304,
		  description     : '<p class="caption"></p>',
		  wrap            : 'block',
		  desc_field     	: false,
		  markup_after	: false,
		  showDate		: false,
		  showSingleLink	: false,
		  title               : false,
		  pls_meta		: false
		},
		single           : {
		  width           : 540,
		  height          : 304,
		  description     : '<p class="caption"></p>',
		  desc_field     	: false,
		  markup_after	: false,
		  showDate		: false,
		  showSingleLink	: false,
		  title               : false,
		  pls_meta		: false
		},
		mosaic              : {
		  width           : 220,
		  height          : 124,
		  title           : '<div class="title"></div>',
		  description     : '<p></p>',
		  desc_field     : 'teaser_text',
		  markup_after	: false,
		  pls_meta		: false,
		  showDate		: false,
		  showSingleLink	: false,
		  title_bottom    : true
		},
		quiz                : {
		  wrap            : 'left',
		  width           : 260,
		  height          : 176,
		  description     : '<div class="caption"></div>',
		  desc_field     : 'teaser_text',
		  markup_after	: false,
		  pls_meta		: false,
		  showSingleLink	: false,
		  title              : false,
		  showDate		: false
		},
		inf_wide            : {
		  wrap            : '',
		  width           : 370,
		  height          : 207   ,
		  title           : '<div class="title"></div>',
		  desc_field     	: 'teaser_text',
		  markup_after	: '<p>Weitere Serien, Interviews und Reportagen finden Sie auf unserer neuen <a id="hp.global.sidebar.links.video" href="http://www.zeit.de/video">Video-Startseite</a>.</p>',
		  pls_meta		: false,
		  showSingleLink	: false,
		  showDate		: false
		},
		art_double          : {
		  wrap            : 'block',
		  width           : 260,
		  height          : 145,
		  pls_meta        : false,
		  description     : '<div class="caption"></div>',
		  markup_after    : false,
		  desc_field      : 'teaser_text',
		  showSingleLink  : false,
		  showDate        : false,
		  title           : false
		},
		art_narrow          : {
		  wrap            : 'inline video inline_wide',
		  width           : 261,
		  height          : 146,
		  showDate        : false,
		  markup_after    : false,
		  title           : false,
		  description     : '<div class="caption"></div>',
		  pls_meta        : false,
		  showSingleLink  : " [Video kommentieren]",
		  desc_field      : 'teaser_text'
		},
		aud_narrow          : {
		  wrap            : 'inline video inline_wide',
		  width           : 260,
		  markup_after	: false,
		  height          : 110,
		  pls_meta		: false,
		  showDate		: false,
		  showSingleLink	: false,
		  title           : '<div class="headline iconvid_inline"></div>'

		}
	  },
	  ende       : 'ende'
	}, defaults);
		
	if(options.debug.debug==="true"){
	  console.debug("god mode on");
	}
		

		
	var getID       = function (id,str,length) {
	  // get id from class name
	  var pos = str.search(id);
	  return (pos <= 0) ? str.substring(pos+length) : false;
	};
		
	/* Macht aus Rons Zulu Zeit für nicht Zuluianer ein (halbwegs) lesbares Datum  */
	var zulu2date = function (zulutimestr) {
	  if(zulutimestr === undefined){
		return false;
	  }
	  var date = new Array();
	  date = zulutimestr.split("T")[0].split("-");
	  return date[2] + "." + date[1] + "." + date[0];
	};


	$.fn.getMeta    = function (mediatype,playertype,mediaID) {
	  if(options.mediatypes[mediatype].api_command !== undefined){
		var that = $(this);
		var myquery =   options.api_base_url +
		options.mediatypes[mediatype].api_command +
		mediaID + options.api_suffix_url;
                
		$.ajax({
		  url: myquery,
		  dataType: 'jsonp',
		  jsonp: 'json.wrf',
		  jsonpCallback: 'jsonp' + generateJSONPNumber(mediaID),
		  success: function(data) {
			if(data.response.numFound > 0) {
			  that.collectData(mediatype,playertype,mediaID,data);
			}
		  }
		});
	  }
	};
		
	$.fn.collectData = function (mediatype,playertype,mediaID,data){
	  var that 	= $(this);
	  var date 	= zulu2date(data.response.docs[0]["date-last-modified"]);
	  var title_txt 	= data.response.docs[0].title;
	  var desc_type 	= options.playertypes[playertype].desc_field;
	  var desc_txt	= data.response.docs[0][desc_type];

            
	  if(options.use_html5 && mediatype!="aud"){
		if(mediatype == 'pls'){
		  var vidID 	= extractvideoID(data.response.docs[0].referenced[0].split(',')[0]);
		  that.getMeta('vid',playertype,vidID);
		}else{
		  var stillimage 	= data.response.docs[0]["graphical-preview-url-large"];
		  var videourl	= data.response.docs[0]["h264_url"];
		  that.buildPlayer(playertype,swfURL,playertype,mediatype,vidID,stillimage,videourl);
		  that.setDynamicContent("title",title_txt);
		  if(desc_type){
			if(options.playertypes[playertype].showDate){
			  var afterdesc_markup = new Array();
			  afterdesc_markup = options.playertypes[playertype].showDate.split('#');
			  desc_txt = desc_txt + afterdesc_markup[0] + date + afterdesc_markup[1];
			}
			if(options.playertypes[playertype].showSingleLink){
			  var afterdesc_link = '<a title="' + options.playertypes[playertype].showSingleLink + '" href="http://video.zeit.de/video/' + mediaID +'">' + options.playertypes[playertype].showSingleLink + '</a>';
			  desc_txt = desc_txt + afterdesc_link;
			}
			that.setDynamicContent("caption",desc_txt);
		  }
                  
		}
             
	  }else if(options.playertypes[playertype].pls_meta && mediatype == 'pls'){
		var vidID 	= extractvideoID(data.response.docs[0].referenced[0].split(',')[0]);
		var swfURL	= buildSWFURL(playertype,'vid',vidID);
		that.buildPlayer(playertype,swfURL,playertype,mediatype,vidID);
		that.getMeta('vid',playertype,vidID);
	
	  }else{
		that.setDynamicContent("title",title_txt);
		if(options.playertypes[playertype].showDate){
		  var afterdesc_markup = new Array();
		  afterdesc_markup = options.playertypes[playertype].showDate.split('#');
		  desc_txt = desc_txt + afterdesc_markup[0] + date + afterdesc_markup[1];
		}
		if(options.playertypes[playertype].showSingleLink){
		  var afterdesc_link = '<a title="' + options.playertypes[playertype].showSingleLink + '" href="http://video.zeit.de/video/' + mediaID +'">' + options.playertypes[playertype].showSingleLink + '</a>';
		  desc_txt = desc_txt + afterdesc_link;
		}
		if(desc_type){
		  that.setDynamicContent("caption",desc_txt);
		}
	  }
	};
		
		
		
	/* Der nervige Teil der URL IDs... seufz */
	var extractvideoID = function(id) {
	  return id.replace(options.idstring,'');
	};

	/* JSON Varnish Caching */
	var generateJSONPNumber = function(mediaID) {
	  var jsonpnumber = mediaID;
            
	  if(window.mediaIDs == undefined){
		window.mediaIDs = new Array();
		window.mediaIDs.push(mediaID);
	  }else{
		if($.inArray(mediaID,window.mediaIDs) >= 0){
                    
		  jsonpnumber = mediaID + Math.floor(Math.random()*101);
		}else{
		  window.mediaIDs.push(mediaID);
		}
	  }

	  return jsonpnumber;

	};
		
	var getBannerchannel = function() {
	  if(jQuery("meta[name=zeit::banner-channel]").attr('content') != undefined){
		var bannerchannel = jQuery("meta[name=zeit::banner-channel]").attr('content').toLowerCase();
	  }else {
		var bannerchannel = "undefined";
	  }
	  return bannerchannel;
	};
		
	$.fn.playerStatus = function (status){
	  if(options.debug.debug=="true"){
		console.debug("jQuery playerStatus: " + status);
	  }
	  switch(status){
		case 'ad_start':
		  $('#place_companion').show();
		  break;
		case 'video_complete':
		  $('#place_companion').hide();
		  break;
		default:
	  /* nix */
	  }
	};
		
	var isMobileApple = function() {
	  var agent = navigator.userAgent.toLowerCase();
	  if(agent.match(/iPhone/i)=="iphone" || agent.match(/iPad/i)=="ipad"){
		return true;
	  }
	  return false;
	};
		
	var getPlayerID = function (playertype,mediatype){
	  if(mediatype===''){
		return false;
	  }
	  if(options.debug.debug=="true"){
		return options.mediatypes[mediatype].playerid_beta;
	  }
	  return options.mediatypes[mediatype].playerid;
	};
        
	$.fn.setDynamicContent = function (field,string){

	  if(string !== false){
		if(field == "title"){
		  if(string){
			$(this).find('.dyn_title').html(string).show();
		  }
		}else if(field == "caption"){
		  if(string){
			$(this).find('.dyn_caption').html(string).show();
		  }
		}else{
		  return false;
		}
	  }else{
		return false;
	  }
	};
        
	$.fn.buildPlayer = function (playertype,swf_url,playertype,mediatype,mediaID,stillimage,videourl){
	  var object_markup;
	  var autoplay = '';
	  if(options.autoplay){
		autoplay =' autoplay="autoplay"';
	  }
	  if (videourl===undefined){
		videourl='';
	  }
	  if(options.use_html5 && mediatype!="aud"){
		object_markup = $('<video ' +
		  ' height="' + options.playertypes[playertype].height + '"' +
		  ' width="' + options.playertypes[playertype].width + '"' +
		  ' controls="true"' +
		  ' poster=' + stillimage + autoplay +
		  ' src=' + videourl +
		  '></video>');
		$(this).append(object_markup);
	  }else{
		$(this).flashembed({
		  height: options.playertypes[playertype].height,
		  width: options.playertypes[playertype].width,
		  wmode: "transparent",
		  id: mediatype + mediaID,
		  src: swf_url,
		  allowFullScreen: "true",
		  allowScriptAccess: "always",
		  swliveconnect: "true",
		  linkBaseURL: "http://video.zeit.de/video/" + mediaID
		},{
		  seamlesstabbing: false,
		  allowFullScreen: true,
		  allowScriptAccess: "always",
		  linkBaseURL: "http://video.zeit.de/video/" + mediaID,
		  swliveconnect: true      
		});
	  }
		
	  var title_markup    = null;
	  var caption_markup  = null;
              
	  if(options.playertypes[playertype].title){
		title_markup    = $(options.playertypes[playertype].title);
		title_markup.addClass('dyn_title').hide();
	  }

	  if(options.playertypes[playertype].description){
		caption_markup  = $(options.playertypes[playertype].description);
		caption_markup.addClass('dyn_caption').hide();
	  }

	  if(options.playertypes[playertype].title_bottom !== true){
		$(this).prepend(title_markup);
		$(this).append(caption_markup);
	  }else{
		$(this).append(title_markup);
		$(this).append(caption_markup);
	  }
	  if(options.playertypes[playertype].markup_after){
		$(this).after(options.playertypes[playertype].markup_after);
	  }
	};
        
	var buildSWFURL = function (playertype,mediatype,mediaID){
	  var playerID = getPlayerID(playertype,mediatype);
	  var bannerID = encodeURIComponent(getBannerchannel());
	  var swf_url =
	  options.service_url +
	  '?playerID='            + getPlayerID(playertype,mediatype) +
	  '&'                     + options.mediatypes[mediatype].urlpostfix + mediaID +
	  '&width='               + options.playertypes[playertype].width +
	  '&height='              + options.playertypes[playertype].height +
	  '&linkBaseURL=http://video.zeit.de/video/' + mediaID +
	  '&publisherID='         + options.mediatypes[mediatype].publisher_id +
	  '&cacheAMFURL='         + encodeURIComponent(options.cache_url) +
	  '&additionalAdTargetingParams=%3Bbanner-channel%3D' + bannerID + '%2F' + mediatype +
	  '&autoStart=' + options.autoplay +
	  '&bgcolor=%23FFFFFF';
	  return swf_url;
	};
        
	$.fn.playMedia = function (extID){
	  options.autoplay = true;
	  $('.'+ options.cp_player_class).initPlayer(extID);

	};

	$.fn.initPlayer = function (extID){
	  var playertype  = '';
	  var mediatype   = '';
	  var mediaID     = '';
            


	  // get JSON Data
			
	  if(extID){
		mediatype   = extID.substring(3,0);
		mediaID 	= getID(mediatype,extID,3);
		playertype 	= 'videocpplayer';
		$(this).hide().empty();
	  }else{
		// get array of classes from zol_video div
		var myClasses = $(this).attr('class').split(' ');

		// get playertype, mediatype and mediaID
		for (var i = 0; i < myClasses.length; i++ ) {
		  if(options.playertypes[myClasses[i]]!== undefined){
			playertype  = myClasses[i];
		  }
		  if(options.mediatypes[myClasses[i].substring(3,0)]!== undefined){
			mediatype   = myClasses[i].substring(3,0);
			mediaID     = getID(mediatype, myClasses[i],3);
		  }
		  if(options.bc_api_class === myClasses[i]){
			options.use_bc_api = true;
		  }
		}
	  }
			
	  // try to build the player and swfurl
	  if(mediatype !== "" && mediaID !==""){
		if(!(options.playertypes[playertype].pls_meta && mediatype == 'pls')){
		  if(!options.use_html5 || mediatype=="aud"){
			$(this).buildPlayer(playertype,buildSWFURL(playertype,mediatype,mediaID),playertype,mediatype,mediaID);
		  }
		}
                
		$(this).getMeta(mediatype,playertype,mediaID);

		if(options.playertypes[playertype].wrap === undefined){
		  options.playertypes[playertype].wrap = '';
		}

		$(this).addClass(options.playertypes[playertype].wrap);
		$(this).show();
	  }
	};

	return this.each (function () {
	  options.use_html5 = isMobileApple();
	  if(options.debug.html5=="true"){
		options.use_html5=true;
	  }
	  if(flashembed.isSupported([10, 0]) || options.use_html5){
		$(this).initPlayer();
	  }else{
		$(this).html('<p class="noflash"><strong>Leider konnte kein aktueller Flashplayer in Ihrem Browser gefunden werden.</strong> <br />Der Adobe Flashplayer wird zwingend für die Darstellung von Videos auf ZEIT ONLINE benötigt. Bitte installieren Sie die <a href="http://www.adobe.com/go/getflashplayer">neueste Version</a>.</p>');
	  }
	});
  };
})(jQuery);