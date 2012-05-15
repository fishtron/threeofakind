// instagram module for octopress
// based heavily on jquery.instagram by potomak
// (c) Lois Chan-Pedley 2012

function createPhotoElement(photo) {
  return $('<div>')
    .addClass('instagram-placeholder')
    .attr('id', photo.id)
    .append(
      $('<a>')
        .attr('target', '_blank')
        .attr('href', photo.link)
        .append(
          $('<img>')
            .addClass('instagram-image')
            .attr('src', photo.images.thumbnail.url)
        )
    );
}

function createEmptyElement() {
  return $('<div>')
    .addClass('instagram-placeholder')
    .attr('id', 'empty')
    .append($('<p>').html('No photos for this query'));
}

function composeRequestURL(settings) {

  var url = "https://api.instagram.com/v1";
  
  if (settings.next_url != null) {
    return settings.next_url;
  }

  if(settings.hash != null) {
    url += "/tags/" + settings.hash + "/media/recent";
  }
  else if(settings.search != null) {
    url += "/media/search";
  }
  else if(settings.userId != null) {
    url += "/users/" + settings.userId + "/media/recent";
  }
  else if(settings.locationId != null) {
    url += "/locations/" + settings.locationId + "/media/recent";
  }
  else {
    url += "/media/popular";
  }
  
  return url;
}

function constructParams(settings) {
  var params = {};

  if(settings.search != null) {
    params.lat = settings.search.lat;
    params.lng = settings.search.lng;
    settings.search.max_timestamp != null && (params.max_timestamp = settings.search.max_timestamp);
    settings.search.min_timestamp != null && (params.min_timestamp = settings.search.min_timestamp);
    settings.search.distance != null && (params.distance = settings.search.distance);
  }

  settings.accessToken != null && (params.access_token = settings.accessToken);
  settings.clientId != null && (params.client_id = settings.clientId);
  settings.minId != null && (params.min_id = settings.minId);
  settings.maxId != null && (params.max_id = settings.maxId);

  return params;
}

function getAccessToken(settings) {

}

function getInstagrams(options) {

  var that = $('.instagram'),
      settings = {
          hash: null
        , userId: null
        , locationId: null
        , search: null
        , accessToken: null
        , clientId: null
        , show: null
        , onLoad: null
        , onComplete: null
        , maxId: null
        , minId: null
        , next_url: null
      };
      
  options && $.extend(settings, options);
  
  settings.onLoad != null && typeof settings.onLoad == 'function' && settings.onLoad();

  if(settings.accessToken == null) {
    getAccessToken(settings);
  }
  
  $.ajax({
    type: "jsonp",
    cache: false,
    url: composeRequestURL(settings),
    data: constructParams(settings),
    success: function(res) {
      var length = typeof res.data != 'undefined' ? res.data.length : 0;
      var limit = settings.show != null && settings.show < length ? settings.show : length;
      
      if(limit > 0) {
        for(var i = 0; i < limit; i++) {
          that.append(createPhotoElement(res.data[i]));
        }
      }
      else {
        that.append(createEmptyElement());
      }

      settings.onComplete != null && typeof settings.onComplete == 'function' && settings.onComplete(res.data, res);
    }
  });

}