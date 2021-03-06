var express = require('express');
var request = require('request'),
    app     = express(),
    fs      = require("fs"),
    mongo   = require('mongodb');

 
//Setting up Mongoose
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema, 
    ObjectId = Schema.ObjectId;
    
mongoose.connect(process.env.MONGODBLIST);
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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// log requests
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/../public'));

app.get('/api/places?', function(req,res) {
  if(req.query.location) {
    var regEx = new RegExp(req.query.location, "i");
    Venue.find( { name: regEx }, function(err,item){res.send(item)});
  }
});

app.get('/api/events?', function(req,res){
  if(req.query.all === ''){
    console.log('Retrieving all events')
    fs.readFile(__dirname + '/../public/parsedList.json', function(err, data){
    	if(err){ throw err; }
      res.set("content-type", "application/json");

      res.json(data);
    });
  } else if(req.query.date) {
    console.log('Retrieving event on date: ' + req.query.date);
    Event.find({'date': req.query.date}, function(err, item) { res.send(item); });
  } else if(req.query.firstDate) {
    console.log('Retrieving event between dates(inclusive): ' + req.query.firstDate + ' and ' + req.query.lastDate);
    Event.find().where('date').lte(req.query.lastDate).gte(req.query.firstDate).exec( function(err, item) { res.send(item); });
  } else if(req.query.willSellout === '') {
    console.log('Retrieving events that will sell out');
    Event.find({'willSellout': true}, function(err, item) { res.send(item); });
  } else if(req.query.venue) {
    console.log('Retrieving events at venue: ' + req.query.venue);
    Event.find({'venue': req.query.venue}, function(err, item) { res.send(item); });
  } else if(req.query.artist) {
    console.log('Retrieving events by artist: ' + req.query.artist);
    Event.find({'artists': req.query.artist}, function(err, item) { res.send(item); });
  } else if(req.query.search) {
    console.log('Retrieving events by search: ' + req.query.search);
    fs.readFile(__dirname + '/../public/parsedList.json', function(err, data){
      if(err){ throw err; }
      res.set("content-type", "application/json");
      var data = JSON.parse(data.toString());
      var filtered = [];
      var words = req.query.search.toLowerCase();
      data.forEach(function(evnt){
        // for(var i = 0; i < words.length; i++){
          for(var j = 0; j < evnt.artists.length; j++){
            if((evnt.artists[j]).toLowerCase().indexOf(words) > -1){
              console.log(evnt.artists[j])
              filtered.push(evnt);
            }
          }
          if(evnt.venue.toLowerCase().indexOf(words) !== -1) {
            filtered.push(evnt);
          }
        // }
      })
      res.send(filtered);
    });
  }
});



var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});