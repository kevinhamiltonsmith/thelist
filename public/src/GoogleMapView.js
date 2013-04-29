var GoogleMapView = Backbone.View.extend({

  tagName: "div",
  className: "eventsList",

  initialize: function() {
    if(this.collection) {
      this.collection.on('all', this.render, this);
    }

  },

  render: function(){
    // to preserve event handlers on child nodes, we must call .detach() on them before overwriting with .html()
    // see http://api.jquery.com/detach/
    this.$el.children().detach();
    this.$el.html(this.collection.map(function(Evnt){
      return (new MapEventView({model:Evnt}).render());
    }));
  }
});