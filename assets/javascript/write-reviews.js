$(document).ready(function(){

    const Review = function(comment, ratings, dateAdded) {
        this.comment = comment;
        this.ratings = ratings;
        this.dateAdded = dateAdded;
    };

    const getRatings = function() {
        const cleanliness = $(".cleanliness[data-select='checked']").attr('data-value');
        const recommended = $(".recommend[data-select='checked']").attr('data-value');
        const ratings  = {   
            recommend: 0,
            oppose:    0,
            clean:     0,
            dirty:     0,
            ok:        0,
        };

        switch(cleanliness) {
            case 'clean': 
                ratings.clean = 1;
                break;
            case 'dirty':
                ratings.dirty = 1;
        };

        switch(recommended) {
            case 'recommend':
                ratings.recommend = 1;
                break;
            case 'oppose':
                ratings.oppose = 1;
                break;
        };
        
        return ratings;
    }

    const swapRatingsAttributes = function($this) {
        $this.addClass("purple-text text-darken-2").attr('data-select', 'checked');
        $this.siblings().removeClass("purple-text text-darken-2").attr('data-select', 'unchecked');
    }

    // EVENTS
    $(".pointer-curser").on("click", function() {
        var $this = $(this);
        swapRatingsAttributes($this)
    });

    // SUBMIT REVIEW
    $("#submit-btn").on("click", function() {
        zip = $("#z-input").val();
        name = $("#business").val().toLowerCase().trim();
        const comment = $(".comments").val().trim();
        var dateAdded = moment().format('lll'); 
        sessionStorage.setItem("currentBusiness", name);
        
        if (( (zip.length == 0) || (name.length == 0) )) {
            updateDom.missingCredentials();
            return;
        }
        else if ((zip.length > 0) && (name.length > 0)){
            const ratings = getRatings();
            const newReview = new Review (comment, ratings, dateAdded);
            fbController.pushNewReviewLogic(name, zip, newReview);
        }
    });

    // INITIAL METHOD CALLS
    // Initialize Materialize JS
    M.AutoInit();
    
});