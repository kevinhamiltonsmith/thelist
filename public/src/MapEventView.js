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
      $.get('https://selby-list.herokuapp.com/api/places?location=' + this.query, function(res){
        console.log()
        console.log(res);
      });
      return this.$el.html();
    },

});