// Mr. Check: mrcheck-browser.js
// markieren, klicken und die Erklaerung
//
// xipolis.net GmbH & Co. KG
// Copyright (c) 2001 by xipolis.net
//
// bei techn. Fragen oder Anmerkungen:  support@mr-check.de
 
// --------------------------------------------------------------------
// Nachfolgend bitte nur etwas ändern, wenn Sie wirklich wissen was
// Sie tun! (Für Anregungen und Verbesserungsvorschläge sind wir 
// jederzeit dankbar). 
// Ihr Mr. Check Team        


	// convert all characters to lowercase to simplify testing
var agt=navigator.userAgent.toLowerCase();

    	// *** BROWSER VERSION ***
    	// Note: On IE5, these return 4, so use is_ie5up to detect IE5.
var is_major = parseInt(navigator.appVersion);

	// Note: Opera and WebTV spoof Navigator.  We do strict client detection.
	// If you want to allow spoofing, take out the tests for opera and webtv.
var is_nav  = ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('spoofer')==-1)
        && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera')==-1)
        && (agt.indexOf('webtv')==-1) && (agt.indexOf('hotjava')==-1));
	var is_nav4 = (is_nav && (is_major == 4));
    	var is_navonly      = (is_nav && ((agt.indexOf(";nav") != -1) ||
                          (agt.indexOf("; nav") != -1)) );
    	var is_nav6up = (is_nav && (is_major >= 5));
    	var is_gecko = (agt.indexOf('gecko') != -1);


var is_ie     = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
	var is_ie3    = (is_ie && (is_major < 4));
    	var is_ie4    = (is_ie && (is_major == 4) && (agt.indexOf("msie 5")==-1) );
    	var is_ie5    = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.0")!=-1) );
    	var is_ie5_5  = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.5") !=-1));
    	var is_ie5up  = (is_ie  && !is_ie3 && !is_ie4);
    	// var is_ie5_5up =(is_ie && !is_ie3 && !is_ie4 && !is_ie5);
	var is_ie6 = (is_ie  && (is_major == 4) && (agt.indexOf("msie 6.0") !=-1));

var is_opera = (agt.indexOf("opera") != -1);
	var is_opera4 = (agt.indexOf("opera 4") != -1);
        var is_opera5 = (agt.indexOf("opera 5") != -1);
        var is_opera5up = (is_opera && (is_major >=4));


	// *** PLATFORM ***
var is_mac = (agt.indexOf("mac")!=-1);


	// *** Variablen Definitionen
var mrCheckPattern = "";
var mrCheckTitle = 'mrCheckAt' + mrCheckClient;
var mrCheckWin;
var mrCheckWhitespace = new RegExp('([ \\n\\t\\v\\r\\f]|%0D|%0A|%20)+', 'g');
var mrc_url = "";



	// *** getting the market text (depending on the browser)
if(is_nav4) {
        document.write ('<script language="JavaScript" src="' + mrCheckJsDir + 'mrc_ns4.js"></script>');
}
if(is_nav6up || is_opera5up) {
	document.write ('<script language="JavaScript" src="' + mrCheckJsDir + 'mrc_ns6up.js"></script>');
}
if(is_ie4 && !is_mac && !is_ie6) {
	document.write ('<script language="JavaScript" src="' + mrCheckJsDir + 'mrc_ie4.js"></script>');
}
if((is_ie5up || is_ie6) && !is_mac) {
	document.write ('<script language="JScript" src="' + mrCheckJsDir + 'mrc_ie5up.js"></script>');
}
