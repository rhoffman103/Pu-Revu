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

    const database = firebase.database();

    function defineFBController() {
        const fbController = {
            Business: function(name, zip) {
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
            },

            Review: function(comment, ratings, dateAdded) {
                this.comment = comment;
                this.ratings = ratings;
                this.dateAdded = dateAdded;
            },

            addNewBusiness: function({ name, zip, reviews, ratings }) {
                return database.ref("/businesses")
                    .push({ zip, name, reviews, ratings })
                    .then((snapshot) => Promise.resolve({ businessKey: snapshot.key }))
                    .catch((err) => Promise.reject('Error adding new business', err));
            },

            addNewReview: function({ comment, ratings, dateAdded }, businessKey) {
                return database.ref(`/businesses/${businessKey}/reviews`)
                    .push({ comment, ratings, dateAdded })
                    .then((snapshot) => Promise.resolve({ reviewKey: snapshot.key, businessKey }))
                    .catch((err) => Promise.reject('Error adding new review', err));
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
                        });
                    })
                    .catch((err) => Promise.reject('Error updating business ratings', err));
            },

            findMatchingBusiness: function(businessName, zip) {
                return database.ref('/businesses')
                    .orderByChild('name').equalTo(businessName).once('value')
                    .then(snapshot => {
                        let matchBusiness = null;
                        if (snapshot.val()) {
                            const obj = snapshot.val();
                            Object.keys(obj)
                            .some(businessKey => {
                                if (obj[businessKey].zip === zip)
                                    matchBusiness = { key: businessKey, ...obj[businessKey] };
                            });
                        }
                        if (matchBusiness) return Promise.resolve(matchBusiness);
                        return Promise.resolve(null);
                    })
                    .catch((err) => Promise.reject('Error finding matching business', err));
            },

            getBusinessesByZip: function(zip) {
                return database.ref("businesses").orderByChild("zip")
                    .equalTo(zip).once("value")
                    .then((snapshot) => Promise.resolve(snapshot.val()))
                    .catch((err) => Promise.reject(err));
            },

            getBusinessByKey: function(key) {
                return database.ref(`/businesses/${key}`).once("value")
                    .then((snap) => {
                        const jSnap = snap.val();
                        const reviews = jSnap.reviews;
                        const business = {
                            name: utils.toTitleCase(jSnap.name),
                            zip: jSnap.zip,
                            ratings: jSnap.ratings
                        };
                        return Promise.resolve({ business, reviews });
                    })
                    .catch((err) => Promise.reject(err));
            },

            pushNewReviewLogic: function(businessName, zip, review) {
                return this.findMatchingBusiness(businessName, zip)
                    .then((fbData) => {
                        if (fbData) return this.addNewReview(review, fbData.key);
                        const newBusiness = new this.Business (businessName, zip);
                        return this.addNewBusiness(newBusiness);
                    })
                    .then((fbData) => {
                        if (fbData.businessKey && !fbData.reviewKey)
                            return this.addNewReview(review, fbData.businessKey);
                        return Promise.resolve(fbData);
                    })
                    .then((fbData) => {
                        if (fbData.businessKey && fbData.reviewKey)
                            return this.updateBusinessRatings(review, fbData.businessKey);
                    })
                    .then(() => Promise.resolve())
                    .catch((err) => Promise.reject(err));
            }
        };
        return fbController;
    };
    window.fbController = defineFBController();
});