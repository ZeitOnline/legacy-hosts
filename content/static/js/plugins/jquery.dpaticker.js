/* 
* Zeit Online DPA Ticker Plugin
* integrates dpa ticker
*
*
* Copyright (c) 2013 ZEIT ONLINE, http://www.zeit.de
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*
* @author Anika Szuppa
* @author Nico Bruenjes
*/

(function( $, win ){

  $.fn.dpaticker = function() {

		// ticker options
		// defaulting to fb_mbl ('fussball_maennerbundesliga')
		var options = {
			agency: "dpa",
			alternateAppId: "App_FB_MBL",
			competitionId: "fb_mbl",
			deepLink: "",
			frameurl: "http://phpscripts.zeit.de/fussball-ticker",
			id: "app_FB_MBL",
			introPage: "",
			introTime: "",
			language: "de",
			mobile: false,
			pathConfig: "",
			pathCSS: "",
			pathFeed: "",
			pathImage: "",
			pathSrc: "",
			seasonId: "s2012",
			source: "dpa",
			updateTime: "30",
			urls: []
		},
		location = window.location.href,
		scriptSlug = "http://phpscripts.zeit.de/fussball-ticker",
		dataSlug = "http://phpscripts.zeit.de/fb_fwm";

		// update options
		var resetOptions = function ( competeId, season, testEnv ) {
			options.competitionId = competeId;
			options.id = "app_" + competeId.toUpperCase();
			options.seasonId = season;
			options.pathSrc = dataSlug + "/" + options.competitionId + "/src/";
			options.pathFeed = dataSlug + "/" + options.competitionId + "/feed/";
			options.pathImage = dataSlug + "/" + options.competitionId + "/images/";
			options.pathCSS = scriptSlug + "/feed/";
			options.pathConfig = scriptSlug + "/feed/";
			options.pathNavigation	= scriptSlug + "/feed/navigation-mbl.xml";
			options.optaStatistic = "false";
		};

		//build script urls
		var buildUrls = function() {
			//don't change element positions
			options.urls = [scriptSlug + "/js/jquery-1.7.2.min.js",
			dataSlug + "/" + options.competitionId +"/js/jquery.plugins.min.js",
			scriptSlug + "/js/click.js",
			dataSlug + "/" + options.competitionId + "/js/HTMLObject.js"];
		};

		// calls all scripts and at least the ticker
		var callScripts = function( index ) {
			$.getScript( options.urls[index], function( data ) {
				if (typeof options.urls[index+1] != 'undefined') {
					callScripts( index + 1 );
				} else {
					callTicker();
				}
			});
		};

		//load the ticker
		var callTicker = function(){
			//desktop ticker
			var htmlObject = new HTMLObject();
			htmlObject.embed( "Main.js", "dpaticker", options );
			htmlObject.start();
		};

		return this.each ( function () {

			//get competition && season
			var competeId = $(this).dataset("competition"),
			season = $(this).dataset("season"),
			testEnvRegEx = /(www\.)?zeit.de/,
			testEnv = ( !location.match( testEnvRegEx ) );

			if ( competeId && season ) {
				resetOptions(competeId, season, testEnv);
				buildUrls( competeId );
				options.frameurl += "/html_php/" + options.competitionId + ".html" + window.location.hash;
				$(this).append('<iframe id="id-sport-' + options.competitionId + '" src="' + options.frameurl + '" width="940" border="0" frameborder="0" height="800" scrolling="no" />');
			}
		});
	};

})( jQuery, window );