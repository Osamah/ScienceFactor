var errorCallback = function(e) {
	console.log('Reeeejected!', e);
};
var success = function(stream) {
	video.src = window.URL.createObjectURL(stream);
	console.log('streaming');
}

navigator.getUserMedia  = navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia;

var video = document.querySelector('video');

if (navigator.getUserMedia) {
	navigator.getUserMedia({ video: true }, success, errorCallback);
} else {
	console.log('nope');
}