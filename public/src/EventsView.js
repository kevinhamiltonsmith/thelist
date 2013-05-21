var EventsView = Backbone.View.extend({

  tagName: "div",
  className: "div",
  events: {
      'submit .searchform': function(e) {
        e.preventDefault();
        this.collection.filterSearch($('.textbox').val());
      },
      'keyup .searchform': function(e) {
        e.preventDefault();
        if(window.prevTimeout) {
          window.clearTimeout(window.prevTimeout);
        }
        var that = this;
        window.prevTimeout = setTimeout(function(){
          that.collection.filterSearch($('.textbox')[0].value);
        }, 600);
      }
    },

  initialize: function() {
    if(this.collection) {
      this.collection.on('all', this.render, this);
    }

  },

  render: function(){
    // to preserve event handlers on child nodes, we must call .detach() on them before overwriting with .html()
    // see http://api.jquery.com/detach/
    this.$el.children().detach();
    var date = this.collection.at(0).get('date');
    return this.$el.html('<form class="searchform"><input class="textbox" type="text" placeholder="Search for Events">').append(new DateEventView({model:this.collection.at(0)}).render()).append(
      this.collection.map(function(Evnt){
        if(Evnt.get('date') !== date) {
          date = Evnt.get('date');
          return (new DateEventView({model:Evnt}).render()).append(new EventView({model: Evnt}).render());
        } else {
          return new EventView({model: Evnt}).render();
        }
      }));
  }
});