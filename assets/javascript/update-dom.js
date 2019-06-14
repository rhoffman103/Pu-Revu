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
            }
        };
        return updateDom;
    };
    window.updateDom = defineUpdateDom();
})