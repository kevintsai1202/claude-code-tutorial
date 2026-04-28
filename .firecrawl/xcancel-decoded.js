const check1 = new Check1(50, false);(function(){
  var a = function() {try{return !!window.addEventListener} catch(e) {return !1} },
  b = function(b, c) {a() ? document.addEventListener("DOMContentLoaded", b, c) : document.attachEvent("onreadystatechange", b)};
  b(function(){
    var timeleft = 1;
    var downloadTimer = setInterval(function(){
      timeleft--;
      document.getElementById("countdowntimer").textContent = timeleft;
      if(timeleft <= 0)
      clearInterval(downloadTimer);
    },1000);
    setTimeout(function(){
      var now = new Date();
      var time = now.getTime();
      time += 300 * 1000;
      now.setTime(time);
      document.cookie = 'QtgH9TWFjHqMKjRuhDsBpgcbZzk=UMMWlvi2jNk7R768qAhGJYRNto4' + '; expires=' + 'Sat, 14-Mar-26 02:27:56 GMT' + '; path=/';
      var botdPromise = BotD.load()
      var botException = false;
      var uap = new UAParser();
      botdPromise
        .then(function (fp) {
            return fp.detect();
          })
        .then(function (result) {
          var fpWorkerValidate = false;
          if ("serviceWorker" in navigator) {
            fpworker.then(function (result) {
              var windowScopeUserAgent = uap.setUA(result.windowScope.userAgent).getResult();
              var serviceworkerUserAgent = uap.setUA(result.serviceWorker.userAgent).getResult();
              if (result.serviceWorker === undefined && "sharedWorker" in navigator === false) {
                fpWorkerValidate = true;
              }
              if (JSON.stringify(windowScopeUserAgent.engine) === JSON.stringify(serviceworkerUserAgent.engine)
                && result.windowScope.engine === result.serviceWorker.engine
                && result.windowScope.timeZone === result.serviceWorker.timeZone) {
                  fpWorkerValidate = true;
                }
            }).catch(function (result) {
              fpWorkerValidate = true;
            })
          } else {
            fpWorkerValidate = true;
          }
                  setTimeout(function () {
            if ((!result.bot || result.botKind === 'unknown') && check1.detections.length == 0 && fpWorkerValidate == true) {
              if(!window._phantom || !window.callPhantom){/*phantomjs*/
if(!window.__phantomas){/*phantomas PhantomJS-based web perf metrics + monitoring tool*/
if(!window.Buffer){/*nodejs*/
if(!window.emit){/*couchjs*/
if(!window.spawn){/*rhino*/
if(!window.webdriver){/*selenium*/
if(!window.domAutomation || !window.domAutomationController){/*chromium based automation driver*/
if(!window.document.documentElement.getAttribute("webdriver")){
/*if(navigator.userAgent){*/
if(!/bot|curl|kodi|xbmc|wget|urllib|python|winhttp|httrack|alexa|ia_archiver|facebook|twitter|linkedin|pingdom/i.test(navigator.userAgent)){
/*if(navigator.cookieEnabled){*/
/*if(document.cookie.match(/^(?:.*;)?\s*[0-9a-f]{32}\s*=\s*([^;]+)(?:.*)?$/)){*//*HttpOnly Cookie flags prevent this*/
              var _75_=parseInt("20260313", 10) + parseInt("13032026", 10);
              /*}*/
/*}*/
}
/*}*/
}
}
}
}
}
}
}
}
              //end javascript puzzle
              var xhttp = new XMLHttpRequest();
              xhttp.onreadystatechange = function() {
                if (xhttp.readyState === 4) {
                  document.getElementById("status").innerHTML = "Refresh your page.";
                  location.reload(true);
                }
              };
              xhttp.open("POST", "/hooeem/status/2031755971265974632", true);
              xhttp.setRequestHeader('oUuUtz16Kx7kSx-rO0iZX0tAncA', _75_); //make the answer what ever the browser figures it out to be
      xhttp.setRequestHeader('X-Requested-with', 'XMLHttpRequest');
      xhttp.setRequestHeader('X-Requested-TimeStamp', '');
      xhttp.setRequestHeader('X-Requested-TimeStamp-Expire', '');
      xhttp.setRequestHeader('X-Requested-TimeStamp-Combination', '');
      xhttp.setRequestHeader('X-Requested-Type', 'GET');
      xhttp.setRequestHeader('X-Requested-Type-Combination', 'GET'); //Encrypted for todays date
      xhttp.withCredentials = true;
var sw, sh, ww, wh, v;
sw = screen.width;
sh = screen.height;
ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
wh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
if ((sw == ww) && (sh == wh)) {
    v = true;
    if (!(ww % 200) && (wh % 100)) {
        v = true;
    }
}
//v = true; //test var nulled out used for debugging purpose
if (v == true) {
  xhttp.setRequestHeader('jVFVyiqpla1h1JisuGRBhLW08x4', 'omRpqnOb6MYgDLQ-pz3cBNOu4c4');
}
              xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              xhttp.send("name1=Henry&name2=Ford");
            }
          }, 500);
          
        })
        .catch((error) => {})
      
    }, 2000); /*if correct data has been sent then the auth response will allow access*/
  }, false);
})();

