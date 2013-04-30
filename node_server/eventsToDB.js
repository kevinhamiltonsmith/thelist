var fs = require("fs");
var mongoose = require('mongoose');
var url = require('url');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://thelist:thelist@dharma.mongohq.com:10083/theList');

var divideVenues = function(data){
  data = data.split('\n');
  var venues = [];
  for(var i = 0; i < data.length; i++){
    var venue = {};
    venue.name = data[i].split(',')[0];
    venue.address = data[i].substring(venue.name.length+2, data[i].length);
    venues.push(venue)
    console.log(venue)
  }
  return venues;
}


var venueSchema = new Schema({
    venueID         : ObjectId
  , name            : String
  , address         : String
  , longitude       : Number
  , latitude        : Number
});


var Venue = mongoose.model('Venue', venueSchema);

var enterIntoDatabase = function(data){
  var venues = data;
  Venue.create(venues, function(err) {
    if(err) {throw err};
    console.log('entered into database');
  });
};


fs.readFile(__dirname + '/../public/venues.txt', function read(err, data) {
  if (err) { throw err; }
  var venues = divideVenues(data.toString());
  fs.writeFile(__dirname + '/../public/venueList.json', JSON.stringify(venues));
  enterIntoDatabase(venues);
});
