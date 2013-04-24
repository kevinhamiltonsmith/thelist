var Events = Backbone.Collection.extend({

  initialize: function(models, options) {
    this.query = options.query;
  },
  model: Event,
  url: function() {
  	return 'http://selby-list.herokuapp.com/api/events/' + this.query;
  }

});