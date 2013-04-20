var express = require('express');
var app = express();
var parser = require('./parser.js');
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



// log requests
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/../public'));

app.get('/parsedList', function(req,res){
  fs.readFile(__dirname + '/../public/parsedList.json', function(err, data){
  	if(err){ throw err; }
    res.send(JSON.parse(data.toString()));
  });
});

//handle requests by date
app.get('/event/id:dat',function(req,res){
  var id = req.params.dat;
  console.log('Retrieving event: ' + id);
    Event.findOne({'_id': id}, function(err, item) { res.send(item); });
});
//handle requests by venue
app.get('/event/venue:venue',function(req,res){
  var venue = req.params.venue;
    console.log('Retrieving events at: ' + venue);
    db.collection('events', function(err, collection) {
        collection.findOne({'venue': venue}, function(err, item) {
            res.send(item);
        });
    });
});
//handle requests by ages
app.get('/event/',function(req,res){
  var venue = req.params.venue;
    console.log('Retrieving events at: ' + venue);
    db.collection('events', function(err, collection) {
        collection.findOne({'venue': venue}, function(err, item) {
            res.send(item);
        });
    });
});

app.listen(3000);
console.log('listening on port 3000');

