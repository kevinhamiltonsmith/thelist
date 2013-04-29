var AppView = Backbone.View.extend({

  initialize: function(params){
    this.EventsView = new EventsView({model: this.model.get('events')});
    this.model.on('remove add', function(model){ this.EventsView.render(); }, this);
  },

  render: function(){
    var that = this;
    $('.events').html(new EventsView({collection: this.model.get('events')}).render());

		$('#reportrange').daterangepicker({
	        ranges: {
	            'Today': ['today', 'today'],
	            'Tomorrow': ['tomorrow', 'tomorrow'],
	            'Next 7 Days': ['today', Date.today().add({ days: 6 })],
	            'Next 30 Days': ['today', Date.today().add({ days: 29 })],
	            'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
	            'Next Month': [Date.today().moveToFirstDayOfMonth().add({ months: 1 }), Date.today().moveToLastDayOfMonth().add({ months: 1 })]
	        }
	    },
	    function(start, end) {
        $('#reportrange span').html(' ' + start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
        that.model.getEventsByDate(start.toISOString(), end.toISOString());
	    }
		);
  }
});