var fs = require("fs");
var mongoose = require('mongoose');
var url = require('url');
var request = require('request');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://thelist:thelist@dharma.mongohq.com:10083/theList');


var divideVenues = function(data){
  data = data.split('\n');
  for(var i = 0; i < data.length; i++){
    data[i] = data[i].trim();
  }
  return data;
}


var venueSchema = new Schema({
    venueID         : ObjectId
  , originalString  : String
  , name            : String
  , address         : String
  , location        : Object
  , longitude       : Number
  , latitude        : Number
  , icon            : String
  , queryResult     : Object
});


var Venue = mongoose.model('Venue', venueSchema);

var doSomethingWithRequest = function (model) {
  var data  = model.originalString;
  request('https://selby-list.herokuapp.com/api/places?location=' + encodeURIComponent(data), function(error,res,body){
    console.log(body)
    if(JSON.parse(body).results[0]) {
      model.name = data.split(',')[0];
      model.address = data.substring(model.name.length+2, data.length);
      model.latitude = JSON.parse(body).results[0].geometry.location.lat;
      model.longitude = JSON.parse(body).results[0].geometry.location.lng;
      model.address = JSON.parse(body).results[0].formatted_address;
      model.icon = JSON.parse(body).results[0].icon;
      model.queryResult = JSON.parse(body);
      model.save();
    } else {
      // console.log(data)
    }
  });
};

var enterIntoDatabase = function(data){
  data.forEach(function (venue) {
    venue = new Venue({
      originalString: venue
    });
    doSomethingWithRequest(venue);
    venue.save();
  });
};

fs.readFile(__dirname + '/../public/venues.txt', function read(err, data) {
  if (err) { throw err; }
  var venues = divideVenues(data.toString());
  enterIntoDatabase(venues);
});
