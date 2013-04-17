var express = require('express');
var app = express();
var parser = require('./parser.js');
var fs = require("fs");

// log requests
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
  fs.readFile(__dirname + '/public/parsedList.txt', function(err, data){
    res.json(JSON.parse(data.toString()));
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
