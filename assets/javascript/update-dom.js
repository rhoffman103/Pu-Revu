$(document).ready(function() {
    function defineUpdateDom() {
        const updateDom = {
            missingCredentials: () => {
                const failedDiv = $('<div>').addClass('col s12 red lighten-3')
                const warning = $('<p>').addClass('submit-warning').text('!!! You must enter a Business and Zip to submit a review.')
                
                failedDiv.append(warning);
                $("#failed-submit").append(failedDiv);
            },
            
            failedSubmit: () => {
                const failedDiv = $('<div>').addClass('col s12 red lighten-3')
                const warning = $('<p>').addClass('submit-warning').text('Oops! Something went wrong!')
                
                failedDiv.append(warning);
                $("#failed-submit").append(failedDiv);
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

            renderFirstPuReviewer: () => {
                let p = $('<p>').text('Be the first Pu Reviewer in this area!')
                $('.review-list').append(p);
            }
        };
        return updateDom;
    };
    window.updateDom = defineUpdateDom();
})