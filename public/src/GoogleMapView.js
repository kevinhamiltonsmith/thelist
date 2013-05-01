var GoogleMapView = Backbone.View.extend({

  tagName: "div",
  className: "eventsList",
  events: {
    'click .submitbutton': function(e) {
      e.preventDefault();
      thisMap.panTo(new L.LatLng(40.737, -73.923));
      this.collection.filterSearch($('.textbox').val());
    }
  },

  initialize: function() {
    if(this.collection) {
      this.collection.on('all', this.render, this);
    }

  },

  render: function(){
    $('.searchbox').html('<form class="searchform"><input class="textbox" type="text" placeholder="Enter Address">'
      + '<button class="submitbutton btn btn-large btn-block" type="submit">Search</button></form>')
    this.collection.forEach(function(Evnt){
      return (new MapEventView({model:Evnt}).render());
    });
  }
});