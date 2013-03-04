$(document).ready(function () {
	var j = 0;
    var baseRef = new Firebase('https://storagr.firebaseio.com/');
    var markersRef = new Firebase('https://storagr.firebaseio.com/markers');
	var $mapNode = $('<div id="map_canvas"></div>');
	var input = document.getElementById('searchTextField');
	var options = {
		types: ['(cities)'],
		componentRestrictions: {country: 'ca'}
	};
	autocomplete = new google.maps.places.Autocomplete(input, options);

	$('#searchForm').submit(function(e) {
		var query = $('#searchTextField').val();
		$('.search-section').fadeOut('fast', function() {
			intializeMap(query);
		});
		e.preventDefault();
	});

	function resizeMap() {
		var height = $(window).height();
		if (height > 780)
			$mapNode.css('height', height + 'px');
		else
			$mapNode.css('height', '100%');
	}

	$(window).resize(function(){
		resizeMap();
	});

    function addMarkerLive(lat, lng, pan2, content) {
        var clientPosition = new google.maps.LatLng(lat, lng);
        $mapNode.gmap('addMarker', {
            'position': clientPosition,
            'animation': google.maps.Animation.DROP
        }).click(function(){
			$('#map_canvas').gmap('openInfoWindow', {'content': content}, this);
        });
        console.log(content);
    }

    function intializeMap(query) {
		$mapNode.gmap('search', {
			'address': query
		}, function (results, status) {
			if (status === 'OK') {
				$mapNode.gmap('get', 'map').panTo(results[0].geometry.location);
				$mapNode.gmap('option', 'zoom', 12);
			}
		}).prependTo('body');
		resizeMap();

		baseRef.once('child_added', function (snapshot) {
			if (j >= 1)
				return false;
			j++;
			var i = 0;
			snapshot.forEach(function (childSnapshot) {
				i++;
				setTimeout(preAdd(childSnapshot), 200 * i);
			});
		});

		function preAdd(childSnapshot) {
			var location = childSnapshot.val();
			addMarkerLive(location.lat, location.lng, location.panTo, location.content);
		}
    }
});