var EventsView = Backbone.View.extend({

  tagName: "div",
  className: "div",
  initialize: function() {
    if(this.collection) {
      this.collection.on('remove', this.render, this);
    }
    
  },

  render: function(){
    // to preserve event handlers on child nodes, we must call .detach() on them before overwriting with .html()
    // see http://api.jquery.com/detach/
    this.$el.children().detach();
    var date = this.collection.at(0).get('date');
    return this.$el.html(new DateEventView({model:this.collection.at(0)}).render()).append(
      this.collection.map(function(Evnt){
        if(Evnt.get('date') !== date) {
          date = Evnt.get('date');
          return (new DateEventView({model:Evnt}).render()).append(new ArtistEventView({model: Evnt}).render());
        } else {
          return new ArtistEventView({model: Evnt}).render();
        }
      }));         
  },
  gridRender: function(){
    // to preserve event handlers on child nodes, we must call .detach() on them before overwriting with .html()
    // see http://api.jquery.com/detach/
    this.$el.children().detach();
    return this.$el.html('<caption class=lead>Events</caption><thead><tr><th>Date</th><th>Venue</th><th>Artists</th></tr></thead>').append(
      this.collection.map(function(Evnt){
        return new ArtistEventView({model: Evnt}).render();
      })
    );         
  },
});