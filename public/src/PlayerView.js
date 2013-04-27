var PlayerView = Backbone.View.extend({

  render: function(){
    var that = this;
    var trackURL;

    $.ajax({
      url: 'http://ws.spotify.com/search/1/track.json',
      data: { q : that.options.artists[0]},
    }).done(function(data){
      var artist = that.options.artists[0].split(/ (\(|!)/)[0];
      for(var i = 0; i < data.tracks.length; i++) {
              console.log(that.options.artists[0])
        console.log(data.tracks[i].artists[0].name)
        if(data.tracks && data.tracks.length > 0 && data.tracks[i].artists[0].name.toLowerCase().indexOf(artist.toLowerCase()) !== -1) {

        trackURL = data.tracks[i].href;
        return $('.player').html('<iframe class="player" src="https://embed.spotify.com/?uri=' + trackURL + '" width="300" height="90" frameborder="0" allowtransparency="true"></iframe>');
      }
      }  
    });
    return this.$el.html('');
  }

});
