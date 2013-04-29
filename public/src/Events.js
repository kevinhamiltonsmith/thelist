var Events = Backbone.Collection.extend({

  model: Event,

  initialize: function(models, options) {
    this.query = options.query;
  },

  url: function() {
  	return 'http://selby-list.herokuapp.com/api/events?' + this.query;
  },

  comparator: function(evnt) {
  	return evnt.get("date");
  },

  filterSearch: function(keywords) {
    this.query = 'search=' + keywords.replace(' ', '+');
    this.url();
    this.fetch();
    console.log(this.url())
  }

});