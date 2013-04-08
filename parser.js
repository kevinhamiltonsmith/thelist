//using node.js i want to open and parse email into huge object
var input = "apr  5 fri Dustonious Maximus, The Skunkadelics, David's Birthday!,\n       The Thirsty Three, DetachDolls, Demi And The Gods!\n       at 924 Gilman Street, Berkeley a/a $10 7pm *** @ (Luna's 16th Birthday)\napr  5 fri Condition, Replica, Negative Standards, Stressors\n       at the Hidden Temple, 1209 8th Avenue, Oakland a/a $5 7:30pm ** @\napr  5 fri Rusty Zinn And His Band\n       at Cafe Rande Vu, 2430 Broadway, Oakland a/a free 6pm/8pm **\napr  5 fri Syd The Kyd, Trev Case, Koslov\n       at the New Parish, Oakland 18+ $10/$12 8pm/9pm ***\napr  5 fri Galaxy Express (Seoul, Korea), Unko Atama, Modern Kicks,\n       Pleasure Gallows at Eli's Mile High Club, Oakland 21+ $7 **\napr  5 fri The Mallard, Freddie And The Aztecs, The Spyrals, Steel Cranes\n       at the Uptown, Oakland 21+ free 6pm/9pm **\napr  5 fri Soilwork, Jeff Loomis, Blackguard, Hatchet\n       at Slim's, S.F. 6+ $21/$24 7pm/8pm *** @\napr  5 fri Bayonics, My Peoples, Sean Tabor, Shawn Megofna\n       at the Great American Music Hall, S.F. 6+ $15 8pm/9pm **\napr  5 fri Alesso at the Warfield, S.F. a/a # **\napr  5 fri Thee Oh Sees at the Verdi Club, 2424 Mariposa, S.F. a/a **\napr  5 fri Moonshine Cabaret at the Chapel, S.F. a/a $15/$18 9pm **\napr  5 fri Whiskerman, Decker, Kelly McFarling\n       at the Bottom of the Hill, S.F. 21+ $10 8:30pm/9pm **\napr  5 fri Billy Cramer And Share The Land, The Boars,\n       TV Mike And The Scarecrows at the Hemlock, S.F. 21+ $7 9:30pm **"
//takes an input string and returns an array of all events
var divideEvents = function(input){
  var month =  /(?:\n)(\w{3})(?: )/;
  var evnt, subInput = input, database = [];

  while(subInput.length>0){
    evnt = {};
    evnt.txt = subInput.split(month,1).toString();

    subInput = subInput.substring(evnt.txt.length+1);
    eventParse(evnt);  
    console.log(evnt)  
    database.push(evnt);
  }

  return database;
};

// takes an event object and returns an event object containing, month, day, artist array,
// location, possible parameters: price, ages, will sell out, reccommended, extra $ for underage
var eventParse = function(evnt){
  var month = /^(\w{3})(?: )/;
  var day = /^(?:\s?)\d{1,2}(?: )/;
  evnt.month = month.exec(evnt.txt)['1'];
  evnt.txt = evnt.txt.substring(evnt.month.length+1);
  evnt.day = month.exec(evnt.txt);
  console.log(evnt.day)
  evnt.txt = evnt.txt.substring(evnt.day.length+1);
  return evnt;
};

divideEvents(input);
