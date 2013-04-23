var EventsView = Backbone.View.extend({

  tagName: "table",
  className: "table",
  
  initialize: function() {
  },

  render: function(){
    // to preserve event handlers on child nodes, we must call .detach() on them before overwriting with .html()
    // see http://api.jquery.com/detach/
    this.$el.children().detach();


    return this.$el.html('<caption class=lead>Events</caption><thead><tr><th>Venue</th><th>Artists</th><th>Date</th></tr></thead>').append(
      this.collection.map(function(Event){
        return new EventView({model: Event}).render();
      })
    );         
  }


});