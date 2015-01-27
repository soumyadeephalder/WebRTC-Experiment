// =======================
// WhammyRecorderHelper.js

function WhammyRecorderHelper(mediaStream, root) {
    this.record = function(timeSlice) {
        if (!this.width) this.width = 320;
        if (!this.height) this.height = 240;

        if (this.video && this.video instanceof HTMLVideoElement) {
            if (!this.width) this.width = video.videoWidth || 320;
            if (!this.height) this.height = video.videoHeight || 240;
        }

        if (!this.video) {
            this.video = {
                width: this.width,
                height: this.height
            };
        }

        if (!this.canvas) {
            this.canvas = {
                width: this.width,
                height: this.height
            };
        }

        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;

        // setting defaults
        if (this.video && this.video instanceof HTMLVideoElement) {
            video = this.video.cloneNode();
        } else {
            video = document.createElement('video');
            video.src = URL.createObjectURL(mediaStream);

            video.width = this.video.width;
            video.height = this.video.height;
        }

        video.muted = true;
        video.play();

        lastTime = new Date().getTime();
        whammy = new Whammy.Video();

        console.log('canvas resolutions', canvas.width, '*', canvas.height);
        console.log('video width/height', video.width || canvas.width, '*', video.height || canvas.height);

        drawFrames();
    };

    var requestDataInvoked = false;
    this.requestData = function() {
        if (!frames.length) {
            requestDataInvoked = false;
            return;
        }

        requestDataInvoked = true;
        // clone stuff
        var internal_frames = frames.slice(0);

        // reset the frames for the new recording
        frames = [];

        whammy.frames = dropFirstFrame(internal_frames);
        var WebM_Blob = whammy.compile();
        root.ondataavailable(WebM_Blob);

        requestDataInvoked = false;
    };

    var frames = [];

    function drawFrames() {
        if (isStopDrawing) return;

        if (requestDataInvoked) return setTimeout(drawFrames, 100);

        var duration = new Date().getTime() - lastTime;
        if (!duration) return drawFrames();

        // via webrtc-experiment#206, by Jack i.e. @Seymourr
        lastTime = new Date().getTime();

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        !isStopDrawing && frames.push({
            duration: duration,
            image: canvas.toDataURL('image/webp')
        });

        setTimeout(drawFrames, 10);
    }

    var isStopDrawing = false;

    this.stop = function() {
        isStopDrawing = true;
        this.requestData();
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video;
    var lastTime;
    var whammy;

    var self = this;
}
