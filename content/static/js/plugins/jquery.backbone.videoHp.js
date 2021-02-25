/*
* Zeit Online Video HP Player Plugin
*
* Copyright (c) 2013 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* depends on backbone.js / underscore.js: http://backbonejs.org/ / http://underscorejs.org/
*
* @author Anika  Szuppa
*/

(function( $ ) {
  $.fn.videoHp = function( options ) {

  	var dropdownTriggerCounter = 1;

  	var settings = {
  		pluginDiv	: this,
  		videoUrl	: 'http://zeit.de',
  		videoRessort: '/video',
  		videoTitle : 'Video: ',
  		buttonTitle : 'Videostart: ',
  		playlistId  : 36516804001,
  		standartImage	: '/static/img/videoplayer/video-platzhalter.jpg',
  		htmlSmallNav: function( url, stillUrl, name, supertitle, trackingPosition){
  		//function used as template to build small player navigation

  			var title = this.videoTitle + supertitle + ' - ' + name;
  			var buttonTitle = this.buttonTitle + supertitle + ' - ' + name;

  			//delete hyphons
  			if( title.indexOf( '"' ) != -1 ){
  				title = title.split( '"' ).join( '' );
  			}
  			if( buttonTitle.indexOf( '"' ) != -1 ){
  				buttonTitle = buttonTitle.split( '"' ).join( '' );
  			}


  			var position = String.fromCharCode(97 + trackingPosition);

  			var targetURL = url.split("/");
  			var path = "";
  			for ( i = 3; i < targetURL.length; i++ ) {
  			  path += "/";
  			  path += targetURL[i];
  			}

  			var tracking_id_image = "hp.centerpage.teaser.video." + ($('.zol_videohp').prevAll('.parquet-ressort').length + 1) + ".2." +position+ ".small.image." +path;
  			var tracking_id_title = "hp.centerpage.teaser.video." + ($('.zol_videohp').prevAll('.parquet-ressort').length + 1) + ".2." +position+ ".small.title." +path;

  			var html = '<li class="box">'
				 		+ '<a href="' +url+ '#autoplay" id="' +tracking_id_image+ '" title="' +supertitle+ ' - ' +name+ '"><div><img src="' +stillUrl+ '" title="' +title+'" alt="' +title+ '"/>'
						+ '<span class="playimg" title = "' +title+ '" alt="' + buttonTitle + '">&nbsp;</span></div></a>'
						+ '<a href="' +url+ '#autoplay" id="' +tracking_id_title+ '" title="' +supertitle+ ' - ' +name+ '"><h2 class="title"><strong>' +supertitle+ ' </strong><span>' +name+ '</span></h2></a>'
						+ '</li>';

			return( html );
  		},
  		htmlBigNav	: function( url, stillUrl, name, supertitle, trackingPosition){
  		//function used as template to build big player navigation
  			var title = this.videoTitle + supertitle + ' - ' + name;
  			var buttonTitle = this.buttonTitle + supertitle + ' - ' + name;

  			//delete hyphons
  			if( title.indexOf( '"' ) != -1 ){
  				title = title.split( '"' ).join( '' );
  			}
  			if( buttonTitle.indexOf( '"' ) != -1 ){
  				buttonTitle = buttonTitle.split( '"' ).join( '' );
  			}


  			var position = String.fromCharCode(97 + trackingPosition);

  			var targetURL = url.split("/");
  			var path = "";
  			for ( i = 3; i < targetURL.length; i++ ) {
  			  path += "/";
  			  path += targetURL[i];
  			}

  			var tracking_id_image = "hp.centerpage.teaser.video." + ($('.zol_videohp').prevAll('.parquet-ressort').length + 1) +"." +(trackingPosition+2)+ ".b.large.image." +path;
  			var tracking_id_title = "hp.centerpage.teaser.video." + ($('.zol_videohp').prevAll('.parquet-ressort').length + 1) +"." +(trackingPosition+2)+ ".b.large.title." +path;


  			var html 	= '<div><a href="' +url+ '#autoplay" id="' +tracking_id_image+ '" title="' +supertitle+ ' - ' +name+ '"><img src="' + stillUrl + '" title="' +title+ '" alt="' +title+ '"/>'
						+ '<span class="playimg" title="' +title+ '" alt="' + buttonTitle + '">&nbsp;</span></a>'
						+ '<h2 class="title"><strong>' +supertitle+ ' </strong><a href="' +url+ '#autoplay" id="' +tracking_id_title+ '" title="' +supertitle+ ' - ' +name+ '">' +name+ '</a></h2></div>';

			return( html );
  		},
  		htmlBigPlayer: function( id, stillUrl, name, supertitle){
  		//function used as template to build smartplayer preview

  			var title = this.videoTitle + supertitle + ' - ' + name;
  			var buttonTitle = this.buttonTitle + supertitle + ' - ' +name;

  			// delete hyphons
  			if( title.indexOf( '"' ) != -1 ){
  				title = title.split( '"' ).join( '' );
  			}
  			if( buttonTitle.indexOf( '"' ) != -1 ){
  				buttonTitle = buttonTitle.split( '"' ).join( '' );
  			}


  			var html 	= '<div class="hpplayer_player" data-id="' +id+ '">'
						+ '<div class="stillImage">'
						+ '<span class="button_large" title="' +title+ '" alt="' + buttonTitle + '"></span>'
						+ '<img class="preview" src="' +stillUrl+ '" title="' +title+ '" alt="' +title+ '"></div>'
						+ '<div class="video_name"><strong>' +supertitle+ ' </strong><h2 class="title">' +name+ '</h2></div>'
						+ '</div>';

			return( html );
  		},
  		htmlSmartplayer: function( id ){
  		//function used as template to build smartplayer

			var html = '<object id="myExperience' +id+ '" class="BrightcoveExperience">'
					+ '<param name="htmlFallback" value="true" /> '
				  	+ '<param name="bgcolor" value="#FFFFFF" />'
				  	+ '<param name="width" value="580" />'
				  	+ '<param name="height" value="326" />'
				  	+ '<param name="playerID" value="71289488001" />'
				  	+ '<param name="playerKey" value="AQ~~,AAAABDk7jCk~,Hc7JUgOccNp4D5O9OupA8T0ybhDjWLSQ" />'
				  	+ '<param name="isVid" value="true" />'
				  	+ '<param name="isUI" value="true" />'
				  	+ '<param name="dynamicStreaming" value="true" />'
				  	+ '<param name="@videoPlayer" value="' +id+ '" />'
					+ '<param name="includeAPI" value="false" />'
					+ '<param name="autoStart" value="true" />'
					+ '</object>';

			return( html );

  		}
  	};

	if( options ){
		$.extend( settings, options );
	}

	//as I cant bring bb models to work with our solr, we have to write our own model
	var modelSolr = function( id, solrUrl, videoArray ){

		if( id != false ){
			//playlist call
			var url = 'http://www.zeit.de/website-solr/select/?version=2.2&indent=on&wt=json&fl=referenced,type&q=bc_id_s:"' + id + '"';
		}else{
			//single video call (will be generated after first call)
			var url = solrUrl + "%22";
		}

		//due to keep videos in the right order we have to sort them
		if( !videoArray ){
			var videoArray = [];
		}

		var callback = id + Math.floor(Math.random()*101);

		$.ajax({
	    	url: url,
			dataType: 'jsonp',
	   		jsonp: 'json.wrf',
	    	jsonpCallback: 'jsonp' + callback,
	  		success: function( data ) {

				var showVideos = new videoView();

				if( showVideos.validateSolrData( data ) ){

					if( data.response.docs[0].type === 'playlist' ){
					//if we have a playlist here, we have to build a new solr query and call again

						var singleVideos = 'http://www.zeit.de/website-solr/select/?version=2.2&indent=on&rows=30&wt=json&fl=uniqueId,title,type,supertitle,teaser_text,graphical-preview-url-large&q=uniqueId:%22';
						var count = 0;
						var maxVideos = 6;

						$.each( data.response.docs[0].referenced, function( index, value ){

							if( count < maxVideos ){
								var id = parseInt( value.substring( value.lastIndexOf("/")+1 ) );
								videoArray.push( { id : id, name: '', supertitle: 'Video', url: false } );
								singleVideos += value;

								if( index != maxVideos -1 ){
									singleVideos += "%22+OR+uniqueId:%22";
								}

								count++;
							}

						});

						//repeat the call to get contents for every video
						modelSolr( false, singleVideos, videoArray );

					}else{
					//otherwise we can render our videos

						var firstId = false;

						//but first put videos into the right order and map them according to BC properties
						$.each( data.response.docs, function( indexData, valueData ){
							var id = parseInt( valueData.uniqueId.substring( valueData.uniqueId.lastIndexOf("/")+1 ) );

							$.each( videoArray, function( index, value ){
								if( value.id == id){
									this.url = valueData.uniqueId;
						           	this.videoStillURL = this.url.replace( 'xml.zeit.de', 'www.zeit.de/zmo-assets') + '/imagegroup/still.jpg';

						           	if( valueData.title ){
						           		this.name = valueData.title;
						           	}

						           	if( valueData.supertitle ){
						           		this.supertitle = valueData.supertitle;
						           	}

								}
							});

						});

						//if everything's finished, send videos to be rendered
						showVideos.render( videoArray );
					}

				}
	        }
	  	});
	};

	//used for calling bc playlists
	var modelBc = Backbone.Model.extend({
		url: function() {
	    	return 'http://api.brightcove.com/services/library?command=find_playlist_by_id&video_fields=creationDate%2id%2Cname%2CvideoStillURL%2CcustomFields&media_delivery=http&token=80sICa_ciDeciP7ZUt8mj8ReeaFUDsiXSHRtuV9Om9fBmJLJf6SwXg..&playlist_id=' + this.get( "id" ) + '&callback=?';
	  	}
	});

	//used for calling bc single videos
	var modelBcSingle = Backbone.Model.extend({
		url: function() {
	    	return 'http://api.brightcove.com/services/library?callback=?&command=find_video_by_id&media_delivery=http&video_fields=id%2CcustomFields%2Cname%2CvideoStillURL&token=80sICa_ciDeciP7ZUt8mj8ReeaFUDsiXSHRtuV9Om9fBmJLJf6SwXg..&video_id=' + this.get( "id" ) + '&callback=?';
	  	}
	});

	//standart view is managing switch and validation
	var videoView = Backbone.View.extend({
		el: settings.pluginDiv,
		minVideos: 4,
		render: function( data ){

			//set path to single video pages
			if( window.www_root ){
				settings.videoUrl = window.www_root;
			}

			//adapt links to environment
			this.$el.find( ".hpplayer_header .title_link a" ).attr( 'href', settings.videoUrl + settings.videoRessort );
			this.$el.find( ".hpplayer_header .title a" ).attr( 'href', settings.videoUrl + settings.videoRessort );

			this.switchPlayer( data );

		},
		switchPlayer: function( data ){
		//define which player type should be used

			var that = this;
			var video = new modelBcSingle( { id: data[0].id } );
			video.fetch( {
				success: function( bcResult ){

					if( that.validateBcData( bcResult, true ) && bcResult.attributes.customFields.hp_bigplayer == 'true'){
					//go for the big one
						that.$el.addClass( "big" );
						that.$el.removeClass( "small" );
						var showBigView = new videoViewBig();
						showBigView.render( data );

					}else{
					// stick to small one
						var showSmallView = new videoViewSmall();
						showSmallView.render( data );
					}

				}
			});
		},
		fallback: function( ){
		//keep this in, just in case

			var that = this;

			var video = new modelBc( { id: settings.playlistId } );
			video.fetch( {
				success: function( data ){
							if( that.validateBcData( data ) ){
								that.$el.addClass( "big" );
								that.$el.removeClass( "small" );
								var showBigView = new videoViewBig();
								showBigView.render( data.attributes.videos );
							}
				}
			} );

		},
		validateSolrData: function( data ){
		//test if everything is alright with our solr data

			if( data.response ){
				if( data.response.docs.length == 0){
					this.$el.hide();
					return( false );
				}else{
					if( data.response.docs[0].type === 'playlist' && data.response.docs[0].referenced.length == 0){
						this.$el.hide();
						return( false );
					}else if( data.response.docs[0].type === 'video' && data.response.docs.length < this.minVideos ){
						this.$el.hide();
						return( false );
					}
				}
			}else{
				this.$el.hide();
				return( false );
			}

			return( true );
		},
		validateBcData: function( data, switchPlayer ){
		//test if everything is alright with our bc data

			if( !data.attributes.error ){
				if( !data.attributes.customFields && !data.attributes.videos){

					//if we are not in switch player mode, better hide the whole thing
					if( !switchPlayer ){
						this.$el.hide();
					}

					return( false );
				}
			}else{

				//if we are not in switch player mode, better hide the whole thing
				if( !switchPlayer ){
					this.$el.hide();
				}

				return( false );
			}

			return( true );

		},
		callSeries: function( event ){
		//function for change of select, open link to series in same window
			//For some reason the dropdown change event tries to fire twice. this is to prevent that behaviour and get realistic tracking results
			if (dropdownTriggerCounter < 2) {
				var link = $( event.currentTarget ).find( 'option:selected' ).attr( 'data-url' );
				var serieTitel = $( event.currentTarget ).find( 'option:selected' ).attr( 'value' );

				//Tracking (webtrekk)
				var tracking_id_dropdown = "hp.centerpage.teaser.video." + ($('.zol_videohp').prevAll('.parquet-ressort').length + 1) + ".1.a.dropdown." +serieTitel+ "./serie/" +link;
				ZEIT.clickWebtrekkOnly(tracking_id_dropdown);

				if( link ){
					//Set timout because the webtrekk tracking script needs a little time to load before the browser 'jumps' away.
					setTimeout(function(){
						window.open( settings.videoUrl + '/serie/' + link, '_self' );
					},80);
				}

				dropdownTriggerCounter++;
			}
		},
		events: {
			'change .hpplayer_dropdown select' : 'callSeries'
		}
	});

	var videoViewBig = Backbone.View.extend({
		el: settings.pluginDiv,
		maxVideos: 3,
		render: function( data ){
		//build together html and append video nav and player to site

			var html = this.buildHtml( data );
			this.$el.append( html );
		},
		buildHtml: function( data ){

			var that = this;
			var html = '<div class="hpplayer_links">';
			var count = 0;

			//build vid link area
			$.each( data, function( index, value ){

				if( count < that.maxVideos && index != 0 && value.url ){
					html += settings.htmlBigNav( value.url.replace( "http://xml.zeit.de", settings.videoUrl ) , that.fallbackImage( value.videoStillURL ), value.name, value.supertitle, count );
					count = count+1;
				}
			});

			html += '</div>';

			//build player preview
			html += settings.htmlBigPlayer( data[0].id, that.fallbackImage( data[0].videoStillURL ), data[0].name, data[0].supertitle );

			return( html );
		},
		playVideo: function( event ){
		//play video in bc player

			//only applies if we see the still image
			if( event.target.tagName != 'OBJECT'){
				$( this.$el ).find( '.stillImage' ).empty().append( settings.htmlSmartplayer( $( '.hpplayer_player' ).attr( "data-id" ) ) );
				brightcove.createExperiences();
			}


		},
		fallbackImage: function( image ){
		//returns standart image if necessary

			if( image == '' || image == undefined || image == null){
				return( settings.videoUrl + settings.standartImage );
			}else{
				return( image );
			}

		},
		events: {
			'click .stillImage img' : 'playVideo',
			'click .stillImage .button_large' : 'playVideo'
		}
	});

	var videoViewSmall = Backbone.View.extend({
		el: settings.pluginDiv,
		maxVideos: 4,
		render: function( data ){
		//build together html and append video nav to site

			var html = this.buildHtml( data );
			this.$el.append( html );

		},
		buildHtml: function( data ){
		//build html for each video element

			var html ='<ul>';
			var that = this;
			var count = 0;

			$.each( data, function( index, value ){

				if( count < that.maxVideos && value.url ){
					html += settings.htmlSmallNav( value.url.replace( "http://xml.zeit.de", settings.videoUrl ) , that.fallbackImage( value.videoStillURL ), value.name, value.supertitle, count );
					count = count+1;
				}
			});

			html += '</ul>';
			return( html );
		},
		fallbackImage: function( image ){
		//returns standart image if necessary

			if( image == '' || image == undefined || image == null){
				return( settings.videoUrl + settings.standartImage );
			}else{
				return( image );
			}

		}
	});

	//if there's a data-id being set, choose it
	if( settings.pluginDiv.attr('data-id') ){
		settings.playlistId = settings.pluginDiv.attr('data-id');
	}

	//as we have to begin with the stupid solr stuff, we can't do it the real bb way
	modelSolr( settings.playlistId );

  };//end of plugin
})( jQuery );