// SOMELIA — YouTube Media Controller (Ensures reliable opening and error-free playback)
(function() {
  'use strict';
  function initYouTubePlayer() {
    var cover = document.getElementById('ytLocalCover');
    // If opened via local file protocol (file://), activate the YouTube cover link to prevent Error 153
    if (window.location.protocol === 'file:' && cover) {
      cover.style.display = 'flex';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initYouTubePlayer);
  } else {
    initYouTubePlayer();
  }
})();
