$(document).ready(function(){

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

    const submitReview = function() {
        const zip = $("#z-input").val();
        const name = utils.toTitleCase($("#business").val().toLowerCase().trim());
        
        if ( (utils.isZipCode(zip)) || (name.length > 0) ) {
            const ratings = getRatings();
            const comment = $(".comments").val().trim();
            const dateAdded = moment().format('lll'); 
            const newReview = new fbController.Review (comment, ratings, dateAdded);
            
            sessionStorage.setItem("currentBusiness", name);
            fbController.pushNewReviewLogic(name, zip, newReview);         
            return;
        }

        const msg = '!!! You must enter a Business and Zip to submit a review !!!';
        updateDom.warningMessage($("#failed-submit"), msg);
    }

    // EVENTS
    $(".pointer-curser").on("click", function() {
        swapRatingsAttributes($(this));
    });

    // SUBMIT REVIEW
    $("#submit-btn").on("click", function() {
        submitReview();
    });

    // INITIAL METHOD CALLS
    // Initialize Materialize JS
    M.AutoInit();
    $('#z-input').val(sessionStorage.getItem('zip'))
    
});