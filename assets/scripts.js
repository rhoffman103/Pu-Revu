$(document).ready(function () {
    var location = "portsmouth";
    var queryURL = "https://api.yelp.com/v3/businesses/search?location=" + location;

    $.ajax({
        url: queryURL,
        method: "GET",
        headers: { "Authorization": "Bearer dgf0EwXxeGkIHfZLZrskaJo3I1elGrAPtof7Y0jXRxSPl3QTjr-hwHnuwWCCGVoWSwCOKxAqrW7V4KTdRjOk5Ng_ccri-5nyH04plUq5di4fpVVZcGnYaDN0D61cW3Yx" },
    })
        .then(function (response) {
            console.log(response.data);

        });

});//End of document.ready function