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

app.get('/api/events/all', function(req,res){
  fs.readFile(__dirname + '/../public/parsedList.json', function(err, data){
  	if(err){ throw err; }
    res.set("content-type", "application/json");

    res.json(JSON.parse(data.toString()));
  });
});

//find events by id
app.get('/api/events/id:dat',function(req,res){
  var id = req.params.dat.substring(1);
  console.log('Retrieving event: ' + id);
    Event.findOne({'_id': id}, function(err, item) { res.send(item); });
});

//find events by date
app.get('/api/events/date:dat',function(req,res){
  var date = req.params.dat.substring(1);
  console.log('Retrieving event on date: ' + date);
    Event.find({'date': date}, function(err, item) { res.send(item); });
});

//find events that will sell out
app.get('/api/events/willSellout',function(req,res){
  console.log('Retrieving events that will sell out');
    Event.find({'willSellout': true}, function(err, item) { res.send(item); });
});

//find events by artist name
app.get('/api/events/artist:dat',function(req,res){
  var artist = req.params.dat.replace('+',' ').substring(1); //TODO: url decode
  console.log('Retrieving events by artist: ' + artist);
    Event.find({'artists': artist}, function(err, item) { res.send(item); });
});

//find events by venue name
app.get('/api/events/venue:dat',function(req,res){
  var venue = req.params.dat.replace('+',' ').substring(1);
  console.log('Retrieving events at venue: ' + venue);
    Event.find({'venue': venue}, function(err, item) { res.send(item); });
});


//routes
// app.get('')


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

