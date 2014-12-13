// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

(function() {
	
	window.onload = function() {
		resizeMap();

		var map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 47.6,
				lng: -122.3,
			},
			zoom: 12,
		});
		
		var infoWindow = new google.maps.InfoWindow();
		
		$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
				.done(function(data) {
					data.forEach(function(camera) {
						var marker = new google.maps.Marker({
							position: {
								lat: parseFloat(camera.location.latitude),
								lng: parseFloat(camera.location.longitude),
							},
							map: map,
						});
						google.maps.event.addListener(marker, 'click', function() {
							map.panTo(this.getPosition());
							infoWindow.setContent('<p>' + camera.cameralabel + '<br /><img src="' + camera.imageurl.url + '" alt="' + camera.cameralabel + '" />');
							infoWindow.open(map, this);
						});
						$('#search').bind('search keyup', function(){
							var query = $(this).val().toLowerCase();
							if (camera.cameralabel.toLowerCase().indexOf(query) != -1) {
								marker.setMap(map);
							} else {
								marker.setMap(null);
							}
						});
					});
					
				})
				.fail(function(err) {
					var camerror = document.getElementById('camerror');
					camerror.innerHTML = err;
					camerror.style.display = initial;
				});
		
	};
	
	window.onresize = function() {
		resizeMap();
	};
	
	function resizeMap(){
		$('#map').css({
			height: $(window).height() - $('#map').position().top - 20
		});
	}
	
})();