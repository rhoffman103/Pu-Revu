$(document).ready(function() {

    class AppWarning {
        constructor(msg) {
            this.msg = msg;
        };

        set(selector) {
            updateDom.warningMessage(selector, this.msg);
        };

        clear(selector) {
            $(selector).empty();
        };
    };

    function defineWarnings() {
        const warnings = {
            type: {
                dbFetch: new AppWarning('Oops! Something went wrong!'),
                invalidZip: new AppWarning('Valid Zip Code Required!!!')
            },

            clearAll: function(selector) {
                Object.keys(this.type).forEach(key => {
                    this.type[key].clear(selector);
                });
            }
        };
        return warnings;
    };

    window.warnings = defineWarnings();

});