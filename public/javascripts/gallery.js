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
    var $container, $galleryContainer, calculateDisplay, fillGalleries, fillPhotos, locked;
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
            $container.append($("<div class='photo'>\n  <div class=\"fullContainer\">\n    <img src='" + photo.full + "' class='full'>\n  </div>\n  <img src='" + photo.small + "' class='small'>\n</span>\n</div>"));
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
    $galleryContainer = $('#gallery-container');
    $galleryContainer.on('click', '.photo', function(e) {
      var $current;
      $current = $(e.currentTarget);
      $galleryContainer.removeClass('no-animate');
      return $current.toggleClass('active');
    });
    locked = false;
    $('body').keyup(function(e) {
      return locked = false;
    });
    return $('body').keydown(function(e) {
      var $current, arrow, keyCode;
      keyCode = e.keyCode || e.which;
      arrow = {
        left: 37,
        up: 38,
        right: 39,
        down: 40
      };
      $current = $('.photo.active');
      if (keyCode === 27) {
        $galleryContainer.removeClass('no-animate');
        $current.removeClass('active');
      }
      if (locked || $current.length === 0) return;
      if (keyCode === arrow.right) {
        $galleryContainer.addClass('no-animate');
        locked = true;
        $current.removeClass('active');
        if ($current.next().length) {
          $current.next().addClass('active');
        } else {
          $current.parent().find(":first-child").addClass('active');
        }
        e.preventDefault();
      }
      if (keyCode === arrow.left) {
        $galleryContainer.addClass('no-animate');
        locked = true;
        $current.removeClass('active');
        if ($current.prev().length) {
          $current.prev().addClass('active');
        } else {
          $current.parent().find(":last-child").addClass('active');
        }
        return e.preventDefault();
      }
    });
  });

}).call(this);
