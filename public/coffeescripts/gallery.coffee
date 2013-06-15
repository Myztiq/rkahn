Kinvey.init
  appKey: 'kid_VTXpJ7436M'
  appSecret: 'a59de242ec4140bcb878d6ef8992af15'

getGalleries = (cb)->
  Kinvey.execute 'getGalleries', {
    userId: '93987335@N08'
  }, {
    success: (items)->
      cb null, items
    error: cb
  }

getPhotos = (galleryId, cb)->
  Kinvey.execute 'getPhotos', {
    photosetId: galleryId
  }, {
    success: (items)->
      cb null, items
    error: cb
  }

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
              <div class="fullContainer">
                <img src='#{photo.full}' class='full'>
              </div>
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

  $galleryContainer = $('#gallery-container')
  $galleryContainer.on 'click', '.photo', (e)->
    $current = $(e.currentTarget)
    $galleryContainer.removeClass('no-animate')
    $current.toggleClass('active')

  locked = false
  $('body').keyup (e)->
    locked = false

  $('body').keydown (e)->
    keyCode = e.keyCode or e.which;
    arrow = {left: 37, up: 38, right: 39, down: 40 };
    $current = $('.photo.active');

    if keyCode == 27 #Escape
      $galleryContainer.removeClass('no-animate')
      $current.removeClass('active');

    if locked or $current.length == 0
      return

    if keyCode == arrow.right
      $galleryContainer.addClass('no-animate')
      locked = true
      $current.removeClass('active');
      if $current.next().length
        $current.next().addClass('active');
      else
        $current.parent().find(":first-child").addClass('active')

      e.preventDefault()

    if keyCode == arrow.left
      $galleryContainer.addClass('no-animate')
      locked = true
      $current.removeClass('active');

      if $current.prev().length
        $current.prev().addClass('active');
      else
        $current.parent().find(":last-child").addClass('active')

      e.preventDefault()