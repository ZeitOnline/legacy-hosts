// Mr. Check: mrc_ns6up.js
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

	window.onerror=mrCheckFindSelection;
	pattern=w.document.getSelection();

	if(pattern)
	{
		return (pattern);
	}
	
    	for(var i=0; i < w.frames.length; i++)
	{
	     
	   	var pattern = mrCheckFindSelection (w.frames[i]);
       		if(pattern)
	   	{
	   		return (pattern);
	   	}
    	}
	   
    	return ("");
 }  
                   

//Mouseover
function mrCheckGetSelection()
{
	mrCheckPattern = window.document.getSelection();
	
	if( mrCheckPattern == '')
	 {
	       
        	mrCheckPattern = mrCheckFindSelection(window.top);
			
	 }

    if (mrCheckPattern.length > 0)
	 {
             window.top.status = 'Status: Button dr\u00FCcken und "' + unescape(mrCheckPattern) + '" recherchieren';
			 
			 return true;
				
     }
	else
	 {
             window.top.status = 'Wort markieren und Button klicken!';
			 
			 return true;
     }
    
	 
 }
 

	// ** onMouseOut-Message
function mrCheckOnOut() {
        window.top.status = "";
		
        return true;
}
 

	// ** run Query against Database and start a new window
	// ----------------------------------------------------
function mrCheckStartQuery()
{

	if(mrCheckPattern.length > 100)
    {
   		alert ("Der markierte Text ist zu lang!");
    }
	else
	{
		if (mrCheckPattern.length < 1)
		{
  			mrCheckPattern = '';
		}

		mrc_url = mrCheckUrl + '?SB=' + escape(mrCheckPattern) +  '&CID=' + mrCheckClient; 
		mrCheckWin = open(mrc_url,mrCheckTitle,'height=320,width=270,directories=0,fullscreen=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0');
	}

    return false;
}


	// ** Print mrCheck-Button
	// -----------------------

if(mrCheckOB == 0) {

	document.write ('<a href="' + mrc_url + '" onfocus="this.blur();" onmouseover="return mrCheckGetSelection();" onmouseout="return mrCheckOnOut();" onclick="return mrCheckStartQuery();">' + mrCheckButton + '</a>');
}

