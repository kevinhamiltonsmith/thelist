var EventView = Backbone.View.extend({

  tagName: 'tr',

  template: _.template('<td class="venue"><%= venue %></td><td class="artists"><%= date %></td><td class="date"><%= date %></td>'),


  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }

});