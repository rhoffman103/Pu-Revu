$(document).ready(function () {

    var database = firebase.database();

    sessionStorage.setItem("zip", "03801");
    sessionStorage.setItem("currentBusiness", "granite state");

    // CAPITALIZE FIRST LETTER OF EACH WORD
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    //  RETRIEVE BUSINESSES BY ZIP
    const listBusinessesByZip = function (postal) {
        var businessRef = database.ref("businesses");
        businessRef.orderByChild("zip").equalTo(postal).once("value", function (snapshot) {
            // check if there are any entries in this zip code & append info
            if (snapshot.val() !== null)
            return updateDom.renderListOfBusinesses(snapshot.val(), toTitleCase)

            $(".review-list").append(`<p>Be the first Pu Reviewer in this area!</p>`);
        });
    };

    //  Search Event for businesses
    const enterSearch = function() {
        console.log("zip search")
        sessionStorage.setItem("zip", $(".zip-input").val());
        $(".title").empty();
        $(".comment-cards").empty();
        $(".review-list").empty();
        listBusinessesByZip($(".zip-input").val());
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
                name: jSnap.name,
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

    $(document).on("keypress", "#z-input", function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            enterSearch();
        };
    });

    // Initial Page load methods
    $('.sidenav').sidenav();
    listBusinessesByZip(sessionStorage.getItem("zip"));

});