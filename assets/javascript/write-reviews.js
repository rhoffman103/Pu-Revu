$(document).ready(function(){

    const Review = function(comment, ratings, dateAdded) {
        this.comment = comment;
        this.ratings = ratings;
        this.dateAdded = dateAdded;
    };

    const getRatings = function() {
        const selected = document.querySelectorAll(".rate-btn[data-select='checked']");

        const newRatings  = {   
            recommend: 0,
            oppose:    0,
            clean:     0,
            dirty:     0,
            ok:        0,
        };
        
        const setRatings = function(rating) {
            switch(rating) {
                case 'clean': 
                    newRatings.clean = 1;
                    break;
                case 'dirty':
                    newRatings.dirty = 1;
                    break;
                case 'recommend':
                    newRatings.recommend = 1;
                    break;
                case 'oppose':
                    newRatings.oppose = 1;
                    break;
            };
        };
                    
        selected.forEach(function(element) {
            if(element.hasAttribute('data-select', 'checked'))
            setRatings(element.getAttribute('data-value'));
        });

        return newRatings;
    };

    const swapRatingsAttributes = function($this) {
        $this.addClass("purple-text text-darken-2").attr('data-select', 'checked');
        $this.siblings().removeClass("purple-text text-darken-2").attr('data-select', 'unchecked');
    };

    // EVENTS
    $(".pointer-curser").on("click", function() {
        var $this = $(this);
        swapRatingsAttributes($this)
    });

    // SUBMIT REVIEW
    $("#submit-btn").on("click", function() {
        let zip = $("#z-input").val();
        let name = utils.toTitleCase($("#business").val().toLowerCase().trim());
        const comment = $(".comments").val().trim();
        const dateAdded = moment().format('lll'); 
        
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
    $('#z-input').val(sessionStorage.getItem('zip'))
    
});