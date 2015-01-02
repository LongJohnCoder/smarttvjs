orangee.html5player = function _OrangeeJSHTML5Player() {
  this.video = null;
};

orangee.html5player.prototype.play = function() {
  this.video.play();
};

orangee.html5player.prototype.pause = function() {
  this.video.pause();
};

orangee.html5player.prototype.stop = function() {
  this.video.pause();
  this.video.src="";
};

orangee.html5player.prototype.currentTime = function() {
  return this.video.currentTime;
};

orangee.html5player.prototype.seek = function(second) {
  this.video.currentTime = second;
};

orangee.html5player.prototype.load = function(url, startSeconds, divid, options) {
  orangee.debug(url);
  if (orangee.PLATFORM === 'samsung' && url.match(/\.m3u8$/) && !url.match(/COMPONENT=HLS$/)) {
    url = url + "?|COMPONENT=HLS";
  }

  if (this.video == null) {
    this.video = document.createElement("video");
    this.video.controls = true;
    //this.video.width = options['width'] || '100%';
    if ((options['playsinline'] || 0) == 1) {
      this.video.setAttribute("webkit-playsinline", "");
    }
    if ((options['autoplay'] || 0) == 1) {
      this.video.autoplay = true;
    }
    this.video.id = divid;

    var div = document.getElementById(divid);
    this.video.setAttribute("class", div.getAttribute("class"));
    this.video.setAttribute("poster", div.getAttribute("poster"));
    div.parentNode.replaceChild(this.video, div);

    if (options['onplaying']) {
      this.video.addEventListener("playing", options['onplaying']);
    }
    if (options['onpause']) {
      this.video.addEventListener("pause", options['onpause']);
    }
    if (options['onend']) {
      this.video.addEventListener("ended", options['onend']);
    }
  }
  this.video.src = url;
  this.video.load();
  var self = this;
  this.video.addEventListener("canplay",function() { 
    self.video.currentTime = startSeconds;}
  );
};


