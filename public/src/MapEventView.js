var MapEventView = Backbone.View.extend({

  render: function(){
      var query = encodeURIComponent(this.model.get('venue'));
      var that = this;

      $.get('https://selby-list.herokuapp.com/api/places?location=' + query, function(res){
        this.information = res;
        if(res[0]) {
          that.model.marker = L.marker([res[0].latitude, res[0].longitude]).addTo(thisMap);
          that.model.marker.bindPopup(that.eventRender());
        }
        
      });
    },

  eventRender: function(){
    var html = '<div href="#' + this.model.get('cid') + '"" class="map-evnt full"><ul>';
    html += '<h4 href="#" class venue>' + this.model.get('venue') + '</h4>';
    html += '<span class="fui-volume-24"></span> ' + this.model.get('artists') + '<br/>';
    html += '<span class="fui-location-24"></span> ' + this.model.get('address') + '<br/>';
    if(this.model.get('ages')) {
      html += '<span class="fui-man-24"></span> ' + this.model.get('ages') + '<br/>';
    }
    if(this.model.get('priceAndTime') && this.model.get('priceAndTime').length > 0) {
      html += '<span class="fui-time-24"></span> ' + (new Date(this.model.get('date')).toString().split(/(\d){4}/)[0]) + this.model.get('priceAndTime') + '<br/>';
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
    if(this.model.get('specialInfo')) html += this.model.get('specialInfo') + '<br/>';
    html += '<div class=' + this.model.cid + '-player></div>'
    new MapPlayerView({model:this.model}).render();

    return(html + '</ul></div>')
  }

});