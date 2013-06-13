function onRequest(request, response, modules){
  modules.request.get({
    uri:"http://api.flickr.com/services/rest/",
    qs:{
      method: "flickr.photosets.getList",
      api_key: "2c90800ca64f8b4e3740b31facc60374",
      user_id: request.params.userId,
      format: 'json',
      nojsoncallback: 1
    }
  }, function(err, req, body){
    if(err){
      response.body = err;
      response.complete(500);
    }else{
      body =  JSON.parse(body);
      rtn = [];
      for(var i=0; i< body.photosets.photoset.length; i++){
        var photoset = body.photosets.photoset[i];
        rtn.push({
          id: photoset.id,
          title: photoset.title._content,
          description: photoset.description._content,
          cover: "http://farm"+photoset.farm+".staticflickr.com/"+photoset.server+"/"+photoset.primary+"_"+photoset.secret+"_m.jpg"
        })
      }
      response.body = rtn;
      response.complete();
    }
  })
}