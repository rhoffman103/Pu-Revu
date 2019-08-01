$(document).ready(function () {
    
    const initialLoadSearch = () => {
        const zip = utils.getZipCodeFromWebStorage();
        
        if ((zip !== null) && (zip !== undefined))
            return listBusinessesByZip(sessionStorage.getItem("zip"));
        
        // Default to Portsmouth NH
        if (zip !== undefined)
            sessionStorage.setItem("zip", "03801");
        
        listBusinessesByZip('03801');
    };

    const listBusinessesByZip = function (zip) {
        fbController.getBusinessesByZip(zip)
        .then((fbData) => {
            if (fbData !== null)
                return updateDom.renderListOfBusinesses(fbData, utils.toTitleCase)
            updateDom.renderFirstPuReviewer($(".review-list"));
        })
        .catch((err) => {
            console.error(err);
            updateDom.warningMessage('#warning', 'Oops! Something went wrong!');
        });
    };

    const searchByZip = function() {
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
        updateDom.warningMessage('#warning', msg);
    }

    const openSelectedBusiness = (key) => {
        fbController.getBusinessByKey(key)
            .then((fbData) => {
                $(".review-list").empty();
                updateDom.renderTotalRatings('.title', fbData.business)
                if (fbData.reviews) updateDom.listReviews('.comment-cards', fbData.reviews)
            })
            .catch((err) => {
                console.error('Error retrieving business by key: ', err);
                updateDom.warningMessage('#warning', 'Oops! Something went wrong!');
            });
    }
    
    // CLICK EVENTS
    $("body").on("click", ".business", function() {
        openSelectedBusiness($(this).attr('data-key'));
    });

    $("button").on("click", function() {
        searchByZip();
    });

    $('#z-input').on('input', function() {
        if (utils.isZipCode($('#z-input').val()))
            $('#warning').empty();
    });

    $('#z-input').on('keypress', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            searchByZip();
        };
    });

    $(document).on('click', '#first-reviewer', function(event) {
        event.preventDefault();
        sessionStorage.setItem('zip', $(".zip-input").val());
        window.location.href = '/write-review.html';
    })

    // Initial Page load methods
    $('.sidenav').sidenav();
    initialLoadSearch();

});