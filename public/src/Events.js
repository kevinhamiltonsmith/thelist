var Events = Backbone.Collection.extend({

  model: Event,
  url: function() {
  	return 'http://selby-list.herokuapp.com/api/events/' + this.query,

});