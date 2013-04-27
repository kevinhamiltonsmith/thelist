var PlayerView = Backbone.View.extend({

  render: function(){
    var that = this;

    $.ajax({
      url: 'http://ws.spotify.com/search/1/artist.json',
      data: { q : that.options.artists[0]},
    }).done(function(data){
      console.log(data);
    });

    return this.$el.html('<iframe class="player" src="https://embed.spotify.com/?uri=spotify:track:5JunxkcjfCYcY7xJ29tLai" frameborder="0" allowtransparency="false"></iframe>');
  }

});
