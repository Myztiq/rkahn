function onRequest(request, response, modules){
  modules.request.get({
    uri:"http://api.flickr.com/services/rest/",
    qs:{
      method: "flickr.photosets.getPhotos",
      api_key: "2c90800ca64f8b4e3740b31facc60374",
      photoset_id: request.params.photosetId,
      format: 'json',
      nojsoncallback: 1,
      extras: "url_o,url_m,url_s,url_l"
    }
  }, function(err, req, body){
    if(err){
      response.body = err;
      response.complete(500);
    }else{
      body =  JSON.parse(body);
      rtn = [];
      for(var i=0; i< body.photoset.photo.length; i++){
        var photo = body.photoset.photo[i];
        rtn.push({
          title: photo.title,
          small: photo.url_s,
          medium: photo.url_m,
          large: photo.url_l,
          full: photo.url_o
        })
      }
      response.body = rtn;
      response.complete();
    }
  })
}