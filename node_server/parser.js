var fs = require("fs");
var parser = require('./parser.js');
var mongoose = require('mongoose');
var url = require('url');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://thelist:thelist@dharma.mongohq.com:10083/theList');

var parseFile = function(){
  fs.readFile(__dirname + '/../public/email.txt', function read(err, data) {
    if (err) { throw err; }
    var bandObj = divideEvents(data.toString());
    console.log(bandObj)
    fs.writeFile(__dirname + '/../public/parsedList.json', JSON.stringify(bandObj));
  });
};

var divideEvents = function(subInput){
  var month =  /(?:\n)(\w{3})(?: )/;
  var evnt, database = [];

  //remove top and bottom from email
  subInput = subInput.split('\n\n')[3];
  //now remove all events and parse them
  while(subInput.length > 0){
    evnt = {};
    evnt.txt = subInput.split(month,1).toString();

    subInput = subInput.substring(evnt.txt.length+1);
    //eliminate any cancelled events
    if(evnt.txt.indexOf("cancelled") === -1) {
      eventParse(evnt);
      //duplicate events on multiple days and add special text
      if(evnt.date.length > 1) {
        var tempEvent;
        for(day in evnt.date) {
          tempEvent = objectCopy(evnt);
          tempEvent.date = evnt.date[day];
          tempEvent.specialInfo += "(Multi-day event)";
          database.push(tempEvent);
        }
      } else {
        evnt.date = evnt.date[0];
        database.push(evnt);
      }
    }
  }
  return database;
};

//used to copy objects
var objectCopy = function (obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
};

// takes an event object and returns an event object containing, month, day, artist array,
// location, possible parameters: price, ages, will sell out, reccommended, extra $ for underage
var eventParse = function(evnt){
  parseDate(evnt);
  parseArtists(evnt);
  parseAddress(evnt);
  if(evnt.artists === undefined) {
    evnt.artists = evnt.venue;
  }
  parseSpecialInfo(evnt);
  if(evnt.txt.length > 0) evnt.priceAndTime = evnt.txt;
  delete evnt.txt;
  return evnt;
};

var parseAddress = function(evnt){
  //split address on ages
  var address = evnt.txt.split(/(a\/a)|([0-9][0-9]\+)|(\?\/\?)|([0-9]\+)(?= )/);
  var fullAddress = address[0].split(/(, )/);
  evnt.venue = fullAddress.shift();
  if(address.length === 1) {
    address = address[0].substring(evnt.venue.length + 2, address[0].length);

    evnt.address = address.split(/(\$|\d|\#|\*|\^|\@)/)[0];
    if(evnt.address.length <= 1) {
      evnt.address = address.split(/(, )/)[0];
      address = address.substring(evnt.address.length + 2, address.length);
      var city = address.split(/(, )/)[0];
      evnt.address += ', ' + city;
      address = address.substring(city.length + 2, address.length);
      var state = address.split(/(\$|\d|\#|\*|\^|\@)/)[0];
      if(state){
        evnt.address += ', ' + state;
        evnt.txt = address.substring(state.length, address.length);
      }
    }

  } else {
    evnt.address = '';
    for(var i = 0; i < fullAddress.length; i++){
      if(fullAddress[i].length > 2) evnt.address += fullAddress[i] + ', ';
    }
    evnt.address = evnt.address.substring(0, evnt.address.length - 2).trim();
    if(address.length > 1) {
      for(var i = 1; i < address.length; i++) {
        if(address[i]){
          if(!evnt.ages) evnt.ages = address[i].trim();
          else if(evnt.ages) evnt.txt = address[i].trim();
        }
      }
    }
  }
};

var previousMonth;

var parseDate = function(evnt){
  var month = /^(\w{3})(?: )/;
  var months = {
    'jan' : 0,
    'feb' : 1,
    'mar' : 2,
    'apr' : 3,
    'may' : 4,
    'jun' : 5,
    'jul' : 6,
    'aug' : 7,
    'sep' : 8,
    'oct' : 9,
    'nov' : 10,
    'dec' : 11
  };
  var date = /^(?:\s?)\d{1,2}(\/\d{1,2}){0,4}( postponed:  )?(?: *)/;
  var dayOfWeek = /((mon)|(tue)|(wed)|(thr)|(fri)|(sat)|(sun))(?: +)/;
  //filter date of event
  evnt.month = month.exec(evnt.txt)['1'];
  evnt.txt = evnt.txt.slice(evnt.month.length+1);
  evnt.date = date.exec(evnt.txt)[0];
  evnt.txt = evnt.txt.slice(evnt.date.length);
  evnt.date = evnt.date.trim();
  evnt.date = evnt.date.split("/");
  evnt.dayOfWeek = dayOfWeek.exec(evnt.txt);
  if(evnt.dayOfWeek){
    evnt.dayOfWeek = evnt.dayOfWeek[1];
    evnt.txt = evnt.txt.slice(evnt.dayOfWeek.length+1);
  }
  var now = new Date();
  var year;
  if(months[evnt.month] < now.getMonth()){
    year = now.getFullYear() +1;
  } else {
    year = now.getFullYear();
  }
  date = [];
  for(day in evnt.date) {
    if(months[evnt.month]){
      date.push(new Date(year, months[evnt.month], parseInt(evnt.date[day])));
      previousMonth = months[evnt.month];
    } else {
      date.push(new Date(year, previousMonth, parseInt(evnt.date[day])));
    }
  }
  evnt.date = date;
  delete evnt.month;
  delete evnt.dayOfWeek;
};

var parseArtists = function(evnt){
  var artists = / at /;
  var artistObj = (artists.exec(evnt.txt));
  if(artistObj && artistObj.index) {
    var artistsInd = artistObj.index;
    evnt.artists = evnt.txt.slice(0, artistsInd);
    evnt.txt = evnt.txt.slice(evnt.artists.length + 4);
    evnt.artists = evnt.artists.split(/((\,)|,)/);
    evnt.artists = evnt.artists.map(function(artist){ return artist.trim();});
    evnt.artists = evnt.artists.filter(function(artist){return artist.length > 2});
    return true;
  }
};

var parseSpecialInfo = function(evnt){
  evnt.txt = evnt.txt.trim();
  evnt.specialInfo = [];
  var numSpec = 0;
  while(evnt.txt[evnt.txt.length-1] === ')'){
    evnt.txt = evnt.txt.substring(0,evnt.txt.length-1);
    var specialInfo = evnt.txt.split('(');
    evnt.specialInfo.push(specialInfo[specialInfo.length-1]);
    evnt.txt = evnt.txt.substring(0,evnt.txt.length - (evnt.specialInfo[numSpec].length + 1)).trim();
    numSpec++;
  }
  if(evnt.specialInfo.length === 0) delete evnt.specialInfo;
  //get special symbols
  evnt.pitWarning = false;
  evnt.recommended = 0;
  evnt.willSellout = false;
  evnt.noInsOuts = false;
  evnt.underagePayMore = false;
  var curChar = evnt.txt[evnt.txt.length-1];
  var characters = [' ', '@', '#', '*', '^', '$'];
  while( characters.indexOf(curChar) > -1 && evnt.txt.length > 0 ){
    switch(curChar)
    {
      case '@':
        evnt.pitWarning = true;
        break;
      case '#':
        evnt.noInsOuts = true;
        break;
      case '*':
        evnt.recommended++;
        break;
      case '^':
        evnt.underagePayMore = true;
        break;
      case '$':
        evnt.willSellout = true;
        break;
    }
    evnt.txt = evnt.txt.substring(0,evnt.txt.length-1);
    curChar = evnt.txt[evnt.txt.length-1];
  }
};

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

parseFile();
fs.readFile(__dirname + '/../public/parsedList.json', function read(err, data) {
  if (err) { throw err; }
  enterIntoDatabase(data);
});