$(document).ready(function(){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB5w4kD4fczy7qVSDvoZLv8ks7UK3O8-ps",
        authDomain: "poo-review-4f8c8.firebaseapp.com",
        databaseURL: "https://poo-review-4f8c8.firebaseio.com",
        projectId: "poo-review-4f8c8",
        storageBucket: "",
        messagingSenderId: "884187524701"
      };
    firebase.initializeApp(config);

    var database = firebase.database();

    var business = {
        zip:      "",
        name:    "",
        comment: [],
        ratings: {   
            recommend: 0,
            oppose:    0,
            clean:     0,
            dirty:     0,
            ok:        0,
        }
    }

    // FIXME
    // RETRIEVE ZIP & DISPLAY
    $("#display-zip").text(sessionStorage.getItem("zip"))

    $("li").on("click", function() {
        var $this = $(this);
        var $ratingWord = $this.find("span").text().trim().toLowerCase();
        $this.addClass("purple-text text-darken-2");
        $this.siblings().removeClass("purple-text text-darken-2");

        switch ($ratingWord) {
            case "glorious":
                business.ratings.recommend = 1;
                business.ratings.oppose = 0;
                break;
            case "crappy":
                business.ratings.oppose = 1;
                business.ratings.recommend = 0;
                break;
            case "clean":
                business.ratings.clean = 1;
                business.ratings.dirty = 0;
                business.ratings.ok = 0;
                break;
            case "grimey":
                business.ratings.clean = 0;
                business.ratings.dirty = 1;
                business.ratings.ok = 0;
                break;
            case "ok":
                business.ratings.clean = 0;
                business.ratings.dirty = 0;
                business.ratings.ok = 1;
                break;
        }
    })

    
    // SUBMIT REVIEW
    $("#submit-btn").on("click", function() {
        business.zip = $("#display-zip").text();
        business.name = $("#business").val();
        business.comment = $(".comments").val();

        // var refLists = firebase.database().ref('03044').orderByChild('business/name');
        // console.log(refLists);
        
        var zipcode = database.ref("03801");
        // console.log(zipcode);
        zipcode.orderByChild("name").equalTo(business.name).on("child_added", function(snapshot) {
            console.log(snapshot.key);
        });
        
        // database.ref().on("value", function(snapshot) {
        //     console.log(snapshot.val());

            // if referenceObj has key("current business name exists in database under same zip") {
            //     push comment into Array
            //     add ratings to respective variables
            // }
            // else {
            // database.ref("zipCode/" + sessionStorage.getItem("zip")).push({
            //         business
            //     });

            //     console.log()
            // }
        // });
        
        // console.log(database.ref("/" + business.zip))
        // database.ref("03801").on("child_added", function(childSnapshot) {
        //     console.log(childSnapshot.val());
            // Handle the errors
            // }, function(errorObject) {
            //   console.log("Errors handled: " + errorObject.code);
            // });
    });
    
});//End of document.ready function