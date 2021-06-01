

//-----------------------------------------------------------------

var socket = io();
socket.on('connect', () => {
    console.log('IO connected...');
    document.getElementById('io_connect').innerHTML = 'IO connected...';
});

socket.on('voice', function (arrayBuffer) {
    //console.log(arrayBuffer);
    //var fbu = new Float32Array(arrayBuffer);
    //console.log('IO = ', fbu);
    var blob = new Blob([arrayBuffer], { 'type': 'audio/ogg; codecs=opus' });
    var url = window.URL.createObjectURL(blob);
    console.log(url);
    var audio = document.createElement('audio');
    audio.src = url;
    audio.play();
});

//-----------------------------------------------------------------

var constraints = { audio: true };
navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
    var mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.onstart = function (e) {
        this.chunks = [];
    };
    mediaRecorder.ondataavailable = function (e) {
        console.log(e.data);
        //this.chunks.push(e.data);
        socket.emit('radio', e.data);
    };
    //mediaRecorder.onstop = function (e) {
    //    var blob = new Blob(this.chunks, { 'type': 'audio/wav' });
    //    socket.emit('radio', blob);
    //};

    // Start recording
    mediaRecorder.start();

    // Stop recording after 5 seconds and broadcast it to server
    setTimeout(function () {
        mediaRecorder.stop()
    }, 5000);
});

