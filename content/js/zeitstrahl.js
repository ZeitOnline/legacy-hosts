var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{	// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 	// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

window.onload = function() {
	if(BrowserDetect.browser == "Safari") {
		document.getElementById('topper').innerHTML = '';
		document.getElementById('botter').innerHTML = '';
	}
}

var mydiv = document.getElementById('thetable');
var scrolling = false;
var intID;


stop = function() {
	clearInterval(intID);
}

moveup = function () {
	intID = setInterval("scrollme('up')",.1);
}

movedown = function () {
	intID = setInterval("scrollme('down')",.1);
}


scrollme = function(dest) {
	if(BrowserDetect.browser != "Safari") {
		if(dest == "down") {
			add = 1;
		} else {
			add = -1;
		}
		if(document.all) {
			curr = document.body.scrollTop;
			if(curr != document.body.offsetHeight) {
				curpos = curr + add;
				window.scroll(curr, curpos);
			}
		} else {
			curr = window.pageYOffset;
			if(curr != window.innerHeight) {
				curpos = curr + add;
				window.scroll(curr, curpos);
				curr = curpos;
			}
		}
	} else {
		return false;
	}
}

function openme(zielurl,breite,hoehe,pos,name,scroll_value)

{

	if(scroll_value=="yes") 

	{

		scroll_value="yes";

	}

	else 

	{

		scroll_value="no";

	}



	var links;

	var oben;

	var breite = breite;

	var hoehe = hoehe;

	var ziel = "";



	if (pos == "middle") 

	{

		links = (screen.width - breite) /2;

		oben = 20;

	}

	else if (pos == "right") 

	{

		links = screen.width;

		oben = 0;

	}

	else 

	{

		links =  (screen.width - breite) /2 + 55;

		oben = (screen.height - hoehe) /2 - 16;

	}

	

	if (zielurl.indexOf(".mov") != -1) 

	{

		hoehe = hoehe + 80;

		breite = breite;

		if (zielurl.indexOf("apollo.zeit.de/redirects/cc") != -1)

		{

			ziel = zielurl.replace(/cc/,"play_mm")+"&height="+hoehe+"&width="+breite;

		}

		else

		{

			ziel = "http://apollo.zeit.de/redirects/play_mm.php?to="+zielurl+"&height="+hoehe+"&width="+breite;

		}



	}

	else if (zielurl.indexOf(".mp3") != -1)

	{

		hoehe = hoehe + 80;

		breite = breite;

		if (zielurl.indexOf("apollo.zeit.de/redirects/cc") != -1)

		{

			ziel = zielurl.replace(/cc/,"play_mm")+"&height="+hoehe+"&width="+breite;

		}

		else

		{

			ziel = "http://apollo.zeit.de/redirects/play_mm.php?to="+zielurl+"&height="+hoehe+"&width="+breite;

		}

	}

	else

	{

		ziel = zielurl;

	}



	picwin=window.open(ziel,name,"toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars="+ scroll_value + ",resizable=yes,copyhistory=no,height=" + hoehe + ",width=" + breite + ",left=" + links +",top=" + oben +"");

	picwin.focus();

}
