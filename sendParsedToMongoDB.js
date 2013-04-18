var fs = require("fs");
var parser = require('./parser.js');
var mongoose = require('mongoose');
var url = require('url');
var log = console.log;
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://thelist:thelist@dharma.mongohq.com:10083/theList');

parser.parseFile();
fs.readFile(__dirname + '/public/parsedList.txt', function read(err, data) {
  if (err) { throw err; }
  enterIntoDatabase(data);
});

var eventSchema = new Schema({
    eventID         : ObjectId
  , date            : [Date]
  , artists         : [String]
  , venue           : String
  , address         : String
  , ages            : String
  , specialInfo     : [String]
  , pitWarning      : Boolean
  , willSellout     : Boolean
  , noInsOuts       : Boolean
  , underagePayMore : Boolean
  , priceAndTime    : String
  , recommended     : Number
});

var Event = mongoose.model('Event', eventSchema);

var enterIntoDatabase = function(data){
  var events = JSON.parse(data.toString());
  Event.create(events, function(err) {
    if(err) {throw err};
    console.log('entered into database');
  });
};
