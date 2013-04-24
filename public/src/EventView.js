var EventView = Backbone.View.extend({

  tagName: 'tr',

  template: _.template('<td class="date"><%= date %></td><td class="venue"><%= venue %></td><td class="address"><%= address %></td><td class="artists"><%= artists %></td>'),


  render: function(){
  	console.log(this.model)
    return this.$el.html(this.template(this.model.attributes));
  }

});