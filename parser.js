var fs = require("fs");
var bandObj;
var parseFile = function(){
  fs.readFile(__dirname + '/public/email.txt', function read(err, data) {
    if (err) { throw err; }
    bandObj = divideEvents(data.toString());
    fs.writeFile(__dirname + '/public/parsedList.txt', JSON.stringify(bandObj));
    fs.writeFile(__dirname + '/public/parsedList.json', JSON.stringify(bandObj));
  });
};

var divideEvents = function(subInput){
  var month =  /(?:\n)(\w{3})(?: )/;
  var evnt, database = [];

  //remove top and bottom from email
  subInput = subInput.split('\n\n')[3];
  // console.log(subInput);

  //now remove all events and parse them
  while(subInput.length > 0){
    evnt = {};
    evnt.txt = subInput.split(month,1).toString();

    subInput = subInput.substring(evnt.txt.length+1);
    eventParse(evnt);
    database.push(evnt);
  }

  return database;
};

// takes an event object and returns an event object containing, month, day, artist array,
// location, possible parameters: price, ages, will sell out, reccommended, extra $ for underage
var eventParse = function(evnt){
  var month = /^(\w{3})(?: )/;
  var date = /^(?:\s?)\d{1,2}(\/\d{1,2}){0,4}( postponed:  )?(?: *)/;
  var artists = / at /;
  var dayOfWeek = /((mon)|(tue)|(wed)|(thr)|(fri)|(sat)|(sun))(?: +)/;
  //filter date of event
  evnt.month = month.exec(evnt.txt)['1'];
  evnt.txt = evnt.txt.slice(evnt.month.length+1);
  evnt.date = date.exec(evnt.txt)[0];
  evnt.txt = evnt.txt.slice(evnt.date.length);
  evnt.date = evnt.date.trim();
  evnt.dayOfWeek = dayOfWeek.exec(evnt.txt);
  if(evnt.dayOfWeek){
    evnt.dayOfWeek = evnt.dayOfWeek[1];
    evnt.txt = evnt.txt.slice(evnt.dayOfWeek.length+1);
  }
  //filter artists field
  var artistObj = (artists.exec(evnt.txt));
  if(artistObj && artistObj.index) {
    var artistsInd = artistObj.index;
    evnt.artists = evnt.txt.slice(0, artistsInd);
    evnt.txt = evnt.txt.slice(evnt.artists.length + 4);
    evnt.artists = evnt.artists.split(/((\,)|,)/);
    evnt.artists = evnt.artists.map(function(artist){ return artist.trim();});
    evnt.artists = evnt.artists.filter(function(artist){return artist.length > 2});
  }
  //filter venue
  evnt.venue = /.*(?=,)/.exec(evnt.txt)[0];
  evnt.txt = evnt.txt.slice(evnt.venue.length + 2);
  //get address and ages
  evnt.address = evnt.txt.split(/(a\/a)|([0-9][0-9]\+)|([0-9]\+)(?= )/);
  for(var i = 1; i<evnt.address.length; i++) {
    if(evnt.address[i]){
      evnt.ages = evnt.address[i];
      break;
    }
  }
  evnt.txt = evnt.address[evnt.address.length-1].slice(1);
  evnt.address = evnt.address[0].trim();
  //find special messages
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

    //get price and time
  evnt.priceAndTime = evnt.txt
  delete evnt.txt;

  return evnt;
};

exports.parseFile = parseFile;
