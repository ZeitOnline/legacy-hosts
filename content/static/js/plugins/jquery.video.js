/*
* Zeit Online Video & Audio Embedding Plugin
* This script embeds videos and audios from div tags and uses class names as parameters
*
*
* depends on jquery.swfobject: jquery.thewikies.com/swfobject/
*
* Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*
* @author Anika Szuppa
* Version 1.6 "flashembed"
*/

(function($) {
  $.fn.video = function (defaults) {
    var that = this;

    var videoArray = {};

    //click event for playmedia class, used on video cp
    $( document ).on("click", ".playmedia", function(e){

    	e.preventDefault;
    	reInitPlayer(this,'');

    });

    //click event for playmediacp class, used on homepage
    $( document ).on("click", ".playmediacp", function(e){

    	e.preventDefault;

    	//ie workarround
    	if(window.location.hash.indexOf("#player")>-1){
    		var url = document.URL.substr(0,document.URL.indexOf("#player"));
    	}else{
    		var url = document.URL;
    	}

    	//reInitPlayer(this,$($(this).attr("href").replace(url,'')).offset().top,url);
    	reInitPlayer(this,url);

    });

    //initialise player, after thumb was clicked
    var reInitPlayer = function(that,url){

    	//ie workarround
    	var attrHref = $(that).attr("href").replace(url,'');
    	var attrMediaId = $(that).attr('data-mediaid');

    	if(attrHref.indexOf('#')>-1){

    		//scroll top
  	      	//$(window).scrollTop(scroll);

  	      	//reinitialise player
  	      	var playerId = attrHref.replace('#','');

  	      	if(playerId.indexOf("player") == -1){
  	      		var playerId = "player0";
  	      	}

  	      	videoArray[playerId].reInitSettings();

  	      	//reset relevant values and rebuild player
  	      	options.useSpecialTexts				= true;
  	      	videoArray[playerId].hdText			= options.showHdHtml5Text;
  	    	videoArray[playerId].mediaId 		= attrMediaId.replace('vid','');
  	    	videoArray[playerId].firstPlVid 	= attrMediaId.replace('vid','');
  	    	videoArray[playerId].mediaType		= 'vid';
  	    	videoArray[playerId].callSolr(attrMediaId.replace('vid',''),'vid');
    	}
    };

    //get parameter and environment presets
	var initParamPresets = function(){

			//set autoplay to true if hash was delivered
	    	if(window.location.hash === '#autoplay'){
		        options.autoplay = true;
		    }

	    	//test if html5 mode is switched on by parameter
	    	if(options.debug.html5 === "true"){
	    		options.use_html5 = true;
	    	}

	    	//define if beta player should be used
	    	if(options.debug.debug === "true"){
	    		$.each(options.mediatypes, function(index){
	    			options.mediatypes[index].playerid = options.mediatypes[index].playerid_beta;
	    		});
	    	}

	    	//set banner channel
	        if( $("body").attr('data-banner_channel') !== undefined ){
	        	options.bannerchannel = encodeURIComponent($("body").attr('data-banner_channel').toLowerCase());
	        }

	        //test if browser belongs to mobile device
	        var agent = navigator.userAgent.toLowerCase();

	        if(agent.match(/msie/) != null){
	        	options.useIe = true;
	        }

	        //test if browser is html5 compatible
	        options.use_html5_browser = !!document.createElement('video').canPlayType;

	};

    //create class for player types
   	function playerClass(){

   		//settings for playertypes
   		this.width				=	0;			//width
   		this.height				=	0;			//height
   		this.wrap				=	false;		//wrap positioning
   		this.title				=	false;		//add title
   		this.title_bottom		= 	false;		//(enum) add title and caption below video (eg mosaic)
   		this.description		=	false;		//add description
   		this.showNavigation 	=	false;		//defines if navigation thumbnails should be showed below (eg for inf_wide)
   		this.showNavigationRight=	false;		//defines if navigation thumbnails should be showed on the right (eg for videocpplayer)
   		this.navigationHead		=	false;		//defines head text for navigation
   		this.navigationOffset	=	0;			//defines max number of thumbnails
   		this.navigationRealLinks=	false;		//use links to video single pages instead of changing player
   		this.defaultPlaylist	=	0;			//defines default playlist for thumblist
   		this.showSingleLink  	=	false;		//link to video single page
   		this.showDate			=	false;		//defines if video date should be shown
   		this.setCPLink		  	=	false;		//set link to video cp for title
   		this.setSingleLink		=	false;		//set link to video single for title
   		this.usePlaylistTitle	= 	false;		//use playlist title instead of first video title
   		this.hidePlaylistCaption=	false;		//don't show caption text for playlists
   		this.useIpadCaption		=	false;		//use alternative caption in ipad view
   		this.hidePlayer			=	false;		//if player should be hidden by a stillimage first
   		this.showHdHtml5		=	false;		//show link for hd file in html5 mode
   		this.largePlayButton	=	false;		//show larger play button
   		this.useBC				=	false;		//defines if BC url should be shown

   		//create html snippet / used for playertype options
   		this.createSnippet = function(tag,cssClass,content){

   			//prevent undefined content
   			if(content == undefined){ content = ''; }

   			//prevent undefined class name
   	    	if(cssClass == undefined){
   	    		cssClass = '';
   	    	}else{
   	    		cssClass = ' class="'+cssClass+'"';
   	    	}

   	    	//return created tag
   	    	return('<'+tag+cssClass+'>'+content+'</'+tag+'>');
   		};

   		//initialise player object
   		this.init = function(object){
   			$.extend(this, object);
   		};

   	}

    //set options
    var options = $.extend({
      debug				: ZEIT.getQuery(window.location.search),
      limit_nav_items	: 12,
      cache_url			: 'http://services.brightcove.com/services/messagebroker/amf',
      api_read_key		: 'Y-oebuXNRyvEBf14nwn0Z4OgaFaxhT28c7eeHSPMvOMVr78dvsdyhQ..',
      api_base_url		: 'http://www.zeit.de/website-solr/select/?q=',
      bc_url			: 'http://api.brightcove.com/services/library',
      bc_token			: '&media_delivery=http&token=80sICa_ciDeciP7ZUt8mj8ReeaFUDsiXSHRtuV9Om9fBmJLJf6SwXg..',
      bc_success		: 'http://phpscripts.zeit.de/test_video/aud2bc/bc_success.png',
      bc_fail			: 'http://phpscripts.zeit.de/test_video/aud2bc/bc_fail.png',
      idstring			: "http://video.zeit.de/video/",
      api_suffix_url	: '"&version=2.2&indent=on&wt=json',
      api_suffix_url_nav: '&version=2.2&indent=on&wt=json&fl=uniqueId,title,supertitle,teaser_text,graphical-preview-url-large',
      //api_suffix_url	: '"&version=2.2&indent=on&wt=json&fl=id,title,created,teaser_text,date-last-modified,referenced,h264_url,graphical-preview-url-large,uuid',
      //api_suffix_url_nav: '&version=2.2&indent=on&wt=json&fl=uuid,title,teaser_text,graphical-preview-url-large',
      service_url		: 'http://c.brightcove.com/services/viewer/federated_f9',
      cp_player_class	: 'videocpplayer',
      vidRotator		: '.vid_rotator',
      secureBrowsing	: false,
      use_html5			: false,
      use_html5_browser : false,
      useIe				: false,
      autoplay			: false,
      bannerchannel		: 'none',
      headerNav			: '<div class="vid_nav clear"><div class="left vid_headline">Weitere Videos</div><div class="pagenav"><a href="#" class="rwd_inactive" title="Vorherige Seite"></a><span class="numbers"></span><a href="#" class="fwd_inactive" title="Nächste Seite"></a></div></div><div class="vid_rotator">',
      headerNavRight	: '<ul class="videolist teaserlist block"><li class="mostviewed block"><div class="headline">Empfohlene Videos</div><div class="vid_rotator">',
      footerNav			: '</div><div class="clear"><a href="http://www.zeit.de/video/index">Mehr Videos</a></div>',
      footerNavRight	: '</div></li></ul>',
      titleClass		: 'dyn_title',
      captionClass		: 'dyn_caption',
      appendPlayer		: true,
      showHdHtml5Text	: "[HD-Version ansehen]",
      showHdHtml5TextOff: "[Standard-Version ansehen]",
      useSpecialTexts	: true,
      noFlash			: '<p class="noflash"><strong>Leider konnte kein aktueller Flashplayer in Ihrem Browser gefunden werden.</strong> <br/>Der Adobe Flashplayer wird zwingend für die Darstellung von Videos und Audios auf ZEIT ONLINE benötigt. Bitte installieren Sie die <a href="http://www.adobe.com/go/getflashplayer">neueste Version</a>.</p>',
      // Parameter für Audio, Video und Playlisten
      mediatypes : {
        pls : {
          publisher_id	: 18140073001,
          playerid		: 64924251001, //player with gui elements
          playerid_beta : 64924251001, //player with gui elements
          urlpostfix	: 'isVid=1&isUI=1&%40videoList=',
          api_command	: 'bc_id_s:"',
          bc_command 	: '?command=find_playlist_by_id&playlist_id='
          //api_command	: 'uuid:"http://video.zeit.de/playlist/'
        },
        vid : {
          publisher_id	: 18140073001,
          playerid		: 71289488001, //player with gui elements
          playerid_beta : 73538928001, //player with gui elements
          urlpostfix	: 'isVid=1&isUI=1&videoSmoothing=true&%40videoPlayer=',
          api_command	: 'bc_id_s:"',
  		  bc_command	: '?command=find_video_by_id&video_id='
          //api_command	: 'uuid:"http://video.zeit.de/video/'
        }
      }
    }, defaults);

    //switch debugging on if parameter was deliveres
    if(options.debug.debug === "true"){
        console.debug("dncornholio");
    }

    //define playertype objects
    options['playertypes'] = {};


    //used within articles
    options['playertypes']['art_wide']		= 		new playerClass();
    options['playertypes']['art_wide'].init({
										    	width			: 580,
										        height		  	: 327,
										        wrap			: 'block',
										        description	  	: options['playertypes']['art_wide'].createSnippet("p","caption"),
										        showHdHtml5		: true,
										        showSingleLink  : "Video kommentieren",
										        hidePlayer		: true,
										        largePlayButton	: 'button_large'
    										});

    //used on video cp page
    options['playertypes']['videocpplayer']		= 		new playerClass();
    options['playertypes']['videocpplayer'].init({
										        width			  	: 580,
										        height		  		: 327,
										        wrap			  	: 'block throbber',
										        title			  	: options['playertypes']['videocpplayer'].createSnippet("div","headline"),
										        description	  		: options['playertypes']['videocpplayer'].createSnippet("p","caption"),
										        showNavigationRight : true,
										        navigationOffset	: 4,
										        defaultPlaylist 	: 72336677001,
										        showSingleLink  	: "Video kommentieren und weiterempfehlen",
										        showHdHtml5			: true,
										        showDate		  	: true,
										        hidePlayer			: true,
										        largePlayButton		: 'button_large'
    										});

    //used for aufmacher on homepage
    options['playertypes']['aufmacher']		= 		new playerClass();
    options['playertypes']['aufmacher'].init({
										        width			: 580,
										        showHdHtml5		: true,
										        height			: 327,
										        hidePlayer		: true,
										        largePlayButton	: 'button_large'
										        //description	: options['playertypes']['aufmacher'].createSnippet("p","caption"),
										        //wrap		: 'block'
    										});

	//used for parquet on homepage
	options['playertypes']['parquet-video']		= 		new playerClass();
	options['playertypes']['parquet-video'].init({
										        width			: 700,
										        showHdHtml5		: true,
										        height			: 394,
										        hidePlayer		: true,
										        largePlayButton	: 'button_large'
										        //description	: options['playertypes']['aufmacher'].createSnippet("p","caption"),
										        //wrap		: 'block'
											});

    //used on video single pages, contains list of thumbnails for default playlist
    options['playertypes']['single']		= 		new playerClass();
    options['playertypes']['single'].init({
										        width			  	: 580,
										        height		  		: 327,
										        //description	  	: options['playertypes']['single'].createSnippet("p","caption"),
										        showNavigationRight	: true,
										        navigationHead  	: 'Empfohlene Videos',
										        navigationOffset	: 4,
										        defaultPlaylist 	: 72336677001,
										        showHdHtml5			: true,
										        navigationRealLinks	: true,
										        largePlayButton		: 'button_large'
      										});

    //used for player in informatives without thumblist
    options['playertypes']['inf_wide_single']		= 		new playerClass();
    options['playertypes']['inf_wide_single'].init({
										        width				: 320,
										        height				: 180,
										        title				: options['playertypes']['inf_wide_single'].createSnippet("div","title"),
										        description			: options['playertypes']['inf_wide_single'].createSnippet("p","caption"),
										        //titleonly	: true,
										        usePlaylistTitle	: true,
										        hidePlaylistCaption	: true,
										        useIpadCaption 		: true,
										        hidePlayer			: true,
										        largePlayButton		: 'button_large'
											});

    //used if video is integrated in mosaic
    options['playertypes']['mosaic']		= 		new playerClass();
    options['playertypes']['mosaic'].init({
										    	  width			: 220,
										        height		  	: 124,
												    title			: options['playertypes']['mosaic'].createSnippet("div","title"),
										        setSingleLink	: true,
										        description	  	: options['playertypes']['mosaic'].createSnippet("p"),
										        //showSingleLink  : '[weiter]&nbsp;<span title="Video" class="iconvid">&nbsp;</span>',
										        showHdHtml5		: true,
										        title_bottom	: true,
										        hidePlayer		: true
											});

    //used if video is integrated in quiz
    options['playertypes']['quiz']		= 		new playerClass();
    options['playertypes']['quiz'].init({
										    	wrap		: 'block',
										        width		: 580,
										        height		: 327,
										        showHdHtml5	: true,
										        //description	: options['playertypes']['quiz'].createSnippet("div","caption"),
										        //desc_field  : 'teaser_text',
										        hidePlaylistCaption	: true,
										        hidePlayer		: true,
                            largePlayButton   : 'button_large'
											});

    //used for video in informatives, includes thumbnaillist
    options['playertypes']['inf_wide']		= 		new playerClass();
    options['playertypes']['inf_wide'].init({
										        width			: 320,
										        height			: 180,
										        title			: options['playertypes']['inf_wide'].createSnippet("div","title"),
										        description	  	: options['playertypes']['inf_wide'].createSnippet("div","caption"),
										        showNavigation	: true,
										        navigationOffset: options.limit_nav_items,
										        setCpLink		: true,
										        titleonly		: true,
										        usePlaylistTitle: true,
										        useIpadCaption 	: true,
										        hidePlayer		: true,
										        showHdHtml5		: true,
										        wrap			: 'throbber',
										        largePlayButton	: 'button_large'
											});

    //don't know
    options['playertypes']['art_double']		= 		new playerClass();
    options['playertypes']['art_double'].init({
										    	wrap		: 'block',
										        width		: 260,
										        height		: 145,
										        showHdHtml5	: true,
										        description	: options['playertypes']['art_double'].createSnippet("div","caption"),
										        hidePlayer		: true
											});

    //don't know
    options['playertypes']['art_narrow']		= 		new playerClass();
    options['playertypes']['art_narrow'].init({
										    	wrap			: 'inline video inline_wide',
										        width			: 261,
										        height		  	: 146,
										        description	  	: options['playertypes']['art_narrow'].createSnippet("div","caption"),
										        showHdHtml5		: true,
										        showSingleLink  : "Video kommentieren",
										        hidePlayer		: true
											});

    //apply presets made by using url parameters
    initParamPresets();

   	//create class for video player
   	function videoClass(divId){

   		this.mediaId 				= '';						//id of video
   		this.playerType 			= '';						//type of player
   		this.divId 					= '#'+divId;				//video container id
   		this.swfUrl 				= '';						//url for video object tag
   		this.date 					= '';						//date of video
   		this.title 					= '';						//title of video
   		this.url					= '';						//video single url
   		this.playlistTitle 			= '';						//title of playlist
   		this.firstPlVid 			= '';						//id of first video in a playlist
   		this.caption 				= '';						//caption text of video
   		this.stillImage 			= 'http://images.zeit.de/static/img/videoplayer/video-platzhalter.jpg'; //thumb image
   		this.videoUrl				= '';						//alternative stream url
   		this.videoUrlHd				= '';						//url for highest rendition
   		this.html5Player 			= '';						//object containing HTML5 Player
   		this.regularPlayer			= '';						//object containing regular player
   		this.regularPlayerAdditional= '';						//object containing additional object for regular player
   		this.autoplay				= '';						//autoply setting for flash player
   		this.autoplayHtml5			= '';						//autoplay setting for html5 player
   		this.ipadCaption 			= '';						//caption text for player with thumbnails on ipad homepage
   		this.videoList				= '';						//contains object of single video data, if object is playlist
   		this.hdText					= options.showHdHtml5Text;	//text for switch to hd link
   		this.superTitle				= '';						//text supertitle

   		//call solr
   		this.callSolr = function(id,mediaType){

   			var that = this;

   			if(mediaType == undefined){	mediaType = this.mediaType; }

			//build Solr Query
    		var solrQuery =	options.api_base_url +
    						options.mediatypes[mediaType].api_command +
    						id +
    						options.api_suffix_url;

    		//test BC if applies
    		if(options.playertypes[this.playerType].useBC == true && mediaType == 'pls'){
    			//da ajax call the bc way
    			var bcQuery = options.bc_url + options.mediatypes[mediaType].bc_command + '36516804001' + options.bc_token;

    			$.ajax({
        			url: bcQuery,
                    dataType: 'jsonp',
                    jsonpCallback: 'jsonp' + this.generateJSONPNumber(id),
                    success: function(dataBC) {

                    	if(dataBC!= undefined && dataBC!= null && dataBC.error == undefined && dataBC.name != undefined){
                    		$("<img src='"+options.bc_success+"?name="+dataBC.name+"&"+that.generateJSONPNumber(id)+"'>");
                    	}else{
                    		$("<img src='"+options.bc_fail+"?error="+dataBC.code+"&"+that.generateJSONPNumber(id)+"'>");
                    	}
                    },
                    error: function(text,status){
                    	$("<img src='"+options.bc_fail+"?error="+status+"&"+that.generateJSONPNumber(id)+"'>");
                    }
                  });
    		}

    		//do ajax call
        		$.ajax({
        			url: solrQuery,
                    dataType: 'jsonp',
                    jsonp: 'json.wrf',
                    jsonpCallback: 'jsonp' + this.generateJSONPNumber(id),
                    success: function(data) {
                      if(data.response.numFound > 0 ) {

                    	  //collect data and init player
                    	  var firstVideoId = that.collectData(data,mediaType);

                    	  //collectData param prevents player to be initialise twice (eg on single page)
                    	  if(firstVideoId != false && options.appendPlayer !== false){

                    		  //if we are within a playlist, get first video data and call again if necessary
                    		  that.firstPlVid = firstVideoId;
                    		  that.callSolr(firstVideoId,'vid');
                    	  }else{

                    		  //set id of first playlist video to current video, if we have a single video
                    		  if(that.firstPlVid == ''){
                    			  that.firstPlVid = that.mediaId;
                    		  }

                    		  that.initPlayer(mediaType);
                    	  }

                      }
                    }
                  });

		};

		//create url from text
		this.createUrlText = function (text, url){

			text = 	text.replace(/ü/g, 'ue')
						.replace(/ä/g, 'ae')
						.replace(/ö/g, 'oe')
						.replace(/ß/g, 'ss')
						.replace(/ /g, '-')
						.replace(/[^A-Za-z0-9\-_]/g, '')
						.toLowerCase();

			if(text != ''){
				text = url+"/"+text;
			}else{
				text = url;
			}


			return(text);
		}

   		//collect solr data and set video information
   		this.collectData = function (data,mediaType){

   			var that = this;
   			if(mediaType == undefined){	mediaType = this.mediaType; }

   			if(mediaType != 'pls'){
   			//if no playlist get video or audio data

   				//grab title
   	   			if(data.response.docs[0].title != undefined){
   		   			this.title			= data.response.docs[0].title;
   		   		}

   	   			//grab supertitle
   	   			if(data.response.docs[0].supertitle != undefined){
   		   			this.superTitle			= data.response.docs[0].supertitle;
   		   		}

   	   			//grab date
   				if(data.response.docs[0].created != undefined){
   	   				this.date			= this.zulu2date(data.response.docs[0].created);
   	   			}

   				//grab caption text
   	   			if(data.response.docs[0].teaser_text != undefined){
   	   				this.caption		= data.response.docs[0].teaser_text;
   	   			}

   	   			//grab alternative url
   	   			if(data.response.docs[0].h264_url != undefined){
   	   				this.videoUrl		= data.response.docs[0].h264_url;
   	   			}

   	   			//create link from uuid
   	   			if(data.response.docs[0].uniqueId != undefined){

   	   				this.url = data.response.docs[0].uniqueId;
   	   				this.url = this.url.replace("xml.","www.");

	   	   			if(document.URL.indexOf("zip6-alt.zeit.de/new_vid") != -1){
		   				this.url = this.url.replace("http://www.zeit.de/","http://zip6-alt.zeit.de/new_vid/");
					   }

             //grab preview image
            if(this.url != undefined){
              this.stillImage     = this.url.replace( 'www.zeit.de', 'www.zeit.de/zmo-assets') + '/imagegroup/still.jpg';

            }

	   	   			//form url for single video link
	   	   			this.seoUrl = this.createUrlText(this.superTitle+'-'+this.title, this.url);

   	   			}

   	   			//parse renditions to grab HD URL
   	   			var actualRendition = 0;
   	   			var actualField = '';
   	   			var smallRendition = 0;
   	   			var smallField = '';

   	   			$.each(data.response.docs[0], function(index,value){

   	   				if(index.indexOf("video_rendition_") > -1){

   	   					var cutRendition = index.replace("video_rendition_","");
   	   					cutRendition = parseInt(cutRendition.substring(0, cutRendition.indexOf("_")));

   	   					if(cutRendition > 640){
   	   					//if(cutRendition > 0){

   	   						//get best hd rendition
	   	   					if(cutRendition > actualRendition){
	   	   						actualRendition = cutRendition;
	   	   						actualField = index;
	   	   					}

   	   					}else{

   	   						//get best sd rendition
	   	   					if(cutRendition > smallRendition && options.use_html5_browser == true){
	   	   						smallRendition = cutRendition;
	   	   						smallField = index;
	   	   					}

   	   					}

   	   				}
   	   			});

   	   			//set hd rendition
   	   			if(actualField != '' && data.response.docs[0][actualField] != undefined){
   	   				this.videoUrlHd		= data.response.docs[0][actualField];
   	   			}else{
   	   				this.videoUrlHd		= '';
   	   			}

   	   			//reset sd rendition if there's a better than the standart one
	   	   		if(smallField != '' && data.response.docs[0][smallField] != undefined){
	   	   			this.videoUrl = data.response.docs[0][smallField];
		   		}

   	   			return(false);

   			}else{
   			//if playlist get data of first video and define playlist title

   				//grab Playlist title
   	   			if(data.response.docs[0].title != undefined){
   		   			this.playlistTitle			= data.response.docs[0].title;
   		   		}

   	   			//grab array of videos
   	   			if(data.response.docs[0].referenced != undefined){
	   				that.videoList		= {};

	   				var count = 0;
	   				var firstId = 0;

	   				//create video list object, spare first video
	   				$.each(data.response.docs[0].referenced, function(index,value){

	   					var id = value.substring(value.lastIndexOf("/")+1,value.length);

	   					if(count>0 && count<=options.playertypes[that.playerType].navigationOffset){

	   						that.videoList[id] = {};
	   						that.videoList[id].url = value.replace("xml.","www.");

	   						if(document.URL.indexOf("zip6-alt.zeit.de/new_vid") != -1){
	   							that.videoList[id].url = that.videoList[id].url.replace("http://www.zeit.de/","http://zip6-alt.zeit.de/new_vid/");
	   						}

	   					}else if(count==0){

	   						//actions for first video
	   						firstId = id;
	   					}

	   					count++;
	   				});

	   				//return id of first video
	   				return(firstId);
	   			}

   			}

   		};

   		//build brightcovce url
   		this.buildSwfUrl = function (){

   	        this.swfUrl =	options.service_url +
   	        '?playerID='	+ options.mediatypes[this.mediaType].playerid +
   	        '&'				+ options.mediatypes[this.mediaType].urlpostfix + this.mediaId +
   	        '&width='		+ options.playertypes[this.playerType].width +
   	        '&height='		+ options.playertypes[this.playerType].height +
   	        '&linkBaseURL=' + this.url +
   	        '&publisherID='	+ options.mediatypes[this.mediaType].publisher_id +
   	        '&cacheAMFURL='	+ encodeURIComponent(options.cache_url) +
   	        '&additionalAdTargetingParams=%3Bbanner-channel%3D' + options.bannerchannel + '%2F' + this.mediaType +
   	        '&autoStart=' + this.autoplay +
   	        '&bgcolor=%23FFFFFF';

   	  };

   		//set up html5 player object
   		this.buildHtml5Player = function(){

   			this.html5Player = $('<video ' +
   								' height="' + options.playertypes[this.playerType].height + '"' +
   								' width="' + options.playertypes[this.playerType].width + '"' +
   								' preload="none"' +
                  ' controls="true"' +
   								' poster=' + this.stillImage + this.autoplayHtml5 +
   								//' src=' + this.videoUrl +
   								' id="' + this.mediaType + this.mediaId +'"></video>');
   		};

   		//set up regular player objects
   		this.buildRegularPlayer = function(){

   			this.regularPlayer	= {	height: options.playertypes[this.playerType].height,
   	                				width: options.playertypes[this.playerType].width,
				   	                wmode: "transparent",
				   	                id: this.mediaType + this.mediaId,
				   	                src: this.swfUrl,
				   	                allowFullScreen: true,
				   	                allowScriptAccess: false,
				   	                swliveconnect: false,
				   	                linkBaseURL: this.url};

   			this.regularPlayerAdditional = {allowFullScreen: true,
						   	                allowScriptAccess: false,
						   	                swliveconnect: false,
						   	                linkBaseURL: this.url
   	              							};
   		};

   		//set video main data
   		this.getVideoSettings = function(){

   			// get array of classes from zol_video div
	        var myClasses = $(this.divId).attr('class').split(' ');
	        var i = 0;
	        var that = this;

	        // set playertype, mediatype and mediaID
	        for (i; i < myClasses.length; i++ ) {

	        	//set playertype
	            if(options.playertypes[myClasses[i]]!== undefined){
	              this.playerType	= myClasses[i];
	            }

	            //set mediatype + media id
	            if(options.mediatypes[myClasses[i].substring(3,0)]!== undefined){
	              this.mediaType	= myClasses[i].substring(3,0);
	              this.mediaId		= this.getID(this.mediaType, myClasses[i],3);
	            }

	        }

	        //set string for autoplay
	        if(options.autoplay){
	        	this.autoplayHtml5 =' autoplay="autoplay"';
	        	this.autoplay	   ='true';
	        }else{
	        	this.autoplay	   ='false';
	        }

            //add title bucket if set
            if(options.playertypes[this.playerType].title != false){
            	$(options.playertypes[this.playerType].title).prependTo(this.divId).addClass(options.titleClass);
            }

            //add caption bucket if set
            if(options.playertypes[this.playerType].description != false){
            	$(options.playertypes[this.playerType].description).appendTo(this.divId).addClass(options.captionClass);
            }

            //set caption if we are on an iPad homepage and would use thumbnails
            if($("body").hasClass('body-homepage') && options.use_html5 === true){
            	this.ipadCaption = '<p>Weitere Serien, Interviews und Reportagen finden Sie auf unserer neuen <a id="hp.global.sidebar.links.video" href="http://www.zeit.de/video">Video-Startseite</a>.</p>';
            }

            //add click event for html5 hd link
            $(this.divId).on("click", ".showVideoHd", function(event){

					event.preventDefault();

					//saveCurrentVideo
					var saveVideoUrl = that.videoUrl;

					if(that.hdText == options.showHdHtml5TextOff){
					//if hd should be switched off

						//switch hd link off for reinit
	   					that.hdText = options.showHdHtml5Text;
					}else{
					//if hd should be switched on

						//switch hd link off for reinit
	   					that.hdText = options.showHdHtml5TextOff;

	   					//load HD url
	   					that.videoUrl = that.videoUrlHd;
					}

        		that.reInitSettings();

      	    	//init player
      	    	that.initPlayer('vid');

      	    	//switch hd link on again
      	    	that.videoUrl = saveVideoUrl;
            });


        	//append click event for image
        	$(this.divId).on("click", '.stillImage', function(event){

        		event.preventDefault();

        		//reset player specific actions
        		that.reInitSettings();

      	    	//init player
      	    	that.initPlayer('vid');
        	});

   		};

   		//applies special settings for title and caption
   		this.specialTexts = function(mediaType){

   			var that = this;

   			if(mediaType == undefined){	mediaType = this.mediaType; }

   			//displayes date if set
            if(options.playertypes[this.playerType].showDate && this.date != '' && this.caption != ''){
            	this.caption = this.caption + " | " + this.date + " | ";
            }

            //display additional link if set
            if(options.playertypes[this.playerType].showSingleLink && this.caption != '' && mediaType == 'vid'){
            	this.caption = this.caption + ' <a title="[Video kommentieren]" href="'+ this.seoUrl +'#autoplay" class="more-link">' + options.playertypes[this.playerType].showSingleLink + '</a>';
  	        }

   			//set title as caption if applies
   			if(options.playertypes[this.playerType].titleonly){
   				this.caption = this.title;
   			}

   			//hide caption for playlists, if set
   			if(options.playertypes[this.playerType].hidePlaylistCaption == true && this.mediaType == 'pls'){
   				this.caption = '';
   			}

   			//change caption text for players with that show ipad caption
   			if(this.ipadCaption != '' && options.playertypes[this.playerType].useIpadCaption){
                this.caption = this.ipadCaption;
            }

   			//add link to title for players with navigation if applies
   			if(options.playertypes[this.playerType].showNavigation && options.playertypes[this.playerType].setCpLink != false){
   				//add link to video cp

   				if(this.playlistTitle != ''){
   					this.playlistTitle = '<a href="' + options.idstring + '">' + this.playlistTitle + '</a>';
   				}else if(this.title!= ''){
   					this.title = '<a href="' + options.idstring + '">' + this.title + '</a>';
   				}

   			}else if(options.playertypes[this.playerType].setSingleLink != false && mediaType == 'vid'){
   				//add link to video single
   				this.title = '<a href="'+ this.seoUrl +'#autoplay" alt="'+ this.title +'">' + this.title + '</a>';
   			}


   		};

   		//get thumbnails for playlist
   		this.getThumbs = function(playlistId){

   			var that = this;

   			if(this.videoList == false && playlistId != undefined){
   			//if video list doesn't exist - default id

   				//get playlist data, but don't initialise player again
   				options.appendPlayer = false;
   				this.callSolr(playlistId,'pls');

   			}else{
   			//if list of videos exists grab their data

   				//create solr video query string
   				var queryVideos = '';
   	   			var countVideos = 0;

   	   			//create solr video query string
   	   			$.each(this.videoList,function(key, value){

   	   				if(document.URL.indexOf("zip6-alt.zeit.de/new_vid") != -1){
   	   					var url = value.url.replace("http://zip6-alt.zeit.de/new_vid/","http://www.zeit.de/");
    					}else{
    						var url = value.url;
    					}

   	   				url = url.replace("http://www.","http://xml.");

   	   				if(countVideos>0){	queryVideos += '+OR+';	}
   	   				queryVideos += 'uniqueId:"' + url + '"';

   	   				countVideos++;
   	   			});

   	   			//build query
	   	        var myquery = options.api_base_url + queryVideos + '&rows=' + options.playertypes[this.playerType].navigationOffset + options.api_suffix_url_nav;

	   	        //get data
	   	        $.ajax({
	   	          url: myquery,
	   	          dataType: 'jsonp',
	   	          jsonp: 'json.wrf',
	   	          jsonpCallback: 'jsonp' + this.mediaId + 'nav',
	   	          success: function(data) {

	   	        	  //fill video object
	   	        	  $.each(data.response.docs, function(index,value){

	   	        		  var id = value.uniqueId.substring(value.uniqueId.lastIndexOf("/")+1,value.uniqueId.length);

                    that.videoList[id].supertitle = value.supertitle;
	   	        		  that.videoList[id].title	 = value.title;
	   	        		  that.videoList[id].image	 = value.uniqueId.replace( 'xml.zeit.de', 'www.zeit.de/zmo-assets') + '/imagegroup/still.jpg';

	   	        		  //form url for single video link
	   	        		  that.videoList[id].url = that.createUrlText(value.supertitle+'-'+value.title,that.videoList[id].url);

	   	        	  });

	   	        	  //if navigation is on the right hand side
	   	        	  if(options.playertypes[that.playerType].showNavigationRight){

	   	        		  //create HTML from list of video objects
	   	        		  var useThumbClass = 'playmedia';
	   	        		  var thumbHtml = that.createThumbHtml(countVideos,useThumbClass);

	   	        		  //if displayed on the right append to informatives
	   	        		  $('#informatives').prepend(thumbHtml);

	   	        	  }else{
	   	        	  //if navigation is below

	   	        		  //create HTML from List of video objects
	   	        		  var useThumbClass = 'playmediacp';
	   	        		  var thumbHtml = that.createThumbHtml(countVideos,useThumbClass);

	   	        		  //if displayed below, append to same bucket
	   	        		  $(that.divId).after(thumbHtml);

	   	        		  //display number of pages + actual page
	   	        		  that.updateCounter();

	   	        		  //if we have several pages, enable forward button
	   	        		  if($('ul',$(that.divId).siblings(options.vidRotator)).size() > 1){
			   	              $('.fwd_inactive',$(that.divId).siblings('.vid_nav')).addClass('fwd').removeClass('fwd_inactive');
		   	        	  }

	   	        		  //click events for forward and backward
	   	        		  $(that.divId).siblings('.vid_nav').delegate(".fwd","click", function(e){ that.naviClickEvent(e,'fwd'); });
	   	        		  $(that.divId).siblings('.vid_nav').delegate(".rwd","click", function(e){ that.naviClickEvent(e,'rwd'); });
	   	        		  $(that.divId).siblings('.vid_nav').delegate(".fwd_inactive","click", function(e){ e.preventDefault(); });
	   	        		  $(that.divId).siblings('.vid_nav').delegate(".rwd_inactive","click", function(e){ e.preventDefault(); });

	   	        	  }

	   	        	  //add play icon
	   	        	  if(typeof $.fn.videoIcon === 'function'){
	   	        		  $('.'+useThumbClass+' img',$(options.vidRotator)).videoIcon();
	   	        	  }

	   	          }});

   			}

   		};

   		//create HTML for video list
   		this.createThumbHtml = function(countVideos,useThumbClass){

   			var that = this;
   			var count = 1;
   			var thumbHtml = '';
   			var completeHtml = '';

   			//create Thumbnail HTML
   			$.each(this.videoList, function(index,value){

   				if(value.url !== undefined && value.image !== undefined && value.title !== undefined){

	   				//set margin
		   			var margin = '';
		   			if((count) % 2 === 0){	var margin = 'nomargin';}

		   			//set class for last element
		   			var addClass = '';
		   			if(count == 4 && options.playertypes[that.playerType].showNavigationRight){
		   				var addClass = ' last';
		            }

		   			//create real link if necessary
		            if(options.playertypes[that.playerType].navigationRealLinks == true){
		            	var href = value.url+'#autoplay';
		            }else if(options.playertypes[that.playerType].showNavigation){
		            	var href = that.divId;
		            }else{
		            	var href = '#';
		            }

                var stillImgTitle = 'Video: ' + value.supertitle + ' - ' + value.title;
                // delete hyphons from strings
                if( stillImgTitle.indexOf('"') != -1){
                  stillImgTitle = stillImgTitle.split('"').join('');
                }

		            //create HTML
		            thumbHtml 	+=	'<li class="narrow ' + margin + addClass + '">'
					      		+	'<a class="'+useThumbClass+'" data-sourceplsid="' + that.mediaId + '" data-mediaid="vid' + index + '" href="'+href+'">'
					      		+	'<img class="left" title="' +stillImgTitle+ '" alt="' +stillImgTitle+ '" height="99" width="175" width src="' + value.image + '" /></a><div class="title">'
					      		+	'<a class="'+useThumbClass+'" data-sourceplsid="' + that.mediaId + '" data-mediaid="vid' + index + '" href="' + href + '">'
					      		+ 	value.title + '</a></div></li>';

		            if((count) % 4 === 0 && countVideos >= count+1){
		            	thumbHtml += '</ul>';
		                if(options.playertypes[that.playerType].showNavigation){ thumbHtml += '<ul style="display:none">';}
		            }

	   				count++;

   				}
   			});

   			//create final html
        	if(options.playertypes[that.playerType].showNavigation){
        		//if thumbs should be listed below
        		completeHtml = options.headerNav +  '<ul>' + thumbHtml + '</ul>' + options.footerNav ;
        	}else{
        		//if thumbs should be listed on the right side
        		completeHtml = options.headerNavRight +  '<ul>' + thumbHtml + '</ul>' + options.footerNavRight ;

        		//if informatives exists put stuff in, otherwise append it first
        		if($('#informatives').size() <= 0){
        			$(that.divId).parent().after('<div id="informatives" class="panel-col-last panel-panel"></div>');
        		}
        	}

   			return(completeHtml);
   		};

   		//called before reload events to prevent side effects
   		this.reInitSettings = function(){

   			//append player
   			options.appendPlayer = true;

   			//dont load navigation again
    		options.playertypes[this.playerType].showNavigation 	= false;
  	      	options.playertypes[this.playerType].showNavigationRight= false;

  	      	//dont hide player this time
    		options.playertypes[this.playerType].hidePlayer = false;

    		//don't load in special Texts again
    		options.useSpecialTexts = false;

    		//activate autoplay
    		this.autoplayHtml5 								=	' autoplay="autoplay"';
  	    	this.autoplay	   								=	'true';

   		};

   		//append video tag or flash player and video properties
   		this.appendPlayer = function (usePlayer,mediaType){

   			var that = this;
   			var setPlayer = '';
   			var addClass = 'playimg';

   			if(mediaType == undefined){	mediaType = this.mediaType; }

   			//if theres a player in already, delete it
   			$(this.divId+' video').remove();

   			//single flash player are generated with xslt due to seo reasons
   			if(this.playerType != 'single'){
   				$(this.divId+' object').remove();
   			}else if(usePlayer == 'html5'){
   				$(this.divId+' object').remove();
   			}

   			$(this.divId+' .stillImage').remove();
   			$(this.divId+' .showVideoHd').remove();

            if(usePlayer == 'html5'){
            	//set HTML5 Player
            	setPlayer = this.html5Player;

            }else if(usePlayer == 'flash'){

            	//set regular player/ not for single pages
            	if(this.playerType != 'single'){
            		setPlayer = $('<div></div>').flashembed(this.regularPlayer,this.regularPlayerAdditional).find('object').show();
            	}else{

                //if single player just change autoplay options

                if( this.autoplay === 'true' ){

                  var getSrc = $(this.divId).find("object").attr("data");
                  $(this.divId).find("object").attr("data",getSrc+'&autoStart=' + this.autoplay);
                }

                if( navigator.userAgent.indexOf("MSIE") != -1 ){
                  $(this.divId+' object').remove();
                  setPlayer = $('<div></div>').flashembed(this.regularPlayer,this.regularPlayerAdditional).find('object').show();
                }
            	}

            }else if(usePlayer == 'image'){
            	//set still image
            	if(options.playertypes[this.playerType].largePlayButton != false){
            		addClass = options.playertypes[this.playerType].largePlayButton;
            	}
              var stillImgTitle = 'Video: ' + this.superTitle + ' - ' + this.title;
              var buttonAlt = 'Videostart: ' + this.superTitle + ' - ' + this.title;

              //delete hyphons from strings
              if( stillImgTitle.indexOf('"') != -1 ){
                stillImgTitle = stillImgTitle.split('"').join('');
              }
              if( buttonAlt.indexOf('"') != -1){
                buttonAlt = buttonAlt.split('"').join('');
              }

            	setPlayer = '<div class="stillImage"><img src="'+this.stillImage+'" alt="' +stillImgTitle+ '" title="' +stillImgTitle+ '" width="'+options.playertypes[this.playerType].width+'" height="'+options.playertypes[this.playerType].height+'"><span class="'+addClass+'" alt="' +buttonAlt+ '" title="' +stillImgTitle+ '"> </span></div>';
            }

            //append or prepend player
            if(setPlayer != ''){

            	if($(this.divId+" ."+options.titleClass).size() > 0 && options.playertypes[this.playerType].title_bottom == false){
            		$(this.divId).find("."+options.titleClass).after(setPlayer);
            	}else{
            		$(this.divId).prepend(setPlayer);
            	}

              $(setPlayer).attr("src", this.videoUrl);

              //enable webtrekk at play for html5 players
              if(usePlayer == 'html5'){

                var evId = this.mediaId;
                var startTriggered = false;
                var evTitle = 'redaktion.video...video../' +evId+ '/' + this.title + "_HTML5";
                var ivwCode = ( window.Z_IVW_RESSORT ? window.Z_IVW_RESSORT : "diverses/video" );

                //event on start
                $("#"+this.mediaType+this.mediaId).bind("play", function(event){

                  var ga = [ '_trackEvent', 'Video', 'START', evId ];

                  if( !startTriggered ){
                    ZEIT.clickWebtrekkOnly( evTitle + '/START' );
                    ZEIT.clickIVW( true, ivwCode );
                    ZEIT.clickGA( ga );
                    startTriggered = true;
                  }
                });

                //event on end
                $("#"+this.mediaType+this.mediaId).bind("ended", function(event){

                  var ga = [ '_trackEvent', 'Video', 'COMPLETE', evId ];

                  ZEIT.clickWebtrekkOnly( evTitle + '/COMPLETE' );
                  ZEIT.clickGA( ga );

                });
              }

            }

        	//enable parameter for secure browsing (flash only)
        	if(usePlayer == 'flash' && options.secureBrowsing == true){
        		$(this.divId).find("object").append('<param name="secureConnections" value="true" />');
        	}

   			//show HD Link if set and html5
   			if(options.playertypes[this.playerType].showHdHtml5 === true && (usePlayer == 'html5') && this.videoUrlHd != ''){

   				$(this.divId).find("video").after('<div class="showVideoHd"><a href="#">'+that.hdText+'</a></div>');
   				//$(this.divId).find("object").after('<div class="showVideoHd"><a href="#">'+that.hdText+'</a></div>');
   				$(this.divId).find(".showVideoHd a").wrap('<p class="caption"></p>');

   			}

            //add wrap class if set and show bucket
            if(options.playertypes[this.playerType].wrap != false){
            	$(this.divId).addClass(options.playertypes[this.playerType].wrap);
            }

            $(this.divId).show();

            //add special title and caption settings if applies
            if(options.useSpecialTexts == true){
            	this.specialTexts(mediaType);
            }

            //add caption to player
            if(this.caption != '' && options.playertypes[this.playerType].description){
            	 $(this.divId).find("."+options.captionClass).html(this.caption).show();
            }

            //if a Playlist Title was set, use it
            if(this.playlistTitle != '' && options.playertypes[this.playerType].usePlaylistTitle == true){
            	$(this.divId).find("."+options.titleClass).html(this.playlistTitle).show();
            }else if(this.title != ''){
            	$(this.divId).find("."+options.titleClass).html(this.title).show();
            }

   		};

   		//initialise player, decide about what to show
   		this.initPlayer = function (mediaType){

   			if(mediaType == undefined){	mediaType = this.mediaType; }

   	        // try to build the player and swfurl
   	        if(mediaType !== "" && this.mediaId !==""){

	   			//if we are on video cp, play only the first video of the playlist
   				if(options.cp_player_class == this.playerType){
   					this.mediaType = 'vid';
   					this.mediaId = this.firstPlVid;
   				}

   				//build swf Url
   		    	this.buildSwfUrl();

   	        	if(!(mediaType === 'pls') && options.appendPlayer !== false){

   	        		if(options.playertypes[this.playerType].hidePlayer == true && options.use_html5 != true){

   	        			//if still Image should be displayed first
   	        			this.appendPlayer('image');

   	        		}else if((flashembed.isSupported([10, 0]) && options.use_html5 == false)){

   	        			//if flash is supported
   	        			this.buildRegularPlayer();
	   	            this.appendPlayer('flash',mediaType);

	   	         	}else if((options.use_html5_browser || options.use_html5) && this.mediaType !== "aud"){

	   	         		//if HTML5 is supported
	   	         		this.buildHtml5Player();
	   	         		this.appendPlayer('html5',mediaType);

	   	         	}else if(!options.use_html5){
	   	         		//if neither mobile device nor html5
	   	         	  	$(this.divId).html(options.noFlash,mediaType);
	   	         	}

   	        	}

   	        	//if we have a navigation to build (not in ipad), grab thumbnails now
   	        	if((options.playertypes[this.playerType].showNavigation || options.playertypes[this.playerType].showNavigationRight) && this.ipadCaption == ''){

   	        		if(this.mediaType == 'pls'){
   	        			//get videos for actual playlist
   	        			this.getThumbs(this.mediaId);
   	        		}else if(options.playertypes[this.playerType].defaultPlaylist != false){
   	        			//get videos for default playlist
   	        			this.getThumbs(options.playertypes[this.playerType].defaultPlaylist);
   	        		}
   	        	}

   	        }

   	      };

   	      // Macht aus Rons Zulu Zeit für nicht Zuluianer ein (halbwegs) lesbares Datum
   	      this.zulu2date = function (zulutimestr) {

   	    	  if(zulutimestr === undefined){	return false;	}
   	    	  var date = [];
   	    	  date = zulutimestr.split("T")[0].split("-");
   	    	  return date[2] + "." + date[1] + "." + date[0];
   	      };

   	      //extract media id
   	      this.getID  = function (id,str,length) {

   	    	  // get id from class name
   	    	  var pos = str.search(id);
   	    	  return (pos <= 0) ? str.substring(pos+length) : false;
   	      };

   	      // avoid JSON Varnish Caching
   	      this.generateJSONPNumber = function(mediaID) {
   	    	  var jsonpnumber = mediaID;

   	    	  if(window.mediaIDs === undefined){
   	    		  window.mediaIDs = [];
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

   	      //update Video Navigation Counter
   	      this.updateCounter = function() {

   	    	  var that = this;

   	    	  //count number of videos
   	    	  var maxcount = $(this.divId).siblings(options.vidRotator).find(' ul').size();

   	    	  //run through lists
   	    	  $(this.divId).siblings(options.vidRotator).find(' ul').each(function(i){

   	    		  //if ul is visible, change page number display
   	    		  if($(this).is(':visible')){
   	    			  $(that.divId).siblings(".vid_nav").find(".numbers").html(i+1 + '/' + maxcount );
   	    		  }

   	    	  });
   	      };

   	      //click event for thumbnails
   	      this.naviClickEvent = function(e,direction){

   	    	  e.preventDefault();

   	    	  var thumbBucket	= $(this.divId).siblings(options.vidRotator);
   	    	  var videoNav 		= $(this.divId).siblings('.vid_nav');

   	    	  if(direction == 'fwd'){
   	    		  //if we wanne go forward
   	    		  var moreBuckets 	= $("ul:visible",thumbBucket).next().size();
   	    		  var reversive		= 'rwd';
   	    		  var following 	= $("ul:visible",thumbBucket).next("ul");
   	    		  var scndFollowing	= following.next().size();

   	    	  }else{
   	    		  //if we wanne go backward
   	    		  var moreBuckets 	= $("ul:visible",thumbBucket).prev().size();
   	    		  var reversive		= 'fwd';
   	    		  var following 	= $("ul:visible",thumbBucket).prev("ul");
   	    		  var scndFollowing	= following.prev().size();
   	    	  }

   	    	  //if there are previous or following buckets
   	    	  if(moreBuckets > 0){

   	    		  //make buttons in opposite direction clickable
   	    		  $("."+reversive+"_inactive",videoNav).addClass(reversive).removeClass(reversive+'_inactive');

   	    		  //hide all, but show next or previous bucket
   	    		  $("ul",thumbBucket).hide();
   	    		  following.show();

   	    		  //if there are no more followers, change button classes
   	    		  if(scndFollowing === 0){
   	    			  $("."+direction,videoNav).addClass(direction+'_inactive').removeClass(direction);
   	    		  }

   	    	  }else{
   	    		  //if there are no more followers, change button classes
   	    		  $("."+direction,videoNav).addClass(direction+'_inactive').removeClass(direction);
   	    	  }

   	    	  //update page display
   	    	  this.updateCounter();

   	      };

   	}

    return this.each (function (i) {

    	//add id to each player
    	$(this).attr("id",'player' + i);

    	//create ne video object and do presets
    	videoArray['player'+i] = new videoClass('player'+i);
    	videoArray['player'+i].getVideoSettings();

    	//get solr data and fill object values
    	if(videoArray['player'+i].mediaType !== undefined && options.mediatypes[videoArray['player'+i].mediaType].api_command !== undefined){
    		videoArray['player'+i].callSolr(videoArray['player'+i].mediaId);
    	}

    });
  };
}(jQuery));
