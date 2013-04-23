var Events = Backbone.Collection.extend({

  model: Event,
  url: 'http://www.selby-list.herokuapp.com/thelist',

});