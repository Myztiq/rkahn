Kinvey.init
  appKey: 'kid_VTXpJ7436M'
  appSecret: 'a59de242ec4140bcb878d6ef8992af15'

getGalleries = (cb)->
  store = new Kinvey.Store.Rpc()
  url = store._getUrl ['custom', 'getGalleries']
  url += "&userId=93987335@N08"
  store._send('post',url,null,{
    success: (items)->
      cb null, items
    error: cb
  })

getPhotos = (galleryId, cb)->
  store = new Kinvey.Store.Rpc()
  url = store._getUrl ['custom', 'getPhotos']
  url += "&photosetId=#{galleryId}"
  store._send('post',url,null,{
    success: (items)->
      cb null, items
    error: cb
  })

$ ->

  $container = $('#gallery-container')
  $('#gallery-container').on 'click', '.gallery', (e)->
    $container.addClass('fadeOut');
    id = $(e.currentTarget).data('id')
    window.location.hash = id

  fillGalleries = ()->
    getGalleries (err, galleries)->
      if err
        console.log err
      else
        $container.empty()
        for gallery in galleries
          $container.append($("<div data-id='#{gallery.id}' class='gallery'><img src='#{gallery.cover}'><span class='caption'>#{gallery.title}</span></div>"))

  fillPhotos = (id)->
    getPhotos id, (e, photos)->
      if e
        console.log e
      else
        $('#gallery-container').empty()
        for photo in photos
          $container.append $ """
            <div class='photo'>
              <img src='#{photo.full}' class='full'>
              <img src='#{photo.small}' class='small'>
            </span>
            </div>
          """
        $container.removeClass('fadeOut');

  calculateDisplay = ->
    if window.location.hash?.length
      fillPhotos(window.location.hash.replace('#',''))
    else
      fillGalleries()
  $(window).on 'hashchange', ->
    calculateDisplay()
  calculateDisplay()


  $('#gallery-container').on 'click', '.photo', (e)->
    $current = $(e.currentTarget)
    $current.toggleClass('active')