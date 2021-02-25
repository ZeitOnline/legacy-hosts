// self executing anonymous function
(function() {
  // redirect if file in wrong scope
  if(window.location != 'https://push.zeit.de/register/index.html') {
    window.location.replace('https://push.zeit.de/register/index.html');
  }

  function isSupported() {
    if (!!(navigator.serviceWorker && window.PushManager)) {
      return true;
    }
    else {
      return false;
    }
  }

  var supported = isSupported();
  var optedIn = false;
  var tagGroup = 'subscriptions';
  var tagEil = 'Eilmeldung';
  var tagNews = 'News';
  var hasEil = false;
  var hasNews = false;

  function checkForSubscriptions(sdk) {
    if(sdk.channel && sdk.channel.optedIn){ // channel object only available if browser has registered
      optedIn = sdk.channel.optedIn;
      hasEil = sdk.channel.tags.has('Eilmeldung', tagGroup);
      hasNews = sdk.channel.tags.has('News', tagGroup);
      document.getElementById('js-bpl-error').style.display = 'none';
      document.getElementById('js-bpl-activation').style.display = 'none';
      document.getElementById('js-bpl-selection').style.display = 'flex';      
      if ( hasEil || hasNews) {
        document.getElementById('js-bpl-status').className = 'bpl__status bpl__status--success';
      } else {
        document.getElementById('js-bpl-status').className = 'bpl__status bpl__status--nothing-selected';
      }
      if( hasEil ){
        document.getElementById('js-sub-message-eil').className = 'bpl__sub-message bpl__sub-message--active';
        document.getElementById('js-eil-box').className = 'bpl-notification-box bpl-notification-box--active';
        document.getElementById('js-eil-box-btn').innerText = 'Deaktivieren';      
      } else {
        document.getElementById('js-sub-message-eil').className = 'bpl__sub-message';
        document.getElementById('js-eil-box').className = 'bpl-notification-box';
        document.getElementById('js-eil-box-btn').innerText = 'Aktivieren';
      }
      if( hasNews ){
        document.getElementById('js-sub-message-lesetipps').className = 'bpl__sub-message bpl__sub-message--active';
        document.getElementById('js-recommended-box').className = 'bpl-notification-box bpl-notification-box--active';
        document.getElementById('js-recommended-box-btn').innerText = 'Deaktivieren'; 
      } else {
        document.getElementById('js-sub-message-lesetipps').className = 'bpl__sub-message';
        document.getElementById('js-recommended-box').className = 'bpl-notification-box';
        document.getElementById('js-recommended-box-btn').innerText = 'Aktivieren';     
      }
      if ( hasEil && hasNews ) {
        document.getElementById('js-sub-message-both').className = 'bpl__sub-message bpl__sub-message--active';
      } else {
        document.getElementById('js-sub-message-both').className = 'bpl__sub-message';
      }
    }
    else {
      document.getElementById('js-bpl-error').style.display = 'none';
      document.getElementById('js-bpl-selection').style.display = 'none';
      document.getElementById('js-bpl-activation').style.display = 'flex';
    }
  }

  function sendPushInfoToWebtrekk(linkId, seven, nine){
    if(typeof window.wt.sendinfo !== 'undefined') {
      window.wt.sendinfo({
        linkId: linkId,
        customClickParameter: {
          4 : window.Zeit.breakpoint.getTrackingBreakpoint(), 
          5 : 'browserpush-menu',
          6 : 'notifications',
          7 : seven,
          9 : nine
        }
      });
    }
  }

  function triggerTag(sdk, tagName, seven) {
    if(!sdk.channel.tags.has(tagName, tagGroup)) {
      if( sdk.channel.tags.add(tagName, tagGroup) ){
        sendPushInfoToWebtrekk('#activate-browserpush', seven, 'on');
      }
    } 
    else {
      if( sdk.channel.tags.remove(tagName, tagGroup) ){
        sendPushInfoToWebtrekk('#activate-browserpush', seven, 'off');    
      }
    }
  }

  // If Referrer exists, show Back-Button else Starseite
  var i;
  var elements = document.getElementsByClassName('js-bpl-back-btn');
  for (i = 0; i < elements.length; i++) {
    if(document.referrer) {
      elements[i].href = document.referrer;
    } else {
      elements[i].innerText = 'Startseite';
    }
  }

  if(supported) {
    UA.then(function(sdk) {
      if(Notification.permission !== 'denied') {
        checkForSubscriptions(sdk);
      }
      else {
        document.getElementById('js-bpl-error-notifications-denied').style.display = 'flex';
      }

      // Button Click Handlers
      document.getElementById('js-register-button').addEventListener('click', function() {
        sdk.register();

        if(typeof window.wt.sendinfo !== 'undefined') {
          window.wt.sendinfo({
            linkId: '#activate-browserpush',
            customClickParameter: {
              4 : window.Zeit.breakpoint.getTrackingBreakpoint(), 
              5 : 'browserpush-menu',
              6 : 'notifications',
              9 : 'activate'
            }
          });
        }
      });

      document.getElementById('js-eil-box').addEventListener('click', function() {
        triggerTag(sdk, tagEil, 'subscriptions_eilmeldung');
      });

      document.getElementById('js-recommended-box').addEventListener('click', function() {
        triggerTag(sdk, tagNews, 'subscriptions_news');
      });

      // Listen on changes in Channel object - happens on activation
      sdk.addEventListener('channel', function(event) {
      // default-subscription for Eilmeldungen
      if(!sdk.channel.tags.has(tagEil, tagGroup)) {
        if( sdk.channel.tags.add(tagEil, tagGroup) ){
          sendPushInfoToWebtrekk('#activate-browserpush', 'subscriptions_eilmeldung', 'on');
        }
      }
      // default-subscription for Lesetipps
      if(!sdk.channel.tags.has(tagNews, tagGroup)) {
        if( sdk.channel.tags.add(tagNews, tagGroup) ){
          sendPushInfoToWebtrekk('#activate-browserpush', 'subscriptions_news', 'on');
        }
      }

      checkForSubscriptions(sdk);
    });

      // Listen on changes in tag object
      sdk.addEventListener('tags', function (event) {
        checkForSubscriptions(sdk);
      });

    }).catch(function(err) {
      document.getElementById('js-bpl-selection').style.display = 'none';
      document.getElementById('js-bpl-activation').style.display = 'none';
      document.getElementById('js-bpl-error').style.display = 'flex';
    });
  } else {
    document.getElementById('js-bpl-error').style.display = 'flex';
  }
})();