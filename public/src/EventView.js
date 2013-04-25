var EventView = Backbone.View.extend({

  tagName: 'tr',
  template: _.template('<td class="venue"><%= venue %></td><td class="artists"><%= artists %></td>'),


  render: function(){
    return this.$el.html('<td class="date span2">'+ this.displayDate() + '</td>' + this.template(this.model.attributes));
  },

  displayDate: function(){
  	var dates = '';
  	var tempDate;
  	for(date in this.model.attributes.date){
  		tempDate = (new Date(this.model.attributes.date[date])).toString().split(/(\d){4}/)[0];
  		dates +='<a href="#"" class="btn btn-small btn-block">' + tempDate + '</a>';
  	}
  	return dates;
  }

});