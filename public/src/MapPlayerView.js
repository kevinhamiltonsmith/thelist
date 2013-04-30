var MapPlayerView = Backbone.View.extend({

  render: function(){
    var that = this;
    var trackURL;

    $.ajax({
      url: 'http://ws.spotify.com/search/1/track.json',
      data: { q : that.model.attributes.artists[0].split(/(\(|!)/)[0].trim()},
    }).done(function(data){
      var artist = that.model.attributes.artists[0].split(/(\(|!)/)[0].trim();
      for(var i = 0; i < data.tracks.length; i++) {
        if(data.tracks && data.tracks.length > 0 && data.tracks[i].artists[0].name.toLowerCase().indexOf(artist.toLowerCase()) !== -1) {

        trackURL = data.tracks[i].href;
        return $('.' + that.model.cid + '-player').html('<iframe class="player" src="https://embed.spotify.com/?uri=' + trackURL + '" width="400" height="300" frameborder="0" allowtransparency="true"></iframe>');
      }
      }  
    });
  }

});
