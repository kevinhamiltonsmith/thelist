var SelectedEventView = Backbone.View.extend({
	render: function(){
		var html = '<div href="#' + this.model.get('cid') + '"" class="well evnt"><ul>';
		html += '<h4 href="#" class venue>' + this.model.get('venue') + '</h4>';
    	html += '<span class="fui-man-24"></span> ' + this.model.get('artists') + '<br/>';

    	return this.$el.html(html += '</ul></div>');
  	},
});