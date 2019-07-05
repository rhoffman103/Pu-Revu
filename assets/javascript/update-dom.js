$(document).ready(function() {
    function defineUpdateDom() {
        const updateDom = {
            warningMessage: (selector, msg) => {
                const failedDiv = $('<div>').addClass('col s12 red lighten-3')
                const warning = $('<p>').addClass('submit-warning').text(msg)
                
                failedDiv.append(warning);
                selector.append(failedDiv);
            },
            
            submitSuccess: () => {
                const linkBtn = $('<a>')
                linkBtn.attr('href', 'write-review.html')
                .addClass('waves-effect waves-light blue darken-2 btn')
                .text('Write another review!');
                
                $('#page-content').empty();
                $('.page-footer').empty();
                $('#page-content').append(linkBtn);
            },

            setZipFromSessionStorage: () => {
                if ('zip' in localStorage) $("#display-zip").val(sessionStorage.getItem("zip"))
            },

            renderListOfBusinesses: (businesses, toTitleCase) => {
                let row = $('<div>').addClass('row')
                
                Object.keys(businesses).forEach(key => {
                    let recommendPerc = Math.round((businesses[key].ratings.recommend / (businesses[key].ratings.recommend + businesses[key].ratings.oppose)) * 100)
                    let cleanPerc = Math.round((businesses[key].ratings.clean / (businesses[key].ratings.clean + businesses[key].ratings.dirty)) * 100);
                    let col = $('<div>').addClass('col s12 m6')
                    let card = $('<div>').addClass('card')
                    let cardContent = $('<div>').addClass('card-content')
                    let cardTitle = $('<span>').addClass('card-title')
                    let cardAction = $('<div>').addClass('card-action')
                    let h3 = $('<h3>').addClass('business pointer-curser blue-text text-darken-2')
                        .attr('data-zip', `${businesses[key].zip}`)
                        .attr('data-key', `${key}`)
                        .text(`${toTitleCase(businesses[key].name)}`)
                    let p = $('<p>').text(`% ${recommendPerc} Recommended | % ${cleanPerc} Cleanliness`)
                    cardContent.append(cardTitle).append(h3)
                    cardAction.append(p)
                    cardContent.appendTo(card)
                    cardAction.appendTo(card)
                    col.append(card)
                        .appendTo(row)
                })

                $('.review-list').append(row);
            },

            renderFirstPuReviewer: (selector) => {
                let p = $('<p>')
                    .text('Be the first Pu Reviewer in this area!')
                    .addClass('blue-text text-darken-2 link')
                    .attr('id', 'first-reviewer')
                selector.append(p);
            },

            renderTotalRatings: (selector, business) => {
                let row1 = $('<div>').addClass('row')
                let row2 = $('<div>').addClass('row')
                let divRatings = $('<div>').addClass('separator')
                let businessH2 = $('<h2>').addClass('business-title').html(business.name)
                let pZip = $('<p>').addClass('mb-20').html(`Zip Code: ${business.zip}`)
                let pRecomends = $('<p>').addClass('col s12 m4 l3 mb-8 p-0').html(`Recomends: ${business.ratings.recommend}`)
                let pOpposed = $('<p>').addClass('col s12 m4 l3 mb-8 p-0').html(`Opposed: ${business.ratings.oppose}`)
                let pCleanliness = $('<p>').addClass('col s12 m4 l3 mb-8 p-0').html(`Cleanliness: ${business.ratings.clean}`)                
                let pGrimey = $('<p>').addClass('col s12 m4 l3 mb-8 p-0').html(`Grimey: ${business.ratings.dirty}`)
                
                row1.append(pRecomends, pOpposed)
                row2.append(pCleanliness, pGrimey)
                divRatings.append(businessH2, pZip, row1, row2)
                $(selector).append(divRatings)
            },

            listReviews: (selector, reviews) => {
                let reviewWrapper = $('<div>')
                Object.keys(reviews).forEach((key) => {
                    let thumb;
                    let vote;

                    if (reviews[key].ratings.recommend) {
                        thumb = 'thumb_up';
                        vote = 'Recommended';
                    } else {
                        thumb = 'thumb_down';
                        vote = 'Opposed';
                    }

                    let row = $('<div>').addClass('row')
                    let col = $('<div>').addClass('col s12 l6')
                    let card = $('<div>').addClass('card darken-1')
                    let cardContent = $('<div>').addClass('card-content')
                    const dateAdded = $('<p>').addClass('date-added').html(reviews[key].dateAdded)
                    const icon = $('<i>').addClass('material-icons').html(thumb)
                    let pIcon = $('<p>').addClass('recommend-icon').html(icon[0].outerHTML + ' ' + vote)
                    const comment = $('<p>').addClass('comment').html(reviews[key].comment)

                    cardContent.append(dateAdded, pIcon, comment)
                    card.append(cardContent)
                    col.append(card)
                    row.append(col)
                    reviewWrapper.prepend(row);
                })
                $(selector).append(reviewWrapper);
            }
        };
        return updateDom;
    };
    window.updateDom = defineUpdateDom();
})