var EventsView = Backbone.View.extend({

  tagName: "table",
  className: "table",

  render: function(){
    // to preserve event handlers on child nodes, we must call .detach() on them before overwriting with .html()
    // see http://api.jquery.com/detach/
    this.$el.children().detach();
    return this.$el.html('<caption class=lead>Events</caption><thead><tr><th>Date</th><th>Venue</th><th>Address</th><th>Artists</th></tr></thead>').append(
      this.collection.map(function(Evnt){
        return new EventView({model: Evnt}).render();
      })
    );         
  }
});