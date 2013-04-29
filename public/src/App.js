var App = Backbone.Model.extend({

	getEventsByDate : function(start, end) {
		this.get('events').query = 'firstDate=' + start + '&lastDate=' + end;
		this.get('events').url();
		var that = this;
		this.get('events').fetch().complete(
			function(){
				that.get('events')
			});
	},

	getEventsBySearch : function(keywords) {
		this.get('events').query = 'search=' + keywords.replace(' ', '+');
		this.get('events').url();
		var that = this;
		this.get('events').fetch().complete(
			function(){
				that.get('events')
			});
	}


});