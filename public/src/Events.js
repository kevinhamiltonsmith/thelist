var Events = Backbone.Collection.extend({

  model: Event,
  url: 'http://selby-list.herokuapp.com/thelist',

});