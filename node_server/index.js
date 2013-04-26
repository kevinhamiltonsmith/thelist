var express = require('express');
var app = express();
var fs = require("fs");
var mongo = require('mongodb');

 
//Setting up Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://thelist:thelist@dharma.mongohq.com:10083/theList');
var db = mongoose.connection;

db.once('open',function(err, db) {
	if(err) throw err; else { console.log("Connected to 'events' database"); }
});

var eventSchema = new Schema({
    eventID         : ObjectId
  , date            : Date
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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// log requests
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/../public'));

app.get('/api/events?', function(req,res){
  console.log(req.query)
  if(req.query.all){
    fs.readFile(__dirname + '/../public/parsedList.json', function(err, data){
    	if(err){ throw err; }
      res.set("content-type", "application/json");

      res.json(JSON.parse(data.toString()));
    });
  } else if(req.query.date) {
    console.log('Retrieving event on date: ' + req.query.date);
    Event.find({'date': req.query.date}, function(err, item) { res.send(item); });
  } else if(req.query.willSellout) {
    console.log('Retrieving events that will sell out');
    Event.find({'willSellout': true}, function(err, item) { res.send(item); });
  } else if(req.query.venue) {
    console.log('Retrieving events at venue: ' + req.query.venue);
    Event.find({'venue': req.query.venue}, function(err, item) { res.send(item); });
  } else if(req.query.artist) {
    console.log('Retrieving events by artist: ' + req.params.artist);
    Event.find({'artists': req.query.artist}, function(err, item) { res.send(item); });
  } 
});



var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

