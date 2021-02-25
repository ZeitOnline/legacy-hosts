// Mr. Check
// markieren, klicken und die Erklaerung erscheint
//
// xipolis.net GmbH & Co. KG
// Copyright (c) 2001 by xipolis.net
//
// bei allg. Fragen:                    info@mr.check.de
// bei techn. Fragen oder Anmerkungen:  support@mr-check.de

// Usage:
// <SCRIPT LANGUAGE="JavaScript1.2" SRC="mr-check.js"></SCRIPT>
//
// --------------------------------------------------------------------
// Die nachfolgenden Variablen bitte entsprechend anpassen:


        // *** CLIENT_ID
        // Die URL/Adresse Ihrer Homepage ohne ('http://')
var mrCheckClient = "zeit";


var zip4Path = "http://zip4.zeit.de/bilder/elemente_01_06/elements/artikel/mrcheck_42x30.gif";

var zeusPath = "http://zeus.zeit.de/bilder/elemente_01_06/elements/artikel/mrcheck_42x30.gif";

        // *** BUTTON
        // Button der Gr??e 65x67 Pixel (Standard)
//var mrCheckButton = '<img src="http://zeus.zeit.de/images/mrcartikel.gif" alt="Mr. Check" border="0" onMouseOver="this.src=\'http://zeus.zeit.de/images/mrcartikel_over.gif\';" onMouseOut="this.src=\'http://zeus.zeit.de/images/mrcartikel.gif\';" onMouseDown="this.src=\'http://zeus.zeit.de/images/mrcartikel_over.gif\'" />';
		var mrCheckButton = '<img src="'+zeusPath+'" alt="Mr. Check" border="0" />';
        //
        // Button der Gr??e 54x56 Pixel
        // var mrCheckButton = '<img src="http://mr-check.xipolis.net/pic/mrcheck_button_54x56.gif" width="54" height="56" alt="Mr. Check" border="0">';
        //
        // Button der Gr??e 43x45
        // var mrCheckButton = '<img src="http://mr-check.xipolis.net/pic/mrcheck_button_43x45.gif" width="43" height="45" alt="Mr. Check" border="0">';
        //
        // Button der Gr??e 140x56 mit Erkl?rung
        // var mrCheckButton = '<img src="http://mr-check.xipolis.net/pic/mrcheck_button_140x56_mit_Erklaerung.gif" width="140" height="56" alt="Mr. Check" border="0">';
        //
        //
        // S/W Buttons
        // ------------------------------------------------------------
        // Button der Gr??e 65x67 Pixel
        // var mrCheckButton = '<img src="http://mr-check.xipolis.net/pic/mrcheck_button_sw.gif" width="65" height="67" alt="Mr. Check" border="0">';
        //
        // Button der Gr??e 54x56 Pixel
        // var mrCheckButton = '<img src="http://mr-check.xipolis.net/pic/mrcheck_button_54x56_sw.gif" width="54" height="56" alt="Mr. Check" border="0">';
        //
        // Button der Gr??e 43x45
        // var mrCheckButton = '<img src="http://mr-check.xipolis.net/pic/mrcheck_button_43x45_sw.gif" width="43" height="45" alt="Mr. Check" border="0">';



        // *** FRAMES
        // Frames oder nicht, ...
        //      - a) wenn Sie keine Frames nutzen, oder
        //        b) wenn Sie Frames nutzen, und alle Frames kommen von
        //           der gleichen Domain
        //        Setzen Sie:                           var mrCheckFrames = 0;
        //      - wenn Sie Frames nutzen mit Inhalten aus verschiedenen
        //        Domains, Text und Button sind aber im selben Frame-Fenster,
        //        setzen Sie:                           var mrCheckFrames = 2;
var mrCheckFrames = 0;

        // *** VERZEICHNIS
        // URL zum Verzeichnis, in dem die Mr. Check Javascripte liegen
        //      MIT abschliessendem '/'
        var mrCheckJsDir = "http://zeus.zeit.de/js/";

// hiernach sollten keine ?nderungen mehr n?tig sein
// --------------------------------------------------------------------

var mrCheckOB = 0;
var mrCheckUrl = "http://mr-check.xipolis.net/v2.0/Mrcheck.php";
document.write ('<script language="JavaScript" src="' + mrCheckJsDir + 'mrc-browser.js"></script>');
