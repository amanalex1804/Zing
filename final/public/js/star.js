const rater = require('rater-js');

var myRating = raterJs( {
    element:document.querySelector("#rater"),
    rateCallback:function rateCallback(rating, done) {
      this.setRating(rating); 
      done(); 
    }
});

var myRating = raterJs({

    // shows a rating tooltip
    showToolTip: true,

    // the number of stars
    max: 5,

    // star size
    starSize: 16,

    // text to show when disabled.
    disableText: 'Thank you for your vote!',

    // Text to show when hover over stars.
    ratingText: '{rating}/{maxRating}',

    // displayed while user is rating but done not called yet.
    isBusyText: null,

    // between 0 and 1
    step: undefined,

    // reverse the ratings
    reverse: false,

    // is readonly?
    readOnly: false
    
});

// disable
myRating.disable();

// enable
myRating.enable();

// set the rating value
myRating.setRating(rating:number);

// get the rating value
myRating.getRating();

// clear the rating
myRating.clear();

// removes event handlers
myRating.dispose();

// gets the element
myRating.element();