$(document).ready(function () {

    var database = firebase.database();

    sessionStorage.setItem("zip", "03801");
    sessionStorage.setItem("currentBusiness", "granite state");

    //  RETRIEVE BUSINESSES BY ZIP
    const listBusinessesByZip = function (postal) {
        var businessRef = database.ref("businesses");
        businessRef.orderByChild("zip").equalTo(postal).once("value", function (snapshot) {
            // check if there are any entries in this zip code & append info
            if (snapshot.val() !== null)
            return updateDom.renderListOfBusinesses(snapshot.val(), utils.toTitleCase)

            updateDom.renderFirstPuReviewer($(".review-list"));
        });
    };

    //  Search Event for businesses
    const enterSearch = function() {
        const zip = $(".zip-input").val()
        
        if (utils.isZipCode(zip)) {
            sessionStorage.setItem("zip", zip);
            $(".title").empty();
            $(".comment-cards").empty();
            $(".review-list").empty();
            listBusinessesByZip(zip);
            return;
        }
        
        const msg = 'Valid Zip Code Required!!!'
        $('#warning').empty();
        updateDom.warningMessage($('#warning'), msg);
    }
    
    // CLICK EVENTS
    // Opens clicked business and displays votes & comments
    $("body").on("click", ".business", function() {
        var ratingsRef = database.ref(`/businesses/${$(this).attr("data-key")}`)
        $(".review-list").empty();

        ratingsRef.once("value", function(snap) {
            const jSnap = snap.val();
            const reviews = jSnap.reviews;
            const business = {
                name: utils.toTitleCase(jSnap.name),
                zip: jSnap.zip,
                ratings: jSnap.ratings
            };

            updateDom.renderTotalRatings(business)
            updateDom.listReviews(reviews)
        });
    });

    // Searches for businesses by zip
    $("button").on("click", function() {
        enterSearch();
    });

    $('#z-input').on('input', function() {
        if (utils.isZipCode($('#z-input').val()))
            $('#warning').empty();
    });

    $('#z-input').on('keypress', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            enterSearch();
        };
    });

    $(document).on('click', '#first-reviewer', function(event) {
        event.preventDefault();
        sessionStorage.setItem('zip', $(".zip-input").val());
        window.location.href = '/write-review.html';
    })

    // Initial Page load methods
    $('.sidenav').sidenav();
    listBusinessesByZip(sessionStorage.getItem("zip"));

});