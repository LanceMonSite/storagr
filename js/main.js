$(document).ready(function () {
	$(document).foundation();
    var baseRef = new Firebase('https://storagr.firebaseio.com/');
    var markersRef = new Firebase('https://storagr.firebaseio.com/markers');
	var $mapNode = $('<div id="map_canvas"></div>');
	var input = document.getElementById('searchTextField');
	var options = {
		types: ['(cities)'],
		componentRestrictions: {country: 'ca'}
	};
	var str = "";
	var f = 0;
	var fuckit = [];
	autocomplete = new google.maps.places.Autocomplete(input, options);
	$("#sq-ft").each(function () {
		var input = $(this);
		$("<span>")
		.addClass("output").insertAfter($(this));
	}).bind("slider:ready slider:changed", function (event, data) {
		$(this)
		.nextAll(".output:first")
		.html("Minimum: " + data.value.toFixed(0) + " Sq. ft.");
	});

	$("#pricing").each(function () {
		var input = $(this);
		$("<span>").addClass("output").insertAfter($(this));
	}).bind("slider:ready slider:changed", function (event, data) {
		$(this).nextAll(".output:first").html("Maximum: $" + data.value.toFixed(0));
	});
	$('#searchForm').submit(function(e) {
		var query = $('#searchTextField').val();
		$('.search-section').hide();
		intializeMap(query);
		e.preventDefault();
	});

	function resizeMap() {
		var height = $(window).height();
		$mapNode.css('height', height + 'px');
	}

	$(window).resize(function(){
		resizeMap();
	});

	function addMarkerLive(childSnapshot) {
		var location = childSnapshot.val();
		var lat = location.lat, lng = location.lng, panTo = location.panTo, content = location.content;
        var clientPosition = new google.maps.LatLng(lat, lng);
        fuckit.push($mapNode.gmap('addMarker', {
            'position': clientPosition,
            'animation': google.maps.Animation.DROP
        }));
        fuckit[f].click(function(){
			$mapNode.gmap('openInfoWindow', {'content': content}, this);
        });
        $(content).find('.list-item').data('data-pc', f);
        str += content;
        f++;
    }

    $('#list-items').on('click', '.list-item', function(){
    	var sdfkj = $(this).data('data-pc');
    	console.log(sdfkj);
    });

    function intializeMap(query) {
		$mapNode.gmap('search', {
			'address': query
		}, function (results, status) {
			if (status === 'OK') {
				$mapNode.gmap('get', 'map').panTo(results[0].geometry.location);
				$mapNode.gmap('option', 'zoom', 11);
			}
		}).prependTo('body');
		resizeMap();
		baseRef.once('child_added', function (snapshot) {
			var i = 0;
			snapshot.forEach(function (childSnapshot) {
				i++;
				setTimeout(function(){
					addMarkerLive(childSnapshot);
					if (i > 4)
						hardCodE();
				}, 200 * i);
			});
		});

		initializeSideBar();
    }

    function initializeSideBar() {
		$('#sidebar').css({
			'position': '',
			'top': ''
		});
    }

    function hardCodE() {
    	$('#list-items').html(str);
 		$(".list-wrapper").mCustomScrollbar();
   }
});