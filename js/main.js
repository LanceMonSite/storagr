$(document).ready(function () {
	var input = document.getElementById('searchTextField');
	var options = {
		types: ['(cities)'],
		componentRestrictions: {country: 'ca'}
	};
	autocomplete = new google.maps.places.Autocomplete(input, options);

	$('#searchForm').submit(function(e){
		var query = $('#searchTextField').val();
		console.log(query);
		e.preventDefault();
	});
});