(function () {
  "use strict";

  var recorderUrl = "https://tnano-session-replay.baovan-tnano.workers.dev/recorder/tnano-replay.js";

  if (window.TNANOReplay && window.TNANOReplay.initReplay) return;
  if (window.__TNANOReplayLoaderStarted) return;
  window.__TNANOReplayLoaderStarted = true;

  var script = document.createElement("script");
  script.src = recorderUrl + "?v=" + Date.now();
  script.async = true;
  script.onerror = function () {
    window.__TNANOReplayLoaderStarted = false;
  };
  (document.head || document.documentElement).appendChild(script);
})();
