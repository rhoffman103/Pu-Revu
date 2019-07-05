# Pu ReVu
## Project 1: Group 5
[Live Link](https://rhoffman103.github.io/Pu-Revu/)

### Team Members: 
+ Andrew H
+ Bobby H
+ Ryan F
+ Kyle K

What is the mission statement of *Pu ReVu*? To help you find a **Glorious** and **Clean** public restroom experience without hassle!

It happens all too often. You're out on the town and nature calls. Home is too far, and you must make do with what's around. But you can never be sure what you might get when it comes to public facilities. That's where *Pu ReVu* comes in. Simply start the web app and hit **"Let's Go!"**

First thing, the *Pu ReVu* site will take account of your current location and load up a list of public restrooms in your area. Each one listed with an overall user recommendation and cleanliness rating. Click on a specific public restroom to get a full breakdown of all ratings along with any comments left by *ReVuers*™. This way you'll know what to avoid, and where to *go*.

But say you've found a discrepancy in a *ReVu*, or a restroom that lacks a rating. Now it's your chance to write your own *Pu ReVu* and become part of the *ReVuers*™ community. Simply list the business or location name, along with your zip code if not already documented by the site. Give a recommendation and cleanliness rating along with a personal comment. Hit the **Submit** button and you've done it! Now your *ReVu* is live and helping others.

Finally, you're ready to have a relaxing restroom experience. To help, *Pu ReVu* has provided a few reading materials to help pass the time. You can search the top trending *New York Times* articles by topic, try out the Dad Joke Generator, or check the local forecast.

It's easy, it's convenient, it's Pu Revu.

* [utilities methods](#utilities-methods)
* [update-dom methods](#updatedom-methods)
* [firebase db methods](#firebase-db)

## Utilities Methods

### utils.toTitleCase()

the ```toTitleCase()``` method returns a string with the first letter of each word capitalized.

**Syntax**

> ```utils.toTitleCase(```*```string```*```)```

### utils.isZipCode()

the ```isZipCode()``` method tests the passed value if it's a string. returns a boolean. Valid zip codes can be formatted as 5 or 9 digits with the last 4 separated by a dash. Note 99999 does not exist as a US zip code, but the reqex expression that tests the passed value will still return true.

ex. 12345 or 12345-1234

**Syntax**

> ```utils.isZipCode(```*```string```*```)```

### utils.getZipCodeFromWebStorage()

The ```getZipCodeFromWebStorage()``` method returns a zipcode from session storage. If webstorage is not supported, it returns ```undefined```. Otherwise it will return the zip or ```null``` if there is no zip stored.

**Syntax**

> ```utils.getSipcodeFromWebStorage()```

## updateDom Methods

### updateDom.warningMessage()

The ```warningMessage()``` method appends an element with a warning message to the DOM. 

**Syntax**

> ```updateDom.warningMessage(```*```string, string```*```)```

The first argument is the selector for the location to append the element on the dom. The second argument is the meassage you want to relay.

### updateDom.submitSuccess()

The ```submitSucess()``` method updates the DOM once a review has been successfully submitted.

**Syntax**

> ```updateDom.submitSuccess()```

### updateDom.setZipFromSessionStorage()

the ```setZipFromSessionStorage()``` method will set the value of the zip code form field if there is a zip stored in session storage.

**Syntax**

> ```updateDom.setZipFromSessionStorage()```

The zip form field must have an id of display-zip

### updateDom.renderListOfBusinesses()

The ```renderListOfBusinesses()``` method appends a list of cards containing each businesses information

**Syntax**

> ```updateDom.renderListOfBusinesses(```*```object, method```*```)```

The first argument is the returned value from the firebase DB query. The second argument is ```utils.toTitleCase()``` used to capitalize the business name.

See [firebase children for object structure](#firebase-children-ctructure)

### updateDom.rendesFistPuReviewer()

The ```renderFirstPuReviewer``` method appeds an element to the dom at a specified location.

**Syntax**

> ```updateDom.renderFirstPuReviewer(```*```string```*```)```

The only argument is a selector for the DOM element

### updateDom.renderTotalRatings()

The ```renderTotalRatings()``` method appends the total ratings of a business to a specified location in the DOM.

**Syntax**

> ```updateDom.renderTotalRatings(```*```string, object```*```)```

The first argument is an element selector. The second argument is an object with business info.

See [firebase children for object structure](#firebase-children-structure)

### updateDom.listReviews()

The ```listReviews()``` method apends a list of reviews at a specified location on the DOM. 

**Syntax**

> ```updateDom.renderTotalRatings(```*```string, object```*```)```

The first argument is an element selector. The second is an object containing a business.

See [firebase children for object structure](#firebase-children-structure)

### updateDom.listReviews()

The ```listReviews()``` method appends a list of review cards to the DOM at a specified location.

**Syntax**

> ```updateDom.listReviews(```*```string, object```*```)```

The first argument is an element selector. The second is an object containing a business's reviews

## Firebase DB

### DB Structure

All businessses and reviews are stored in the ```businesses``` child in the root of the databse.

Each business and review has a unique key identifier.

All new businesses and reivies should be '*pushed*' into the db with the firebase reference ```push()``` method.

### Firebase Children Structure

```javascript
businesses: {
    'some unique key': {
        name: '',
        zip: '',
        ratings: {
            clean: 0,
            dirty: 0,
            ok: 0,
            oppose: 0,
            recommend: 0
        },{
        reviews: {
            'some unique key': {
                comment: '',
                dateAdded: '',
                ratings: {
                    clean: 0,
                    dirty: 0,
                    ok: 0,
                    oppose: 0,
                    recommend: 0
                },
            }
        }
    }
}
```
