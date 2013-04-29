var MapEventView = Backbone.View.extend({

  events: {
      'click .simple': function() {
        this.fullRender();
      },
      'click .full': function() {
        this.render();
      }
    },

  render: function(){
      var query = this.model.get('venue') + '+' + this.model.get('address');
      $.get('https://maps.googleapis.com/maps/api/place/textsearch/json?sensor=false&key=AIzaSyA_Z6KzN-Ljo606tHbezndwSNGVRU5l0Bc&query=' + this.query, function(res){
        console.log(res.data.toString());
      });
      return this.$el.html();
    },

});