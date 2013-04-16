var express = require('express');
var app = express();
var parser = require('./parser.js');
var fs = require("fs");

// log requests
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/css'));


app.get('/',function(req,res){
  res.send(parser.parseFile());
});

app.get('/thelist.txt',function(req,res){
  var response;
  fs.readFile(__dirname + '/email.txt', function read(err, data) {
    if (err) { throw err; }
    res.send(data);
  });
});

app.get('/bands',function(req,res){
  res.send("THIS BAND");
});

app.get('/bands/:name',function(req,res){
  var name = req.params.name;
  res.send(name);
});

app.listen(3000);
console.log('listening on port 3000');
