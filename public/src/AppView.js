var AppView = Backbone.View.extend({

  initialize: function(params){
    this.EventsView = new EventsView({model: this.model.get('events')});
    this.model.on('remove add', function(model){ this.EventsView.render(); }, this);
  },

  render: function(){
      $('.events').html(new EventsView({collection: this.model.get('events')}).render());
  }
});