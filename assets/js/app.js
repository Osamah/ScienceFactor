$('#journal-input .video-input button').click(function() {
	setUpContent('ocr-input');
	initializeCameraInput();
});
$('#journal-input .text-input form').submit(function(e) {
	e.preventDefault();
	setUpContent('journal-results');
	searchResults($('#journal-input .text-input input').val());
});


function setUpContent(id) {
	$('.page-content').fadeOut(function() {
		$('#' + id).fadeIn();
	});
}

function initializeCameraInput () {
	navigator.getUserMedia  = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

	var container = $('#ocr-input'),
	video = container.find('video'),
	canvas = container.find('canvas'),
	rearCameraId,
	videostream;

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
				}, function(stream) {
					$(video).attr('src', window.URL.createObjectURL(stream));
					videostream = stream;
					console.log('getUserMedia success');
				}, function(error) {
					console.log('getUserMedia error ', error);
				});
			} else {
				console.log('navigator.getUserMedia doesnt exist');
			}

		});
	} else {
		console.log('MediaStreamTrack not supported');
	}


	$('#take-pic').click(function() {
		takePicture();
	});
	$('#retry-pic').click(function() {
		retryPicture();
	});
	$('#send-pic').click(function() {
		sendPicture();
	});

	function takePicture() {
		video[0].pause();
		$('#take-pic').hide();
		$('#retry-pic').show();
		$('#send-pic').show();

		var ctx = canvas[0].getContext('2d');

		var w = video.width();
		var h = video.height();

		canvas[0].width = w;
		canvas[0].height = h;

		ctx.drawImage(video[0], 0, 0, w, h);
		canvas.cropper({
			movable: false,
			zoomable: false,
			background: false,
			guides: false,
			autoCrop: false,
			crop: function(data) {
				console.log(data);
			},
			built: function() {
				video.hide();
			}
		});
		
	}
	function retryPicture() {
		video[0].play();
		$('#take-pic').show();
		$('#retry-pic').hide();
		$('#send-pic').hide();
		video.show();
		canvas.cropper('destroy');
	}
	function sendPicture() {
		var croppedCanvas = canvas.cropper('getCroppedCanvas');
		var string = OCRAD(croppedCanvas);
		videostream.stop();
		alert(string);
	}
}

function searchResults(searchterm) {
	var url = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";

	$.ajax({
		url: url,
		data: {
			db: "pubmed",
			term: searchterm,
			RetMax: 50
		},
		dataType: "xml",
		success: function (response) {
			console.log(response);
			console.log($(response).find('eSearchResult > Count')[0]);
			$(response).find('IdList Id').each(function() {
				console.log(this);
			});
		}
	});
}