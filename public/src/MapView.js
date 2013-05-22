var MapView = Backbone.View.extend({

  initialize: function(params){
    thisMap = L.map('map', {
                center: [37.783548, -122.408953],
                zoom: 13
              });
    L.tileLayer('http://b.tile.cloudmade.com/89c89b090746449a9acbd91872dd7351/1930/256/{z}/{x}/{y}.png', {
      maxZoom: 18
      }).addTo(thisMap);
  },

  events: {
    'submit .searchbox': function(e) {
      e.preventDefault();
      this.collection.filterSearch($('.textbox').val());
    },
    'keyup .searchbox': function(e) {
      e.preventDefault();
      console.log('yo')
      if(window.prevTimeout) {
        window.clearTimeout(window.prevTimeout);
      }
      var that = this;
      window.prevTimeout = setTimeout(function(){
        that.collection.filterSearch($('.textbox')[0].value);
      }, 600);
    }
  },

  render: function(){
    var that = this;
    $('.searchbox').html('<form class="searchbox-form"><input class="textbox" type="text" placeholder="eg: 944 Market St, SF"></form>');
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
          });
        }
      }
    );

    $('.textbox').on('keyup', function(e){
      e.preventDefault();
      if(window.prevTimeout) {
        window.clearTimeout(window.prevTimeout);
      }
      window.prevTimeout = setTimeout(function(){
        // that.model.get('events').filterSearch($('.textbox').val());
        $.ajax({
          url: 'http://nominatim.openstreetmap.org/search',
          data: { q : $('.textbox').val(), format: 'json'}
        }).done(function(data){
          if(data[0]) {
            thisMap.panTo(new L.LatLng(data[0].lat, data[0].lon));
          }
        });
      }, 600);
    });
    $('.searchbox-form').on('submit', function(e){
      e.preventDefault();
      $.ajax({
        url: 'http://nominatim.openstreetmap.org/search',
        data: { q : $('.textbox').val(), format: 'json'}
      }).done(function(data){
        if(data[0]) {
          thisMap.panTo(new L.LatLng(data[0].lat, data[0].lon));
        } else {
          $('.textbox')[0].placeholder = "Please enter another address";
          $('.textbox')[0].value = "";
        }
      });
    });
  }
});