var EventView = Backbone.View.extend({

  tagName: 'tr',
  template: _.template('<td class="venue"><%= venue %></td><td class="artists"><%= artists %></td>'),


  render: function(){
    return this.$el.html(this.displayDate() + this.template(this.model.attributes));
  },

  displayDate: function(){
  	return ('<td class="date span2"><a href="#"" class="btn btn-small btn-block">' + (new Date(this.model.attributes.date)).toString().split(/(\d){4}/)[0] + '</a></td>');
  }

});