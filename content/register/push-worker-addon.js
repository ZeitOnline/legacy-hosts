function sendPushInfoToWT(ct, actionType) {
	Promise.all([idbKeyval.get('eid'), idbKeyval.get('breakpoint')])
	.then(function(results) {
		var eid, ck4, ck5, ck8, ck9;
		eid = results[0];
		ck4 = results[1];
		ck5 = 'push';
		ck8 = 'browser';
		ck9 = actionType;

		// get request
		fetch('https://audev.zeit.de/981949533494636/wt?ct=' + encodeURIComponent(ct) + '&eid=' + eid + '&ck4=' + ck4 + '&ck5=' + ck5 + '&ck8=' + ck8 + '&ck9=' +ck9, {'mode': 'no-cors'});
	});
}

function formatURL(url) {
	var url = url.split('?')[0]; // remove query-param if existent
	url = url.replace(/^https?:\/\//,''); // remove http
	return url;
}

self.addEventListener('push', function(event) {
	if (event.data) {
		var actionURL = formatURL(Object.values(event.data.json().action)[0]);
		sendPushInfoToWT(actionURL, 'received');
	}
});

self.addEventListener('notificationclick', function(event) {
	if(event.notification.data) {
		var actionURL = formatURL(Object.values(event.notification.data.action)[0]);
		sendPushInfoToWT(actionURL, 'open');
	}
});