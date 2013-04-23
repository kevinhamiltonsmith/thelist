var AppView = Backbone.View.extend({

  initialize: function(params){
    this.EventsView = new EventsView({model: this.model.get('events')});
  },

  render: function(){
      $('.events').html(new EventsView({collection: this.model.get('events')}).render());
  }
});