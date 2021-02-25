(function($) {
  /*
    * Zeit Online Titelfluss Embed Plugin
    * This script embeds videos from div tags and takes class names as parameters
    * 
    * depends on jquery.toolbox.flashembed
    *  
    * Copyright (c) 2009 ZEIT ONLINE, http://www.zeit.de
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    *
    * @author Marc Tönsing
    *
    */
    
  $.fn.titelfluss = function (options) {
    	
	options = $.extend({
	  year: 		'',
	  easteregg: 	''
	}, options);
	var now = new Date();
	var year = now.getFullYear();
	options.year = year;

	var get_id = function (id,str) {
	  var pos = str.search(id);
	  return (pos<=0) ? str.substring(pos+4) : false;
	}

	return this.each(function () {
            
	  var myClasses=$(this).attr('class').split(' ');
	  for (var i = 0; i < myClasses.length ; i++ ) {
		// get video id from classes
		if (myClasses[i].substring(4,0) == 'year') {
		  options.year 			= get_id('year', myClasses[i]);
		}
	  }

	  if(flashembed.isSupported([10, 0])){
		if(options.easteregg == true){
		  console.info("Easteregg Mode on ;-)");
		  $(this).flashembed({
			height: 304,
			width: 580,
			easteregg: true,
			src: 'http://images.zeit.de/static/flash/zeit.titelfluss/titelfluss.swf?easteregg=true'
		  },{
			allowFullScreen: true,
			easteregg: true,
			allowScriptAccess: "always"
		  });
		}else{
		  $(this).flashembed({
			height: 304,
			width: 580	,
			allowScriptAccess: "always",
			src: 'http://images.zeit.de/static/flash/zeit.titelfluss/titelfluss.swf'
		  },{
			allowFullScreen: true,
			xmlpath: 'http://xml.zeit.de/bilder/titelseiten_zeit/xml-titelfluss/' + options.year +'.xml',
			allowScriptAccess: "always"
		  });
		}
	  }else{
		$(this).html('<p class="noflash"><strong>Leider konnte kein aktueller Flashplayer in ihrem Browser gefunden werden.</strong> <br />Dieser wird jedoch zwingend für diesen Multimedia-Inhalt auf ZEIT Online benötigt. Bitte installieren sie die <a href="http://www.adobe.com/go/getflashplayer">neuste Adobe Flashplayer Version</a>.</p>');
	  }
	});
  };

})(jQuery);