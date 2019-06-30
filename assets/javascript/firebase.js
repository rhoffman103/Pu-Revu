$(document).ready(function() {

    var firebaseConfig = {
        apiKey: "AIzaSyB_ua18dh0qZ4QVSP0B7Wu2APNOopNo6dM",
        authDomain: "pu-review-dev.firebaseapp.com",
        databaseURL: "https://pu-review-dev.firebaseio.com",
        projectId: "pu-review-dev",
        storageBucket: "pu-review-dev.appspot.com",
        messagingSenderId: "89693327753",
        appId: "1:89693327753:web:5306fe01f706fe2e"
    };

    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    const Business = function(name, zip) {
        this.name = name;
        this.zip = zip;
        this.reviews = [];
        this.ratings  = {   
            recommend: 0,
            oppose:    0,
            clean:     0,
            dirty:     0,
            ok:        0,
        }
    };

    function defineFBController() {
        const fbController = {
            Review: function(comment, ratings, dateAdded) {
                this.comment = comment;
                this.ratings = ratings;
                this.dateAdded = dateAdded;
            },

            addNewBusiness: function({ name, zip, reviews, ratings }) {
                return new Promise((resolve) => {
                    database.ref("/businesses").push({
                        zip, name, reviews, ratings
                    })
                    .then((snapshot) => resolve({ businessKey: snapshot.key }))
                })
            },

            addNewReview: function({ comment, ratings, dateAdded }, businessKey) {
                return new Promise((resolve) => {
                    database.ref(`/businesses/${businessKey}/reviews`).push({
                        comment, ratings, dateAdded
                    })
                    .then((snapshot) => resolve({ reviewKey: snapshot.key, businessKey }))
                })
            },

            updateBusinessRatings: function(review, businessKey) {
                return database.ref(`/businesses/${businessKey}`).once('value')
                .then((fbData) => {
                    const businessRatings = fbData.val().ratings
                    database.ref(`/businesses/${businessKey}/ratings`).update({
                            recommend: businessRatings.recommend + review.ratings.recommend,
                            oppose:    businessRatings.oppose    + review.ratings.oppose,
                            clean:     businessRatings.clean     + review.ratings.clean,
                            dirty:     businessRatings.dirty     + review.ratings.dirty,
                            ok:        businessRatings.ok        + review.ratings.ok,
                    },  )
                })
            },

            findMatchingBusiness: function(businessName, zip) {
                return new Promise((resolve) => {
                    database.ref('/businesses')
                    .orderByChild('name').equalTo(businessName).once('value')
                    .then(snapshot => {
                        if (snapshot.val()) {
                            var obj = snapshot.val();
                            Object.keys(obj)
                            .forEach(businessKey => {
                                if (obj[businessKey].zip === zip) {
                                    resolve({ key: businessKey, ...obj[businessKey] })
                                }
                            });
                        }
                        resolve(null)
                    })
                })  
            },

            getBusinessesByZip: function(zip) {
                return new Promise((resolve, reject) => {
                    database.ref("businesses").orderByChild("zip")
                    .equalTo(zip).once("value")
                    .then((snapshot) => {
                        if (snapshot.val() !== null)
                            resolve(snapshot.val());
                    })
                    .catch((err) => reject(err))
                });
            },

            getBusinessByKey: function(key) {
                return new Promise((resolve, reject) => {
                    database.ref(`/businesses/${key}`).once("value")
                        .then((snap) => {
                            const jSnap = snap.val();
                            const reviews = jSnap.reviews;
                            const business = {
                                name: utils.toTitleCase(jSnap.name),
                                zip: jSnap.zip,
                                ratings: jSnap.ratings
                            };
                    
                            resolve({ business, reviews });
                        })
                        .catch((err) => reject(err));
                });
            },

            pushNewReviewLogic: function(businessName, zip, review) {
                fbController.findMatchingBusiness(businessName, zip)
                    .then((fbData) => {
                        if (fbData) return fbController.addNewReview(review, fbData.key);
                        const newBusiness = new Business (businessName, zip);
                        return fbController.addNewBusiness(newBusiness);
                    })
                    .then((fbData) => {
                        if (fbData.businessKey && !fbData.reviewKey)
                            return fbController.addNewReview(review, fbData.businessKey);
                        return Promise.resolve(fbData);
                    })
                    .then((fbData) => {
                        if (fbData.businessKey && fbData.reviewKey)
                            return fbController.updateBusinessRatings(review, fbData.businessKey);
                    })
                    .then(() => updateDom.submitSuccess())
                    .catch((err) => {
                        console.error(err);
                        updateDom.warningMessage($('#failed-submit'), 'Oops! Something when wrong!');
                    });
            }
        };
        return fbController;
    };
    window.fbController = defineFBController();
});