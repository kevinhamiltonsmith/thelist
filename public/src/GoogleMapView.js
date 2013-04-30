var GoogleMapView = Backbone.View.extend({

  tagName: "div",
  className: "eventsList",

  initialize: function() {
    if(this.collection) {
      this.collection.on('all', this.render, this);
    }

  },

  render: function(){
    this.collection.forEach(function(Evnt){
      return (new MapEventView({model:Evnt}).render());
    });
  }
});