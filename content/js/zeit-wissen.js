var ord;
var ord=Math.random()*10000000000000000;

function newImage(arg) {
	if (document.images) {
		rslt = new Image();
		rslt.src = arg;
		return rslt;
	}
}

function changeImages() {

	if (document.images && (preloadFlag == true)) {
		for (var i=0; i < changeImages.arguments.length; i+=2) {
			document[changeImages.arguments[i]].src = changeImages.arguments[i+1];
		}
	}
}

var preloadFlag = false;

function preloadImages() {

	if (document.images) {
	  abo_over = newImage("http://zeus.zeit.de/bilder/marktplatz/abo_hellblau-over.gif");
		zeit_reisen_over = newImage("http://zeus.zeit.de/bilder/marktplatz/zeit_reisen_hellblau-over.gif");
		sidestep_over = newImage("http://zeus.zeit.de/bilder/marktplatz/sidestep_hellblau-over.gif");
		veranstaltungen_over = newImage("http://zeus.zeit.de/bilder/marktplatz/veranstaltungen_hellblau-over.gif");
		kultur_over = newImage("http://zeus.zeit.de/bilder/marktplatz/kultur_hellblau-over.gif");		
		partnersuche_over = newImage("http://zeus.zeit.de/bilder/marktplatz/partnersuche_hellblau-over.gif");
		jobs_over = newImage("http://zeus.zeit.de/bilder/marktplatz/jobs_hellblau-over.gif");
		sunstep_over = newImage("http://zeus.zeit.de/bilder/marktplatz/sunstep_hellblau-over.gif");
		audible_over = newImage("http://zeus.zeit.de/bilder/marktplatz/audible_hellblau-over.gif");
		immobilien_over = newImage("http://zeus.zeit.de/bilder/marktplatz/immobilien_hellblau-over.gif");
		car_step_over = newImage("http://zeus.zeit.de/bilder/marktplatz/autos_hellblau_over.gif");	
		shop_over = newImage("http://zeus.zeit.de/bilder/marktplatz/shop_hellblau-over.gif");
		ebalance_over = newImage("http://zeus.zeit.de/bilder/marktplatz/e-balance_hellblau-over.gif");
		marktplatz_link_over = newImage("http://zeus.zeit.de/bilder/elemente/marktplatz_link_over.gif");
	drucken_over = newImage("http://zeus.zeit.de/bilder/elemente/drucken_over_56.gif");
	pdf_ansicht_over = newImage("http://zeus.zeit.de/bilder/elemente/pdf_ansicht_over_74.gif");
	versenden_over = newImage("http://zeus.zeit.de/bilder/elemente/versenden_over_68.gif");
	audio_over = newImage("http://zeus.zeit.de/bilder/elemente/audio_over_44.gif");
	
	senden = newImage("http://zeus.zeit.de/bilder/elemente/zeit-wissen/senden_02.jpg");
	zurueck = newImage("http://zeus.zeit.de/bilder/elemente/zeit-wissen/zurueck_02.jpg");
	preloadFlag = true;
	}
}


function init() {
	preloadImages();
}

function openme(zielurl,breite,hoehe,pos,name,scroll_value){

if(scroll_value=="yes") {
scroll_value="yes";
}
else {
scroll_value="no";
}


var links;
var oben;
var breite = breite;
var hoehe = hoehe;

	if (pos == "middle") {
	links = (screen.width - breite) /2;
	oben = 20;
	}
	else {
	links =  (screen.width - breite) /2 + 55;
	oben = (screen.height - hoehe) /2 - 16;
	}
//picwin=window.open(zielurl,name,'');
//picwin.close();
picwin=window.open(zielurl,name,"toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars="+ scroll_value + ",resizable=no,copyhistory=no,height=" + hoehe + ",width=" + breite + ",left=" + links +",top=" + oben +"");
picwin.focus();
}

function submit_form(myform) {
var dieform = eval("document." + myform);
dieform.submit();
}