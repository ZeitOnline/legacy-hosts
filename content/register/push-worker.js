// 86acbd31cd7c09cf30acb66d2fbedc91daa48b86:1497280767.64
importScripts('https://web-sdk.urbanairship.com/notify/v1/ua-sdk.min.js');
importScripts('https://push.zeit.de/register/idb-keyval-min.js');
importScripts('https://push.zeit.de/register/push-worker-addon.js');

uaSetup.worker(self, {
  // This  has a default of `/push-worker.js`. It should live at the root of
  // your domain. It only needs to be specified if your worker lives at a
  // different path.
  workerUrl: 'https://push.zeit.de/register/push-worker.js',
  defaultIcon: 'https://img.zeit.de/register/img/zon.jpg',
  defaultTitle: 'ZEIT ONLINE',
  defaultActionURL: 'http://www.zeit.de',
  appKey: 'A-o39DtvRs-X2gvFwBApIQ',
  token: 'MTpBLW8zOUR0dlJzLVgyZ3ZGd0JBcElROm1udWtQTUpyTTA5NDUzSGxnMEpRMkdpaDVIX0d5VG9iTlRQQmdWWERnVTg',
  vapidPublicKey: 'BKuTYCHLR0YNzOUt11pFpntRprfXxEXG28n-UKvurakuP-xNT7yq5guWGuzWfmPUU0zU1xuI5vAidVoXRAsyXJg='
});