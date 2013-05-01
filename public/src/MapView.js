var MapView = Backbone.View.extend({

  
  initialize: function(params){
    thisMap = L.map('map', {
                center: [37.783548, -122.408953],
                zoom: 13
              });
    L.tileLayer('http://b.tile.cloudmade.com/89c89b090746449a9acbd91872dd7351/1930/256/{z}/{x}/{y}.png', {
      maxZoom: 18
      }).addTo(thisMap);

    this.model.on('remove add', function(model){ console.log('yo'); L.redraw(); }, this);
  },

  render: function(){
    var that = this;
    $('.map').html(new GoogleMapView({collection: this.model.get('events')}).render());

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
        if(that.model.get('events').models) {
          that.model.get('events').models.forEach(function(evnt){
            if(evnt.marker) thisMap.removeLayer(evnt.marker);
          })
        }
      }
    );
  }
});