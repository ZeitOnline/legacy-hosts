// Mr. Check: mrc_ie4.js
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


	// ** parse all browser windows for a text selection.
function mrCheckFindSelection (w)
{
	var pattern;
	var TextRange;

	if (w.document.selection.type == "Text") 
	{
		TextRange = w.document.selection.createRange();
		pattern = TextRange.text;
	}

	if (pattern) 
	{
		return (pattern);
	}

	if(mrCheckFrames != 2)
	{
		for (var i=0; i<w.frames.length; i++) 
		{
			pattern = mrCheckFindSelection (w.frames[i]);
			if (pattern) 
			{
				return (pattern);
			}
		}
	}

	return "";
}                        

function mrCheckGetSelection()
{
        mrCheckPattern = mrCheckFindSelection(window.top);
        if (mrCheckPattern.length > 0) {
                window.top.status = 'Status: Button dr\u00FCcken und "' + unescape(mrCheckPattern) + '" recherchieren';
        } else {
                window.top.status = 'Wort markieren und Button klicken';
        }
        return true;
}
 

	// ** onMouseOut-Message
function mrCheckOnOut() {
        window.top.status = "";
        return true;
}
 

	// ** run Query against Database and start a new window
function mrCheckStartQuery()
{
	if (mrCheckPattern.length > 0) 
	{
		if(mrCheckPattern.length > 100)
		{
			alert ("Der markierte Text ist zu lang!");
		}
		else
		{
    		mrc_url = mrCheckUrl + '?SB=' + mrCheckPattern +  '&CID=' + mrCheckClient;                                        
        	if (!mrCheckWin || mrCheckWin.closed) 
			{
        		mrCheckWin = window.open (mrc_url,mrCheckTitle,'width=270,height=320,directories=0,fullscreen=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0');
        	} 
			else 
			{
        		mrCheckWin.location.href = mrc_url;
        	}

        	if(mrCheckWin) 
			{
           		// mrCheckWin.focus();
        	}
		}
	} 
	else 
	{
    	alert ("Sie m"+"\u00FC"+"ssen zuerst ein Wort markieren und\nanschlie"+"\u00DF"+"end den Button anklicken.");
    }

    return false;
}
 
 
	// ** Print mrCheck-Button
if(mrCheckOB == 0) {
	document.write ('<a href="' + mrc_url + '" onChange="alert()" onMouseOver="return mrCheckGetSelection();" onMouseOut="return mrCheckOnOut();" onClick="return mrCheckStartQuery();">' + mrCheckButton + '</a>');
}
