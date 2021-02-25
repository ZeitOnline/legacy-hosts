var zurueck_hi;
zurueck_hi = new Image();
zurueck_hi.src = "../images/basics/zw_nav_pfeil_bwd_hi.gif";

var zurueck_lo;
zurueck_lo = new Image();
zurueck_lo.src = "../images/basics/zw_nav_pfeil_bwd_lo.gif";

var weiter_hi;
weiter_hi = new Image();
weiter_hi.src = "../images/basics/zw_nav_pfeil_fwd_hi.gif";

var weiter_lo;
weiter_lo = new Image();
weiter_lo.src = "../images/basics/zw_nav_pfeil_fwd_lo.gif";



function showPict(bildname,bildsrc) {
if(! bildsrc){
bildsrc = bildname;
}
eval('document.images["' + bildname + '"].src = ' + bildsrc + '_hi.src');
}

function hidePict(bildname,bildsrc) {
if(! bildsrc){
bildsrc = bildname;
}
eval('document.images["' + bildname + '"].src = ' + bildsrc + '_lo.src');
}

