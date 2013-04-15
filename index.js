var express = require('express');
var app = express();

// log requests
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/css'));


app.get('/',function(req,res){
  res.send("yo");
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