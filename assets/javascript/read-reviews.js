$(document).ready(function () {

    const $backBtn = $('#back-btn');

    const setBackBtn = function(type, value) {
        if (type === 'zip') {
            $backBtn.removeAttr('data-key');
            $backBtn.attr('data-zip', value);
        } 
        else if (type === 'key') {
            $backBtn.removeAttr('data-zip');
            $backBtn.attr('data-key', value);
        }
    };
    
    const initialLoadSearch = () => {
        const zip = utils.getZipCodeFromWebStorage();
        
        if ((zip !== null) && (zip !== undefined)) {
            $('#z-input').attr('placeholder', zip);
            return listBusinessesByZip(sessionStorage.getItem("zip"));
        }
        
        // Default to Portsmouth NH
        else if (zip !== undefined) {
            $('#z-input').attr('placeholder', zip);
            sessionStorage.setItem("zip", "03801");
            listBusinessesByZip('03801');
        }
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
            warnings.type.dbFetch.set('#warning');
        });
    };

    const searchByZip = function(zipArg) {
        const zip = zipArg || $(".zip-input").val().trim();
        
        if (utils.isZipCode(zip)) {
            if (sessionStorage.getItem('recent-business-key'))
                setBackBtn('key', sessionStorage.getItem('recent-business-key'));
            sessionStorage.setItem("zip", zip);
            $('#warning').empty();
            $(".title").empty();
            $(".comment-cards").empty();
            $(".review-list").empty();
            listBusinessesByZip(zip);
            return;
        }
        
        $('#warning').empty();
        warnings.type.invalidZip.set('#warning');
    };

    const openSelectedBusiness = (key) => {
        fbController.getBusinessByKey(key)
            .then((fbData) => {
                $(".review-list").empty();
                setBackBtn('zip', fbData.business.zip);
                updateDom.setDisplay('#back-btn', 'show');
                updateDom.renderTotalRatings('.title', fbData.business)
                if (fbData.reviews) updateDom.listReviews('.comment-cards', fbData.reviews)
            })
            .catch((err) => {
                console.error('Error retrieving business by key: ', err);
                warnings.type.dbFetch.set('#warning');
            });
    };
    
    // CLICK EVENTS
    $("body").on("click", ".business", function() {
        const key = $(this).attr('data-key')
        warnings.clearAll('#warning');
        sessionStorage.setItem('recent-business-key', key);
        openSelectedBusiness(key);
    });

    $("button").on("click", function() {
        searchByZip();
    });

    $('#z-input').on('input', function() {
        if (utils.isZipCode($('#z-input').val())) {
            warnings.type.invalidZip.clear('#warning');
        }
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
    });

    $backBtn.on('click', function() {
        updateDom.setDisplay('#back-btn', 'hide');
        warnings.clearAll('#warning');
        if ($backBtn.attr('data-zip'))
            return searchByZip($backBtn.attr('data-zip'));
        openSelectedBusiness($backBtn.attr('data-key'));
    });

    // Initial Page load methods
    $('.sidenav').sidenav();
    initialLoadSearch();

});