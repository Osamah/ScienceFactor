var errorCallback = function(e) {
	console.log('getUserMedia error ', e);
};
var success = function(stream) {
	video.src = window.URL.createObjectURL(stream);
	console.log('getUserMedia success');
}

navigator.getUserMedia  = navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia;

var video = document.querySelector('video'),
rearCameraId;

if (MediaStreamTrack && MediaStreamTrack.getSources) {
	MediaStreamTrack.getSources(function (sources) {
		var rearCameraIds = sources.filter(function (source) {
			return (source.kind === 'video' && source.facing === 'environment');
		}).map(function (source) {
			return source.id;
		});

		if (rearCameraIds.length) {
			rearCameraId = rearCameraIds[0];
		} else {
			console.log('No rear camera found');
		}


		if (navigator.getUserMedia) {
			navigator.getUserMedia({
				video: {
					optional: [{
						sourceId: rearCameraId
					}]
				}
			}, success, errorCallback);
		} else {
			console.log('navigator.getUserMedia doesnt exist');
		}

	});
} else {
	console.log('MediaStreamTrack not supported');
}


document.getElementById('take-pic').onclick = function() {
	takePicture();
}
document.getElementById('retry-pic').onclick = function() {
	retryPicture();
}

function takePicture() {
	document.getElementsByTagName('video')[0].pause();
	document.getElementById('take-pic').style.display = "none";
	document.getElementById('retry-pic').style.display = "block";
	document.getElementById('send-pic').style.display = "block";
}
function retryPicture() {
	document.getElementsByTagName('video')[0].play();
	document.getElementById('take-pic').style.display = "block";
	document.getElementById('retry-pic').style.display = "none";
	document.getElementById('send-pic').style.display = "none";
}