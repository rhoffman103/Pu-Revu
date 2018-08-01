$(document).ready(function () {

    // $('select').formSelect();

    var topicsArr = ["Arts", "Books", "Food", "Movies", "Sports"];
    // Built by LucyBot. www.lucybot.com
    var url = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/" +
        topicsArr[0] +
        "/1.json";
    url += '?' + $.param({
        'api-key': "3aed9443566e4279ab5a39c67436378f"
    });

    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (result) {
        var results = result.results;
        console.log(results[0]);
        console.log(results[1]);
        console.log(results[2]);
        for (var i = 0; i < 3; i++) {
            var title = $("<h6>");
            var caption = $("<p>");
            var link = $("<a>");
            link.attr("href", results[i].url);
            link.attr("target", "_blank");
            console.log(results[i].url);
            title.append(results[i].title);
            console.log(results[i].title);
            caption.append(results[i].media[0].caption);
            console.log(results[i].media[0].caption);
            link.append(title);
            $("#top-three").append(link);
            $("#top-three").append(caption);
        }
    }).fail(function (err) {
        throw err;
    });

});//End of document.ready function