(function() {
  var getGalleries, getPhotos;

  Kinvey.init({
    appKey: 'kid_VTXpJ7436M',
    appSecret: 'a59de242ec4140bcb878d6ef8992af15'
  });

  getGalleries = function(cb) {
    var store, url;
    store = new Kinvey.Store.Rpc();
    url = store._getUrl(['custom', 'getGalleries']);
    url += "&userId=93987335@N08";
    return store._send('post', url, null, {
      success: function(items) {
        return cb(null, items);
      },
      error: cb
    });
  };

  getPhotos = function(galleryId, cb) {
    var store, url;
    store = new Kinvey.Store.Rpc();
    url = store._getUrl(['custom', 'getPhotos']);
    url += "&photosetId=" + galleryId;
    return store._send('post', url, null, {
      success: function(items) {
        return cb(null, items);
      },
      error: cb
    });
  };

  $(function() {
    var $container, calculateDisplay, fillGalleries, fillPhotos;
    $container = $('#gallery-container');
    $('#gallery-container').on('click', '.gallery', function(e) {
      var id;
      $container.addClass('fadeOut');
      id = $(e.currentTarget).data('id');
      return window.location.hash = id;
    });
    fillGalleries = function() {
      return getGalleries(function(err, galleries) {
        var gallery, _i, _len, _results;
        if (err) {
          return console.log(err);
        } else {
          $container.empty();
          _results = [];
          for (_i = 0, _len = galleries.length; _i < _len; _i++) {
            gallery = galleries[_i];
            _results.push($container.append($("<div data-id='" + gallery.id + "' class='gallery'><img src='" + gallery.cover + "'><span class='caption'>" + gallery.title + "</span></div>")));
          }
          return _results;
        }
      });
    };
    fillPhotos = function(id) {
      return getPhotos(id, function(e, photos) {
        var photo, _i, _len;
        if (e) {
          return console.log(e);
        } else {
          $('#gallery-container').empty();
          for (_i = 0, _len = photos.length; _i < _len; _i++) {
            photo = photos[_i];
            $container.append($("<div data-large='" + photo.full + "' data-small='" + photo.small + "' class='photo'><img src='" + photo.small + "'><span class='caption'>" + photo.title + "</span></div>"));
          }
          return $container.removeClass('fadeOut');
        }
      });
    };
    calculateDisplay = function() {
      var _ref;
      if ((_ref = window.location.hash) != null ? _ref.length : void 0) {
        return fillPhotos(window.location.hash.replace('#', ''));
      } else {
        return fillGalleries();
      }
    };
    $(window).on('hashchange', function() {
      return calculateDisplay();
    });
    calculateDisplay();
    return $('#gallery-container').on('click', '.photo', function(e) {
      var $current;
      $current = $(e.currentTarget);
      $current.toggleClass('active');
      if ($current.is('.active')) {
        $current.find('img').attr('src', $current.data('large'));
      } else {
        $current.find('img').attr('src', $current.data('small'));
      }
      return $('html, body').stop(true, true).animate({
        scrollTop: $current.offset().top - 100
      }, 700);
    });
  });

}).call(this);
