$(document).ready(function(){

	let postal = '';
	let townName = '';
	let state = '';
	const apiKey = 'AIzaSyB_ua18dh0qZ4QVSP0B7Wu2APNOopNo6dM';

	const defineGeolocate = function() {
		const geolocate = {

			getLocation: function() {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(this.getPostalCode);
				} else { 
					updateDom.warningMessage($('#warning'), 'Geolocation is not supported by this browser.');
				}
			},
			
			getPostalCode: function(position) {
				$.ajax({
					type: "POST",
					url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${apiKey}`,
					dataType: "json",
					beforeSend: function(){
					// do something before the request such as show a loading image
					},
					error: function(err){
						updateDom.warningMessage('#warning', 'Oops! Something went wrong!');
					},
					success: function(data) {
						const addresses = data.results;
						console.log('zip results: ', addresses);
						$.each(addresses, function(i) {
							if (this.types[0]=="postal_code"){
								postal = this['address_components'][0]['long_name'];
								townName = this['address_components'][1]['long_name'];
								state = this['address_components'][3]['short_name'];

								sessionStorage.setItem('town', townName);
								sessionStorage.setItem('state', state);

								if(postal.length > 3){
									$("#z-input").val(postal);
									sessionStorage.setItem("zip", postal);
									return false;
								}
							}
						});
					} // end success
				}); // end ajax
			}

		};
		return geolocate;
	};

	window.geolocate = defineGeolocate();
	
	// $("#z-input").val(sessionStorage.getItem("zip"))
	
	$("#change-zip").on("click", function() {
		geolocate.getLocation();
	});
	
	$("#z-input").change(function() {
		postal = $("#z-input").val();
		sessionStorage.setItem("zip", postal);
	});

});