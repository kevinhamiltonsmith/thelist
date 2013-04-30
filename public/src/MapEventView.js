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
      this.query = this.model.get('venue') + '+' + this.model.get('address');
      $.get('https://selby-list.herokuapp.com/api/places?location=' + this.query, function(res){
        this.result = JSON.parse(res);
        console.log(this.result)
      });
      return this.$el.html();
    },

});