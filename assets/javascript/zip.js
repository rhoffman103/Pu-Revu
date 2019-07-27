$(document).ready(function(){

	let postal = '';
	const apiKey = 'AIzaSyB_ua18dh0qZ4QVSP0B7Wu2APNOopNo6dM';

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getPostalCode);
		} else { 
			updateDom.warningMessage($('#warning'), 'Geolocation is not supported by this browser.');
		}
	}
	
	const getPostalCode = function(position) {
		$.ajax({
			type: "POST",
			url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${apiKey}`,
			dataType: "json",
			beforeSend: function(){
			// do something before the request such as show a loading image
			},
			error: function(err){
				updateDom.warningMessage($('#warning'), 'Oops! Something went wrong!');
			},
			success: function(data) {
				const addresses = data.results;
				$.each(addresses, function(i) {
					if(this.types[0]=="postal_code"){
						postal = this['address_components'][0]['long_name'];
						if(postal.length > 3){
							$("#z-input").val(postal);
							sessionStorage.setItem("zip", postal);
							return false;
						}
					}
				});
			} // end success
	  }); // end ajax
	};
	
	// $("#z-input").val(sessionStorage.getItem("zip"))
	
	$("#change-zip").on("click", function() {
		getLocation();
	});
	
	$("#z-input").change(function() {
		postal = $("#z-input").val();
		sessionStorage.setItem("zip", postal);
	});

});