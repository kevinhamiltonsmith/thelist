var express = require('express');
var app = express();
var parser = require('./parser.js');
var fs = require("fs");
var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 10083, {auto_reconnect: true, fsync:true});
db = new Db('events', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'events' database");
        db.collection('events', {strict:true}, function(err, collection) {
            if (err) { throw err; }
        });
    }
});


// log requests
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
  fs.readFile(__dirname + '/../public/parsedList.txt', function(err, data){
  	if(err){ throw err; }
    res.json(JSON.parse(data.toString()));
  });
});
//handle requests by date
app.get('/event/date',function(req,res){
  var date = req.params.date;
  console.log('Retrieving events on date: ' + date);
    db.collection('events', function(err, collection) {
        collection.findOne({'date': date}, function(err, item) {
            res.send(item);
        });
    });
});
//handle requests by venue
app.get('/event/venue',function(req,res){
  var venue = req.params.venue;
    console.log('Retrieving events by artist: ' + date);
    db.collection('events', function(err, collection) {
        collection.findOne({'date': date}, function(err, item) {
            res.send(item);
        });
    });
});
//handle requests by artist
app.get('/event/artist',function(req,res){
  var artist = req.params.artist;
  res.send("THIS BAND");
});
//handle requests by location
app.get('/bands/name',function(req,res){
  var name = req.params.name;
  res.send(name);
});

app.listen(3000);
console.log('listening on port 3000');

