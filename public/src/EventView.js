var EventView = Backbone.View.extend({

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
  		artists += ('<a href="#"" class="btn btn-mini btn-block span2">' + this.model.attributes.artists[artist] + '</a>');
  	}
  	return artists + '</td>';
  }


});