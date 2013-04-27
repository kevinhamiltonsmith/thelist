var App = Backbone.Model.extend({

	getEventsByDate : function(start, end) {
		console.log(this.get('events'))
		this.get('events').query = 'firstDate=' + start + '&lastDate=' + end;
		this.get('events').url();
		var that = this;
		this.get('events').fetch().complete(
			function(){
				that.get('events')
			});
		
	}


});