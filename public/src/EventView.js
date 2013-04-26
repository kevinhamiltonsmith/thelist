var GridEventView = Backbone.View.extend({

  tagName: 'tr',


  render: function(){
    return this.$el.html(this.displayDate() + this.displayVenue() + this.displayArtists());
  },

  displayDate: function(){
  	return ('<td class="date span2"><a href="#"" class="btn btn-small btn-block">' + (new Date(this.model.attributes.date)).toString().split(/(\d){4}/)[0] + '</a></td>');
  },

  displayVenue: function(){
  	return ('<td class="venue span2"><a href="#"" class="btn btn-small btn-block">' + this.model.attributes.venue + '</a></td>');
  },

  displayArtists: function(){
  	var artists = '<td class="artists ">';
  	for (artist in this.model.attributes.artists) {
  		artists += ('<a href="#"" class="btn btn-large btn-block span2">' + this.model.attributes.artists[artist] + '</a>');
  	}
  	return artists + '</td>';
  }


});

var ArtistEventView = Backbone.View.extend({

	events: {
	    'click .simple': function() {
	      this.fullRender();
	  	},
	  	'click .full': function() {
	      this.fullRender();
	  	}
    },

	fullRender: function(){
		console.log(this)
		var html = '<div href="#' + this.model.get('cid') + '"" class="well evnt full"><ul>';
		html += '<h4 href="#" class venue>' + this.model.get('venue') + '</h4>';
    	html += '<span class="fui-volume-24"></span> ' + this.model.get('artists') + '<br/>';
    	html += '<span class="fui-location-24"></span> ' + this.model.get('address') + '<br/>';
    	if(this.model.get('ages')) {
    		html += '<span class="fui-man-24"></span> ' + this.model.get('ages') + '<br/>';
    	}
    	if(this.model.get('priceAndTime') && this.model.get('priceAndTime').length > 0) {
    		html += '<span class="fui-time-24"></span> ' + this.model.get('priceAndTime') + '<br/>';
    	}
    	if(this.model.get('recommended')){
    		for(var i = 0; i < this.model.get('recommended'); i++) {
    			html += '<span class="fui-heart-16"></span> '
    		}
    	}
    	if(this.model.get('willSellout')) html += 'Sellout Risk ';
    	if(this.model.get('underagePayMore')) html += 'Underage Pay More ';
    	if(this.model.get('pitWarning')) html += 'Pit Warning ';
    	if(this.model.get('noInsOuts')) html += 'No Ins and Outs ';
    	if(this.model.get('specialInfo')) html += this.model.get('specialInfo');
    	
    	return this.$el.html(html += '</ul></div>');
  	},

  	render: function(){
		var html = '<div href="#' + this.model.get('cid') + '"" class="well evnt simple"><ul>';
		html += '<h4 href="#" class venue>' + this.model.get('venue') + '</h4>';

    	return this.$el.html(html += '</ul></div>');
  	},

});

var DateEventView = Backbone.View.extend({

	render: function(){
    	return this.$el.html('</span><h2 href="#"" class="date span12"><span class="fui-calendar-24"></span> ' + (new Date(this.model.get('date')).toString().split(/(\d){4}/)[0]) + '</h2>');
  	},

});