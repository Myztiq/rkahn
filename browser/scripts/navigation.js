$(document).ready(function() {
	$('.navigation').each(function(index, item) {
		var height = $(item).height();
		$(item).animate({
			top:(65 + Math.random() * 15 - height)
		}, 1000);
	});
	

	$('.navigation').hoverIntent({
		over: function(event) {
			$(event.currentTarget).stop().animate({
				top:-20
			}, 1000);
		},
		timeout: 500,
		out: function(event) {
			var height = $(event.currentTarget).height();
			$(event.currentTarget).stop().animate({
				top: '+=' + 20
			}, 300, function() {
				$(event.currentTarget).animate({
					top:(20 - height)
				}, 300, function() {
					fakeFlip(event.currentTarget, function(ele) {
						$(ele).animate({
							top:(65 + Math.random() * 20 - height)
						});
					});
				});
			});
		}
	});

	function fakeFlip(ele, callback, direction, counter) {
		if (!direction) {
			direction = -1;
		}
		if (!counter) {
			counter = 0;
		}
		counter++;
		$(ele).animate({
			rotateX: '+=' + Math.PI * .5 * direction
		}, 100, function() {
			if (counter < 10) {
				fakeFlip(ele, callback, direction * -1, counter);
			} else {
				callback(ele);
			}
		});
	}
});