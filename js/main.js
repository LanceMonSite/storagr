$(document).ready(function () {
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
		$('.search-section').hide();
		intializeMap(query);
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

	function addMarkerLive(childSnapshot) {
		var location = childSnapshot.val();
		var lat = location.lat, lng = location.lng, panTo = location.panTo, content = location.content;
        var clientPosition = new google.maps.LatLng(lat, lng);
        $mapNode.gmap('addMarker', {
            'position': clientPosition,
            'animation': google.maps.Animation.DROP
        }).click(function(){
			$('#map_canvas').gmap('openInfoWindow', {'content': content}, this);
        });
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
			var i = 0;
			snapshot.forEach(function (childSnapshot) {
				i++;
				setTimeout(function(){
					addMarkerLive(childSnapshot);
				}, 200 * i);
			});
		});

		$('#res').load('/mtl-result.html');
    }

  //   $('#res').on('DOMNodeInserted', '#result-page-pane', function(){
  //   	console.log("SD");
		// $("#sq-ft")
  //       .each(function () {
  //         var input = $(this);
  //         $("<span>")
  //           .addClass("output").insertAfter($(this));
  //       })
  //       .bind("slider:ready slider:changed", function (event, data) {
  //         $(this)
  //           .nextAll(".output:first")
  //             .html("Minimum: " + data.value.toFixed(0) + " Sq. ft.");
  //       });
  //        $("#pricing")
  //       .each(function () {
  //         var input = $(this);
  //         $("<span>")
  //           .addClass("output").insertAfter($(this));
  //       })
  //       .bind("slider:ready slider:changed", function (event, data) {
  //         $(this)
  //           .nextAll(".output:first")
  //             .html("Maximum: $" + data.value.toFixed(0));
  //       });
  //   });
});