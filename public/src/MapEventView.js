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
      this.query = encodeURIComponent(this.model.get('venue'));
      console.log(this.query)
      $.get('https://selby-list.herokuapp.com/api/places?location=' + this.query, function(res){
        this.result = JSON.parse(res);
        console.log(this.result)
      });
      return this.$el.html();
    },

});