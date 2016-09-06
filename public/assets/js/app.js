// google.maps.event.addDomListener(window, 'load', init);
"use strict";

var googleMap = (function() {

	var map;

	function init() {
		var mapOptions = {
			center: new google.maps.LatLng(59.299376, 26.530723),
			zoom: 4,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.DEFAULT,
			},
			disableDoubleClickZoom: true,
			mapTypeControl: false,
			scaleControl: false,
			scrollwheel: false,
			panControl: false,
			streetViewControl: false,
			draggable: false,
			overviewMapControl: false,
			overviewMapControlOptions: {
				opened: false,
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: [{
				"featureType": "administrative",
				"elementType": "all",
				"stylers": [{
					"visibility": "simplified"
				}]
			}, {
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#fcfcfc"
				}]
			}, {
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#fcfcfc"
				}]
			}, {
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#dddddd"
				}]
			}, {
				"featureType": "road.arterial",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#dddddd"
				}]
			}, {
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#eeeeee"
				}]
			}, {
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#00bfa5"
				}]
			}]
		};
		var mapElement = document.getElementById('map');
		var map = new google.maps.Map(mapElement, mapOptions);
		var locations = [
			['Oleg Korolko', 'undefined', 'undefined', '', 'undefined', 59.9342802, 30.335098600000038, 'https://mapbuildr.com/assets/img/markers/ellipse-red.png']
		];
		for (var i = 0; i < locations.length; i++) {
			if (locations[i][1] == 'undefined') {
				var description = '';
			} else {
				var description = locations[i][1];
			}
			if (locations[i][2] == 'undefined') {
				var telephone = '';
			} else {
				var telephone = locations[i][2];
			}
			if (locations[i][3] == 'undefined') {
				var email = '';
			} else {
				var email = locations[i][3];
			}
			if (locations[i][4] == 'undefined') {
				var web = '';
			} else {
				var web = locations[i][4];
			}
			if (locations[i][7] == 'undefined') {
				var markericon = '';
			} else {
				markericon = locations[i][7];
			}
			var marker = new google.maps.Marker({
				icon: markericon,
				position: new google.maps.LatLng(locations[i][5], locations[i][6]),
				map: map,
				title: locations[i][0],
				desc: description,
				tel: telephone,
				email: email,
				web: web
			});
			var link = '';
			bindInfoWindow(marker, map, locations[i][0], description, telephone, email, web, link);
		}

		function bindInfoWindow(marker, map, title, desc, telephone, email, web, link) {
			var infoWindowVisible = (function() {
				var currentlyVisible = false;
				return function(visible) {
					if (visible !== undefined) {
						currentlyVisible = visible;
					}
					return currentlyVisible;
				};
			}());
			var iw = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'click', function() {
				if (infoWindowVisible()) {
					iw.close();
					infoWindowVisible(false);
				} else {
					var html = "<div style='color:#000;background-color:#fff;padding:5px;width:150px;'></div>";
					iw = new google.maps.InfoWindow({
						content: html
					});
					iw.open(map, marker);
					infoWindowVisible(true);
				}
			});
			google.maps.event.addListener(iw, 'closeclick', function() {
				infoWindowVisible(false);
			});
		}
	}


	return {
		init: init
	}

	}());

var blogNav = (function() {

  var sideBar = $('.blog-menu');
  var sideBarElem = $('.blog-menu-elem');
  var section = $('.blog-article');

  function _setUpEventListeners() {
    $(window).scroll(function() {
      _scrolled()
    });

    sideBarElem.on('click', function() {
      var id = $(this).data('id');
      var top = $(section.eq(id)).offset().top;

      $('body').animate({
        scrollTop: top
      }, 300);
    });
  }

  function _scrolled() {
    var scroll = $(window).scrollTop();

    var menuTopPos = $(section.eq(0)).offset().top - scroll;
    if (menuTopPos < 20) {
      sideBar.addClass('fixed');
    } else {
      sideBar.removeClass('fixed');
    }

    section.each(function (index, elem) {
      var elemBottom = $(elem).offset().top + $(elem).height();
      var windowBottom = scroll + $(window).height();
      var elemBottomPos = windowBottom - elemBottom - 100;
      var elemTopPos = $(elem).offset().top - scroll;

      if (elemTopPos < 0 || elemBottomPos > 0) {
        sideBarElem.removeClass('active');
        sideBarElem.eq(index).addClass('active');
      }
    })
  }

  function init() {
    sideBarElem.eq(0).addClass('active');
    _setUpEventListeners();
  }

  return {
    init: init
  }
})();
var preloader = (function() {

	var
		_imgs = [],
		contentReady = $.Deferred();

	function init() {
		_countImages();
		_startPreloader();
	}

	function _countImages() {

		$.each($('*'), function() {
			var $this = $(this),
				background = $this.css('background-image'),
				img = $this.is('img');

			if (background != 'none') {

				var path = background.replace('url("', "").replace('")', "");
				path = path.replace('url(', "").replace(')', "");

				_imgs.push(path);
			}
			if (img) {
				path = '' + $this.attr('src');
				if ((path) && ($this.css('display') !== 'none')) {
					_imgs.push(path);
				}
			}
		});
	}

	function _startPreloader() {
		$('body').addClass('overflow-hidden');

		var loaded = 0;

		for (var i = 0; i < _imgs.length; i++) {
			var image = $('<img>', {
				attr: {
					src: _imgs[i]
				}
			});

			$(image).load(function() {
				loaded++;
				var percentLoaded = _countPercent(loaded, _imgs.length);
				_setPercent(percentLoaded);
			});

		}
	}

	function _countPercent(current, total) {
		return Math.ceil(current / total * 100);
	}

	function _setPercent(percent) {

		$('.preloader_text').text(percent);

		if (percent >= 100) {
			$('.preloader_container').delay(700).fadeOut(500);
			$('body').removeClass('overflow-hidden');
			_finishPreloader();
		}
	}

	function _finishPreloader() {
		contentReady.resolve();
	}

	return {
		init: init,
		contentReady: contentReady
	};

})();

var parallax = (function() {

	function init() {

			var layer = $('.parallax').find('.parallax__layer');

			layer.map(function(key, value) {
				var bottomPosition = ((window.innerHeight / 2) * (key / 100));
				$(value).css({
					'bottom': '-' + bottomPosition + 'px',
					'transform': 'translate3d(0px, 0px, 0)'
				});
			});

		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return
		}
			$(window).on('mousemove', function(e) {
				var mouse_dx = (e.pageX);
				var mouse_dy = (e.pageY);

				var w = (window.innerWidth / 2) - mouse_dx;
				var h = (window.innerHeight / 2) - mouse_dy;

				layer.map(function(key, value) {
					var bottomPosition = ((window.innerHeight / 2) * (key / 100));
					var widthPosition = w * (key / 60);
					var heightPosition = h * (key / 60);
					$(value).css({
						'bottom': '-' + bottomPosition + 'px',
						'transform': 'translate3d(' + widthPosition + 'px, ' + heightPosition + 'px, 0)'
					});
				});
			});
	}

	return {
		init: init
	}

}());

var flipper = (function() {

	function init() {
		setUpEventListeners();
	}

	function setUpEventListeners() {
		var authElem = $('.authorize');
		var flipElem = $('.flip');
		var outsideElem = $('.parallax__layer');
		var back = $('#backToMain');


		outsideElem.click(function(e) {
			if(e.target.id != 'authorize' && e.target.id != 'authorize_div') {
				authElem.fadeIn(300);
				flipElem.removeClass('flipping')
			}
		});

		authElem.click(function(e) {
			e.preventDefault();
			authElem.fadeOut(300);
			flipElem.toggleClass('flipping')
		});

		back.click(function(e) {
			e.preventDefault();
			flipElem.removeClass('flipping');
			authElem.fadeIn(300);
		})
	}

	return {
		init: init
	}
}());

var scroll = (function() {

	function init() {
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return
		}

		var layers = $('.parallax-scroll__layer');
			var main = $('.main');

			$(window).on('scroll', function() {
				var scrollTop = $(window).scrollTop();

				layers.map(function(key, value) {
					var bottomPosition = scrollTop * key / 80;
					var heightPosition = -scrollTop * key / 80;

					$(value).css({
						'top': '-' + bottomPosition + 'px',
						'transform': 'translate3d(0,' + heightPosition + 'px, 0)'
					})
				});

				var topPos = scrollTop / 5;
				var bottomPos = -scrollTop / 5;
				main.css({
					'top': '-' + topPos + 'px',
					'transform': 'translate3d(0,' + bottomPos + 'px, 0)'
				})
			})
	}

	return {
		init: init
	}

}());

var slider = (function() {

	//Arrays of images in each slider part
	var mainImages = $('.slider__main-img_container');
	var prevImages = $('.nextSlideImg');
	var nextImages = $('.prevSlideImg');

	// Control buttons
	var nextSlide = $('.slider__next');
	var prevSlide = $('.slider__prev');

	var currentSlide = 0;
	var anotherState = $.Deferred();

	function _animateSlide(imgArray, counter, positionTop, time, display) {
		imgArray.eq(counter).animate({
			display: display || 'block',
			top: positionTop
		}, time)
	}

	function _inc(counter, imagesArray) {
		counter++;
		return counter > imagesArray.length - 1 ? 0 : counter;
	}

	function _dec(counter, imagesArray) {
		counter--;
		return counter < 0 ? imagesArray.length - 1 : counter;
	}

	function mainSlider(count) {

		anotherState = $.Deferred();

		mainImages.eq(currentSlide).fadeOut(150);
		if(count === 'inc') {
			currentSlide = _inc(currentSlide, mainImages)
		} else if(count === 'dec') {
			currentSlide = _dec(currentSlide, mainImages)
		}

		mainImages.eq(currentSlide).delay(50).fadeIn(150, function() {
			anotherState.resolve();
		});
	}

	function ArrowSlider(images, counter) {
		this.counter = counter;
		this.images = images;
		this.time = 250;
	}

	ArrowSlider.prototype.render = function(direction, count) {

		// direction of current slide move
		if(direction === 'topBottom') {
			_animateSlide(this.images, this.counter, '+100%', this.time);
		}else if(direction === 'bottomTop') {
			_animateSlide(this.images, this.counter, '-100%', this.time);
		}

		if(count === 'inc') {
			this.counter = _inc(this.counter, this.images);
		}else if (count === 'dec')	{
			this.counter = _dec(this.counter, this.images);
		}

		// prev/next slide moved to starting position
		if(direction === 'topBottom') {
			_animateSlide(this.images, this.counter, '-100%', 0, 'none');
		}else if(direction === 'bottomTop') {
			_animateSlide(this.images, this.counter, '+100%', 0, 'none');
		}

		this.images.eq(this.counter).css('display', 'block');

		// prev/next slide becomes visible
		_animateSlide(this.images, this.counter, '0', this.time);
	};

	var prevSlider = new ArrowSlider(nextImages, 1);
	var nextSlider = new ArrowSlider(prevImages, (prevImages.length - 1));


	nextSlide.click(function() {
		$.when(mainSlider('inc'), nextSlider.render('bottomTop', 'inc'), prevSlider.render('topBottom', 'inc')).done(function () {
		});
	});
	prevSlide.click(function() {
		$.when(mainSlider('dec'), nextSlider.render('topBottom', 'dec'), prevSlider.render('bottomTop', 'dec')).done(function () {
		});
	});

	function init() {
		mainImages.fadeOut(0);
		mainImages.eq(0).fadeIn(0);

		prevImages.eq((prevImages.length - 1)).css('top', 0);
		nextImages.eq(1).css('top', 0);
	}

	return {
		init: init
	}
}());
var sliderText = (function() {
	var titlesContainer = $('.works__left_header');
	var titles = $('.works__left_header_inner');
	var titleElem = $('.works__left_header_inner').eq(0);

	var descriptionContainer = $('.works__left_done-with');
	var description = $('.works__left_done-with_inner');
	var descriptionElem = $('.works__left_done-with_inner').eq(0);

	//control buttons
	var nextButton = $('.slider__next');
	var prevButton = $('.slider__prev');

	//arrays with titles and description
	var titlesArray = [];
	var descriptionArray = [];

	// Saves all titles into array
	function _processTitles(titles, array) {
		titles.each(function() {
			var $this = $(this);
			var text = $this.text();
			$this.html('');
			array.push(_spanify(text));
		});

		//removes all elements except one from DOM
		descriptionContainer.empty();
		descriptionContainer.append(descriptionElem);
		titlesContainer.empty();
		titlesContainer.append(titleElem);
	}

	// Saves all descriptions into array
	function _processDescription(titles, array) {
		titles.each(function() {
			var text = $(this).html();
			array.push(text)
		})
	}

	// Function adds span with .word class to each word and span with .letter class
	// to each letter
	function _spanify(text) {
		var array = [];
		var wordsArray = text.split(' ');
		var spannedText = '';

		wordsArray.forEach(function(word) {
			var lettersArray = word.split('');
			var spannedWord = '';

			lettersArray.forEach(function(letter) {
				spannedWord += '<span class="letter">' + letter + '</span>';
			});

			spannedText += '<span class="word">' + spannedWord + '</span>';
		});

		array.push(spannedText);
		return array
	}

	//Shows selected title
	function _renderTitle(num, array, elem) {
		elem.html(array[num]);
		elem.find('.letter').each(function(index) {
			var $this = $(this);

			(function(elem) {
				setTimeout(function() {
					elem.addClass('activeLetter')
				}, 10 * index);
			})($this);

		})
	}

	//Shows selected description
	function _renderDescription(num, array, elem) {
		elem.html(array[num])
	}

	function _setEventListeners() {
		var qty = titles.length;
		var counter = 0;

		nextButton.click(function() {
			counter++;
			counter = counter <= (qty - 1) ? counter : 0;
			_renderTitle(counter, titlesArray, titleElem);
			_renderDescription(counter, descriptionArray, descriptionElem);
		});

		prevButton.click(function() {
			counter--;
			counter = counter < 0 ? (qty - 1) : counter;
			_renderTitle(counter, titlesArray, titleElem);
			_renderDescription(counter, descriptionArray, descriptionElem);
		})
	}

	function init() {
		_processTitles(titles, titlesArray);
		_processDescription(description, descriptionArray);
		_renderTitle(0, titlesArray, titleElem);
		_renderDescription(0, descriptionArray, descriptionElem);
		_setEventListeners();
	}

	return {
		init: init
	}

}());

var tab = (function() {

	var tabs = $('.tabs__list-item');
	var tabsLink = $('.tabs__control-item');

	function _setupEventListeners() {
		tabs.eq(0).addClass('activeTab');
		tabsLink.eq(0).addClass('activeTabLink');

		tabsLink.on('click', function() {
			var active = $(this).data('class');
			tabs.removeClass('activeTab');
			tabsLink.removeClass('activeTabLink');
			tabs.eq(active).addClass('activeTab');
			tabsLink.eq(active).addClass('activeTabLink');
		})
	}

	function init() {
		_setupEventListeners();
	}

	return {
		init: init
	}
}());

var diagram = (function() {

	var elem = $('.skills__elems').eq(0);
	var diagramArray = $('.sector');
	var diagramValues;

	function _setEventListeners() {
		$(window).scroll(function() {
			var topEdge = $(elem).offset().top;
			var scroll = $(window).scrollTop();
			var height = $(window).innerHeight();
			var animationStart = height + scroll - height / 5;
			if (animationStart > topEdge) {
				_animate();
			}
		})
	}

	function _animate() {
		var maxVal = 280;
		diagramArray.each(function() {
			var $this = $(this);
			var dataId = $this.data('diagram');
			var elemValue = diagramValues[dataId];
			var dash = (elemValue / 100) * maxVal;
			$this.css({
				'stroke-dasharray': dash + ' ' + maxVal
			})

		})
	}

	function _getValues() {
		$.get('/getdiagram', function(data) {
			diagramValues = data[0];
		});
	}

	function init() {
		_getValues();
		_setEventListeners();
	}

	return {
		init: init
	}
}());

var scrollArrow = (function() {

	function _setEventListeners() {

		$('.arrow-down-icon').on('click', function(e) {
			e.preventDefault();
			var height = $(window).innerHeight();
			$('body').animate({
				scrollTop: height
			}, 800);
		})
	}

	function init() {
		_setEventListeners();
	}

	return {
		init: init
	}

}());

var validation = (function() {

  var modalContainerRobot = $('#index-modal-container-robots');
  var modalContainerField = $('#index-modal-container-field');
  var allModals = $('.index-modal-container');
  var activeModal = 'index-modal-active';
  var isHuman = $('#isHuman');
  var notRobot = $('#radio1');
  var login = $('#index_login');
  var pass = $('#index_pass');

  function init() {
    _setUpEventListeners();
  }

  function _setUpEventListeners() {

    $('#authorize').click(function(e) {
      e.preventDefault();

      if(!isHuman.prop('checked') || !notRobot.prop('checked')) {
        _showModal(modalContainerRobot);
      } else if (login.val() === '' || pass.val() === '') {
        _showModal(modalContainerField);
      } else {
          var form = $('.auth_form');
          var defObj = _ajaxForm(form, './login');
          if (defObj) {
            defObj.done(function(res) {
              var status = res.status;
              if (status === 'OK'){
                window.location.href = '/admin';
              }
            });
            defObj.fail(function(res){
              console.error(res)
            })
          }
        }
    });

    $('.index-modal-block-button').click(function(e) {
      e.preventDefault();
      _hideModal(allModals);
    })
  }

  function _showModal(element) {
    element.addClass(activeModal);
  }
  function _hideModal(element) {
    element.removeClass(activeModal)
  }
  function _ajaxForm(form, url){
    var data = form.serialize();
    var defObj = $.ajax({
      type : "POST",
      url : url,
      data: data
    });

    return defObj;
  }

  return {
    init: init
  }

}());
var admin = (function() {

  var modal = $('.modal-container');
  var okButton = $('.modalOk');
  var backToMain = $('.admin_header_return');
  var saveDiagram = $('#saveDiagram');

  function _showModal(result) {
    if (result === 'success') {
      modal.eq(0).css('display', 'block');
    } else {
      modal.eq(1).css('display', 'block');
    }
  }

  function _logOut() {
    defObj = $.ajax({
      type: "POST",
      url: './logout'
    }).fail(function () {
      console.log('error');
    }).complete(function () {
      window.location.href = '/';
    })
  }

  function _addNewWork() {
    var formData = new FormData($('#uploadForm')[0]);

    $.ajax({
      type: "POST",
      processData: false,
      contentType: false,
      url: "./upload",
      data:  formData
    })
      .done(function() {
        _showModal('success')
      }).fail(function() {
      _showModal('fail')
    })
  }

  function _postDiagramValues() {
    var elements = $('.tabs__list_block-elem');
    var text = $('.tabs__list-text');
    var value = $('.tabs__list-input');
    var diagramValues = {};

    elements.each(function () {
      var name = $(this).find(text).text().toLowerCase().replace('.', '');
      diagramValues[name] = $(this).find(value).val();
    });

    $.post("/diagram", diagramValues).done(function () {
      _showModal('success')
    }).fail(function () {
      _showModal('fail')
    })
  }

  function _setupEventListeners() {
    okButton.click(function () {
      modal.css('display', 'none')
    });

    backToMain.click(_logOut);
    saveDiagram.click(_postDiagramValues);

    $('#uploadForm').on('submit', function(e) {
      e.preventDefault();
      _addNewWork();
    });

    $('#blogPost').on('submit', function(e) {
      e.preventDefault();
      var data = $(this).serialize();

      $.post("./addblogpost", data).done(function() {
        _showModal('success')
        $('#blogPost')[0].reset();
      }).fail(function() {
        _showModal('fail')
      });
    })
  }

  function init() {
    _setupEventListeners();
  }

  return {
    init: init
  }
}());

function navigation() {
	'use strict';
	$('#nav-icon').click(function() {
		$(this).toggleClass('open');
		$('#overlay').toggleClass('open');
	});
};

$(document).ready(function() {

	var path = window.location.pathname;

	preloader.init();
	navigation();

	if (path === '/' || path === '/index.html') {
		parallax.init();
		flipper.init();
		validation.init();
	} else {
		scroll.init();
	}

	if (path === '/blog.html' || path === '/blog') {
		blogNav.init();
	}

	if (path === '/works.html' || path === '/works') {
		slider.init();
		sliderText.init();
	}

	if (path === '/aboutme.html' || path === '/aboutme') {
		googleMap.init();
		diagram.init();
	}

	if (path === '/admin.html' || path === '/admin') {
		tab.init();
	}

	if (path !== 'admin') {
		scrollArrow.init();
		admin.init();
	}

});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZU1hcC5qcyIsImJsb2dOYXYuanMiLCJwcmVsb2FkZXIuanMiLCJwYXJhbGxheC5qcyIsImZsaXBwZXIuanMiLCJzY3JvbGwuanMiLCJzbGlkZXIuanMiLCJzbGlkZXJUZXh0LmpzIiwidGFiLmpzIiwiZGlhZ3JhbS5qcyIsInNjcm9sbEFycm93LmpzIiwidmFsaWRhdGlvbi5qcyIsImFkbWluLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZERvbUxpc3RlbmVyKHdpbmRvdywgJ2xvYWQnLCBpbml0KTtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgZ29vZ2xlTWFwID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBtYXA7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHR2YXIgbWFwT3B0aW9ucyA9IHtcblx0XHRcdGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg1OS4yOTkzNzYsIDI2LjUzMDcyMyksXG5cdFx0XHR6b29tOiA0LFxuXHRcdFx0em9vbUNvbnRyb2w6IHRydWUsXG5cdFx0XHR6b29tQ29udHJvbE9wdGlvbnM6IHtcblx0XHRcdFx0c3R5bGU6IGdvb2dsZS5tYXBzLlpvb21Db250cm9sU3R5bGUuREVGQVVMVCxcblx0XHRcdH0sXG5cdFx0XHRkaXNhYmxlRG91YmxlQ2xpY2tab29tOiB0cnVlLFxuXHRcdFx0bWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c2NhbGVDb250cm9sOiBmYWxzZSxcblx0XHRcdHNjcm9sbHdoZWVsOiBmYWxzZSxcblx0XHRcdHBhbkNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuXHRcdFx0ZHJhZ2dhYmxlOiBmYWxzZSxcblx0XHRcdG92ZXJ2aWV3TWFwQ29udHJvbDogZmFsc2UsXG5cdFx0XHRvdmVydmlld01hcENvbnRyb2xPcHRpb25zOiB7XG5cdFx0XHRcdG9wZW5lZDogZmFsc2UsXG5cdFx0XHR9LFxuXHRcdFx0bWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcblx0XHRcdHN0eWxlczogW3tcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJsYW5kc2NhcGVcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNmY2ZjZmNcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZmNmY2ZjXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2RkZGRkZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmFydGVyaWFsXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZGRkZGRkXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQubG9jYWxcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNlZWVlZWVcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiMwMGJmYTVcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fV1cblx0XHR9O1xuXHRcdHZhciBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpO1xuXHRcdHZhciBsb2NhdGlvbnMgPSBbXG5cdFx0XHRbJ09sZWcgS29yb2xrbycsICd1bmRlZmluZWQnLCAndW5kZWZpbmVkJywgJycsICd1bmRlZmluZWQnLCA1OS45MzQyODAyLCAzMC4zMzUwOTg2MDAwMDAwMzgsICdodHRwczovL21hcGJ1aWxkci5jb20vYXNzZXRzL2ltZy9tYXJrZXJzL2VsbGlwc2UtcmVkLnBuZyddXG5cdFx0XTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxvY2F0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVsxXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR2YXIgZGVzY3JpcHRpb24gPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBkZXNjcmlwdGlvbiA9IGxvY2F0aW9uc1tpXVsxXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bMl0gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dmFyIHRlbGVwaG9uZSA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHRlbGVwaG9uZSA9IGxvY2F0aW9uc1tpXVsyXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bM10gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dmFyIGVtYWlsID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgZW1haWwgPSBsb2NhdGlvbnNbaV1bM107XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzRdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHZhciB3ZWIgPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciB3ZWIgPSBsb2NhdGlvbnNbaV1bNF07XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzddID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHZhciBtYXJrZXJpY29uID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYXJrZXJpY29uID0gbG9jYXRpb25zW2ldWzddO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0XHRpY29uOiBtYXJrZXJpY29uLFxuXHRcdFx0XHRwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsb2NhdGlvbnNbaV1bNV0sIGxvY2F0aW9uc1tpXVs2XSksXG5cdFx0XHRcdG1hcDogbWFwLFxuXHRcdFx0XHR0aXRsZTogbG9jYXRpb25zW2ldWzBdLFxuXHRcdFx0XHRkZXNjOiBkZXNjcmlwdGlvbixcblx0XHRcdFx0dGVsOiB0ZWxlcGhvbmUsXG5cdFx0XHRcdGVtYWlsOiBlbWFpbCxcblx0XHRcdFx0d2ViOiB3ZWJcblx0XHRcdH0pO1xuXHRcdFx0dmFyIGxpbmsgPSAnJztcblx0XHRcdGJpbmRJbmZvV2luZG93KG1hcmtlciwgbWFwLCBsb2NhdGlvbnNbaV1bMF0sIGRlc2NyaXB0aW9uLCB0ZWxlcGhvbmUsIGVtYWlsLCB3ZWIsIGxpbmspO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGJpbmRJbmZvV2luZG93KG1hcmtlciwgbWFwLCB0aXRsZSwgZGVzYywgdGVsZXBob25lLCBlbWFpbCwgd2ViLCBsaW5rKSB7XG5cdFx0XHR2YXIgaW5mb1dpbmRvd1Zpc2libGUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50bHlWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbih2aXNpYmxlKSB7XG5cdFx0XHRcdFx0aWYgKHZpc2libGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudGx5VmlzaWJsZSA9IHZpc2libGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBjdXJyZW50bHlWaXNpYmxlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSgpKTtcblx0XHRcdHZhciBpdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG5cdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoaW5mb1dpbmRvd1Zpc2libGUoKSkge1xuXHRcdFx0XHRcdGl3LmNsb3NlKCk7XG5cdFx0XHRcdFx0aW5mb1dpbmRvd1Zpc2libGUoZmFsc2UpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBodG1sID0gXCI8ZGl2IHN0eWxlPSdjb2xvcjojMDAwO2JhY2tncm91bmQtY29sb3I6I2ZmZjtwYWRkaW5nOjVweDt3aWR0aDoxNTBweDsnPjwvZGl2PlwiO1xuXHRcdFx0XHRcdGl3ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuXHRcdFx0XHRcdFx0Y29udGVudDogaHRtbFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGl3Lm9wZW4obWFwLCBtYXJrZXIpO1xuXHRcdFx0XHRcdGluZm9XaW5kb3dWaXNpYmxlKHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKGl3LCAnY2xvc2VjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpbmZvV2luZG93VmlzaWJsZShmYWxzZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cblx0fSgpKTtcbiIsInZhciBibG9nTmF2ID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBzaWRlQmFyID0gJCgnLmJsb2ctbWVudScpO1xuICB2YXIgc2lkZUJhckVsZW0gPSAkKCcuYmxvZy1tZW51LWVsZW0nKTtcbiAgdmFyIHNlY3Rpb24gPSAkKCcuYmxvZy1hcnRpY2xlJyk7XG5cbiAgZnVuY3Rpb24gX3NldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICAgIF9zY3JvbGxlZCgpXG4gICAgfSk7XG5cbiAgICBzaWRlQmFyRWxlbS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpZCA9ICQodGhpcykuZGF0YSgnaWQnKTtcbiAgICAgIHZhciB0b3AgPSAkKHNlY3Rpb24uZXEoaWQpKS5vZmZzZXQoKS50b3A7XG5cbiAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtcbiAgICAgICAgc2Nyb2xsVG9wOiB0b3BcbiAgICAgIH0sIDMwMCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfc2Nyb2xsZWQoKSB7XG4gICAgdmFyIHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgIHZhciBtZW51VG9wUG9zID0gJChzZWN0aW9uLmVxKDApKS5vZmZzZXQoKS50b3AgLSBzY3JvbGw7XG4gICAgaWYgKG1lbnVUb3BQb3MgPCAyMCkge1xuICAgICAgc2lkZUJhci5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2lkZUJhci5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICB9XG5cbiAgICBzZWN0aW9uLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtKSB7XG4gICAgICB2YXIgZWxlbUJvdHRvbSA9ICQoZWxlbSkub2Zmc2V0KCkudG9wICsgJChlbGVtKS5oZWlnaHQoKTtcbiAgICAgIHZhciB3aW5kb3dCb3R0b20gPSBzY3JvbGwgKyAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICB2YXIgZWxlbUJvdHRvbVBvcyA9IHdpbmRvd0JvdHRvbSAtIGVsZW1Cb3R0b20gLSAxMDA7XG4gICAgICB2YXIgZWxlbVRvcFBvcyA9ICQoZWxlbSkub2Zmc2V0KCkudG9wIC0gc2Nyb2xsO1xuXG4gICAgICBpZiAoZWxlbVRvcFBvcyA8IDAgfHwgZWxlbUJvdHRvbVBvcyA+IDApIHtcbiAgICAgICAgc2lkZUJhckVsZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBzaWRlQmFyRWxlbS5lcShpbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHNpZGVCYXJFbGVtLmVxKDApLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICBfc2V0VXBFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0pKCk7IiwidmFyIHByZWxvYWRlciA9IChmdW5jdGlvbigpIHtcblxuXHR2YXJcblx0XHRfaW1ncyA9IFtdLFxuXHRcdGNvbnRlbnRSZWFkeSA9ICQuRGVmZXJyZWQoKTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9jb3VudEltYWdlcygpO1xuXHRcdF9zdGFydFByZWxvYWRlcigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2NvdW50SW1hZ2VzKCkge1xuXG5cdFx0JC5lYWNoKCQoJyonKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0XHRiYWNrZ3JvdW5kID0gJHRoaXMuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXG5cdFx0XHRcdGltZyA9ICR0aGlzLmlzKCdpbWcnKTtcblxuXHRcdFx0aWYgKGJhY2tncm91bmQgIT0gJ25vbmUnKSB7XG5cblx0XHRcdFx0dmFyIHBhdGggPSBiYWNrZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsIFwiXCIpLnJlcGxhY2UoJ1wiKScsIFwiXCIpO1xuXHRcdFx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKCd1cmwoJywgXCJcIikucmVwbGFjZSgnKScsIFwiXCIpO1xuXG5cdFx0XHRcdF9pbWdzLnB1c2gocGF0aCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaW1nKSB7XG5cdFx0XHRcdHBhdGggPSAnJyArICR0aGlzLmF0dHIoJ3NyYycpO1xuXHRcdFx0XHRpZiAoKHBhdGgpICYmICgkdGhpcy5jc3MoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnKSkge1xuXHRcdFx0XHRcdF9pbWdzLnB1c2gocGF0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zdGFydFByZWxvYWRlcigpIHtcblx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ292ZXJmbG93LWhpZGRlbicpO1xuXG5cdFx0dmFyIGxvYWRlZCA9IDA7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IF9pbWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaW1hZ2UgPSAkKCc8aW1nPicsIHtcblx0XHRcdFx0YXR0cjoge1xuXHRcdFx0XHRcdHNyYzogX2ltZ3NbaV1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCQoaW1hZ2UpLmxvYWQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxvYWRlZCsrO1xuXHRcdFx0XHR2YXIgcGVyY2VudExvYWRlZCA9IF9jb3VudFBlcmNlbnQobG9hZGVkLCBfaW1ncy5sZW5ndGgpO1xuXHRcdFx0XHRfc2V0UGVyY2VudChwZXJjZW50TG9hZGVkKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX2NvdW50UGVyY2VudChjdXJyZW50LCB0b3RhbCkge1xuXHRcdHJldHVybiBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICogMTAwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zZXRQZXJjZW50KHBlcmNlbnQpIHtcblxuXHRcdCQoJy5wcmVsb2FkZXJfdGV4dCcpLnRleHQocGVyY2VudCk7XG5cblx0XHRpZiAocGVyY2VudCA+PSAxMDApIHtcblx0XHRcdCQoJy5wcmVsb2FkZXJfY29udGFpbmVyJykuZGVsYXkoNzAwKS5mYWRlT3V0KDUwMCk7XG5cdFx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93LWhpZGRlbicpO1xuXHRcdFx0X2ZpbmlzaFByZWxvYWRlcigpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF9maW5pc2hQcmVsb2FkZXIoKSB7XG5cdFx0Y29udGVudFJlYWR5LnJlc29sdmUoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRjb250ZW50UmVhZHk6IGNvbnRlbnRSZWFkeVxuXHR9O1xuXG59KSgpO1xuIiwidmFyIHBhcmFsbGF4ID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cblx0XHRcdHZhciBsYXllciA9ICQoJy5wYXJhbGxheCcpLmZpbmQoJy5wYXJhbGxheF9fbGF5ZXInKTtcblxuXHRcdFx0bGF5ZXIubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gKCh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAqIChrZXkgLyAxMDApKTtcblx0XHRcdFx0JCh2YWx1ZSkuY3NzKHtcblx0XHRcdFx0XHQnYm90dG9tJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLFxuXHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMHB4LCAwcHgsIDApJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0aWYoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFx0XHQkKHdpbmRvdykub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dmFyIG1vdXNlX2R4ID0gKGUucGFnZVgpO1xuXHRcdFx0XHR2YXIgbW91c2VfZHkgPSAoZS5wYWdlWSk7XG5cblx0XHRcdFx0dmFyIHcgPSAod2luZG93LmlubmVyV2lkdGggLyAyKSAtIG1vdXNlX2R4O1xuXHRcdFx0XHR2YXIgaCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIG1vdXNlX2R5O1xuXG5cdFx0XHRcdGxheWVyLm1hcChmdW5jdGlvbihrZXksIHZhbHVlKSB7XG5cdFx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gKCh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAqIChrZXkgLyAxMDApKTtcblx0XHRcdFx0XHR2YXIgd2lkdGhQb3NpdGlvbiA9IHcgKiAoa2V5IC8gNjApO1xuXHRcdFx0XHRcdHZhciBoZWlnaHRQb3NpdGlvbiA9IGggKiAoa2V5IC8gNjApO1xuXHRcdFx0XHRcdCQodmFsdWUpLmNzcyh7XG5cdFx0XHRcdFx0XHQnYm90dG9tJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLFxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGhQb3NpdGlvbiArICdweCwgJyArIGhlaWdodFBvc2l0aW9uICsgJ3B4LCAwKSdcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgZmxpcHBlciA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdHNldFVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dmFyIGF1dGhFbGVtID0gJCgnLmF1dGhvcml6ZScpO1xuXHRcdHZhciBmbGlwRWxlbSA9ICQoJy5mbGlwJyk7XG5cdFx0dmFyIG91dHNpZGVFbGVtID0gJCgnLnBhcmFsbGF4X19sYXllcicpO1xuXHRcdHZhciBiYWNrID0gJCgnI2JhY2tUb01haW4nKTtcblxuXG5cdFx0b3V0c2lkZUVsZW0uY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYoZS50YXJnZXQuaWQgIT0gJ2F1dGhvcml6ZScgJiYgZS50YXJnZXQuaWQgIT0gJ2F1dGhvcml6ZV9kaXYnKSB7XG5cdFx0XHRcdGF1dGhFbGVtLmZhZGVJbigzMDApO1xuXHRcdFx0XHRmbGlwRWxlbS5yZW1vdmVDbGFzcygnZmxpcHBpbmcnKVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0YXV0aEVsZW0uY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YXV0aEVsZW0uZmFkZU91dCgzMDApO1xuXHRcdFx0ZmxpcEVsZW0udG9nZ2xlQ2xhc3MoJ2ZsaXBwaW5nJylcblx0XHR9KTtcblxuXHRcdGJhY2suY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZmxpcEVsZW0ucmVtb3ZlQ2xhc3MoJ2ZsaXBwaW5nJyk7XG5cdFx0XHRhdXRoRWxlbS5mYWRlSW4oMzAwKTtcblx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7XG4iLCJ2YXIgc2Nyb2xsID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0aWYoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHR2YXIgbGF5ZXJzID0gJCgnLnBhcmFsbGF4LXNjcm9sbF9fbGF5ZXInKTtcblx0XHRcdHZhciBtYWluID0gJCgnLm1haW4nKTtcblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuXHRcdFx0XHRsYXllcnMubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgYm90dG9tUG9zaXRpb24gPSBzY3JvbGxUb3AgKiBrZXkgLyA4MDtcblx0XHRcdFx0XHR2YXIgaGVpZ2h0UG9zaXRpb24gPSAtc2Nyb2xsVG9wICoga2V5IC8gODA7XG5cblx0XHRcdFx0XHQkKHZhbHVlKS5jc3Moe1xuXHRcdFx0XHRcdFx0J3RvcCc6ICctJyArIGJvdHRvbVBvc2l0aW9uICsgJ3B4Jyxcblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMCwnICsgaGVpZ2h0UG9zaXRpb24gKyAncHgsIDApJ1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciB0b3BQb3MgPSBzY3JvbGxUb3AgLyA1O1xuXHRcdFx0XHR2YXIgYm90dG9tUG9zID0gLXNjcm9sbFRvcCAvIDU7XG5cdFx0XHRcdG1haW4uY3NzKHtcblx0XHRcdFx0XHQndG9wJzogJy0nICsgdG9wUG9zICsgJ3B4Jyxcblx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDAsJyArIGJvdHRvbVBvcyArICdweCwgMCknXG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciBzbGlkZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0Ly9BcnJheXMgb2YgaW1hZ2VzIGluIGVhY2ggc2xpZGVyIHBhcnRcblx0dmFyIG1haW5JbWFnZXMgPSAkKCcuc2xpZGVyX19tYWluLWltZ19jb250YWluZXInKTtcblx0dmFyIHByZXZJbWFnZXMgPSAkKCcubmV4dFNsaWRlSW1nJyk7XG5cdHZhciBuZXh0SW1hZ2VzID0gJCgnLnByZXZTbGlkZUltZycpO1xuXG5cdC8vIENvbnRyb2wgYnV0dG9uc1xuXHR2YXIgbmV4dFNsaWRlID0gJCgnLnNsaWRlcl9fbmV4dCcpO1xuXHR2YXIgcHJldlNsaWRlID0gJCgnLnNsaWRlcl9fcHJldicpO1xuXG5cdHZhciBjdXJyZW50U2xpZGUgPSAwO1xuXHR2YXIgYW5vdGhlclN0YXRlID0gJC5EZWZlcnJlZCgpO1xuXG5cdGZ1bmN0aW9uIF9hbmltYXRlU2xpZGUoaW1nQXJyYXksIGNvdW50ZXIsIHBvc2l0aW9uVG9wLCB0aW1lLCBkaXNwbGF5KSB7XG5cdFx0aW1nQXJyYXkuZXEoY291bnRlcikuYW5pbWF0ZSh7XG5cdFx0XHRkaXNwbGF5OiBkaXNwbGF5IHx8ICdibG9jaycsXG5cdFx0XHR0b3A6IHBvc2l0aW9uVG9wXG5cdFx0fSwgdGltZSlcblx0fVxuXG5cdGZ1bmN0aW9uIF9pbmMoY291bnRlciwgaW1hZ2VzQXJyYXkpIHtcblx0XHRjb3VudGVyKys7XG5cdFx0cmV0dXJuIGNvdW50ZXIgPiBpbWFnZXNBcnJheS5sZW5ndGggLSAxID8gMCA6IGNvdW50ZXI7XG5cdH1cblxuXHRmdW5jdGlvbiBfZGVjKGNvdW50ZXIsIGltYWdlc0FycmF5KSB7XG5cdFx0Y291bnRlci0tO1xuXHRcdHJldHVybiBjb3VudGVyIDwgMCA/IGltYWdlc0FycmF5Lmxlbmd0aCAtIDEgOiBjb3VudGVyO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFpblNsaWRlcihjb3VudCkge1xuXG5cdFx0YW5vdGhlclN0YXRlID0gJC5EZWZlcnJlZCgpO1xuXG5cdFx0bWFpbkltYWdlcy5lcShjdXJyZW50U2xpZGUpLmZhZGVPdXQoMTUwKTtcblx0XHRpZihjb3VudCA9PT0gJ2luYycpIHtcblx0XHRcdGN1cnJlbnRTbGlkZSA9IF9pbmMoY3VycmVudFNsaWRlLCBtYWluSW1hZ2VzKVxuXHRcdH0gZWxzZSBpZihjb3VudCA9PT0gJ2RlYycpIHtcblx0XHRcdGN1cnJlbnRTbGlkZSA9IF9kZWMoY3VycmVudFNsaWRlLCBtYWluSW1hZ2VzKVxuXHRcdH1cblxuXHRcdG1haW5JbWFnZXMuZXEoY3VycmVudFNsaWRlKS5kZWxheSg1MCkuZmFkZUluKDE1MCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRhbm90aGVyU3RhdGUucmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gQXJyb3dTbGlkZXIoaW1hZ2VzLCBjb3VudGVyKSB7XG5cdFx0dGhpcy5jb3VudGVyID0gY291bnRlcjtcblx0XHR0aGlzLmltYWdlcyA9IGltYWdlcztcblx0XHR0aGlzLnRpbWUgPSAyNTA7XG5cdH1cblxuXHRBcnJvd1NsaWRlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uLCBjb3VudCkge1xuXG5cdFx0Ly8gZGlyZWN0aW9uIG9mIGN1cnJlbnQgc2xpZGUgbW92ZVxuXHRcdGlmKGRpcmVjdGlvbiA9PT0gJ3RvcEJvdHRvbScpIHtcblx0XHRcdF9hbmltYXRlU2xpZGUodGhpcy5pbWFnZXMsIHRoaXMuY291bnRlciwgJysxMDAlJywgdGhpcy50aW1lKTtcblx0XHR9ZWxzZSBpZihkaXJlY3Rpb24gPT09ICdib3R0b21Ub3AnKSB7XG5cdFx0XHRfYW5pbWF0ZVNsaWRlKHRoaXMuaW1hZ2VzLCB0aGlzLmNvdW50ZXIsICctMTAwJScsIHRoaXMudGltZSk7XG5cdFx0fVxuXG5cdFx0aWYoY291bnQgPT09ICdpbmMnKSB7XG5cdFx0XHR0aGlzLmNvdW50ZXIgPSBfaW5jKHRoaXMuY291bnRlciwgdGhpcy5pbWFnZXMpO1xuXHRcdH1lbHNlIGlmIChjb3VudCA9PT0gJ2RlYycpXHR7XG5cdFx0XHR0aGlzLmNvdW50ZXIgPSBfZGVjKHRoaXMuY291bnRlciwgdGhpcy5pbWFnZXMpO1xuXHRcdH1cblxuXHRcdC8vIHByZXYvbmV4dCBzbGlkZSBtb3ZlZCB0byBzdGFydGluZyBwb3NpdGlvblxuXHRcdGlmKGRpcmVjdGlvbiA9PT0gJ3RvcEJvdHRvbScpIHtcblx0XHRcdF9hbmltYXRlU2xpZGUodGhpcy5pbWFnZXMsIHRoaXMuY291bnRlciwgJy0xMDAlJywgMCwgJ25vbmUnKTtcblx0XHR9ZWxzZSBpZihkaXJlY3Rpb24gPT09ICdib3R0b21Ub3AnKSB7XG5cdFx0XHRfYW5pbWF0ZVNsaWRlKHRoaXMuaW1hZ2VzLCB0aGlzLmNvdW50ZXIsICcrMTAwJScsIDAsICdub25lJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbWFnZXMuZXEodGhpcy5jb3VudGVyKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdC8vIHByZXYvbmV4dCBzbGlkZSBiZWNvbWVzIHZpc2libGVcblx0XHRfYW5pbWF0ZVNsaWRlKHRoaXMuaW1hZ2VzLCB0aGlzLmNvdW50ZXIsICcwJywgdGhpcy50aW1lKTtcblx0fTtcblxuXHR2YXIgcHJldlNsaWRlciA9IG5ldyBBcnJvd1NsaWRlcihuZXh0SW1hZ2VzLCAxKTtcblx0dmFyIG5leHRTbGlkZXIgPSBuZXcgQXJyb3dTbGlkZXIocHJldkltYWdlcywgKHByZXZJbWFnZXMubGVuZ3RoIC0gMSkpO1xuXG5cblx0bmV4dFNsaWRlLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdCQud2hlbihtYWluU2xpZGVyKCdpbmMnKSwgbmV4dFNsaWRlci5yZW5kZXIoJ2JvdHRvbVRvcCcsICdpbmMnKSwgcHJldlNsaWRlci5yZW5kZXIoJ3RvcEJvdHRvbScsICdpbmMnKSkuZG9uZShmdW5jdGlvbiAoKSB7XG5cdFx0fSk7XG5cdH0pO1xuXHRwcmV2U2xpZGUuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JC53aGVuKG1haW5TbGlkZXIoJ2RlYycpLCBuZXh0U2xpZGVyLnJlbmRlcigndG9wQm90dG9tJywgJ2RlYycpLCBwcmV2U2xpZGVyLnJlbmRlcignYm90dG9tVG9wJywgJ2RlYycpKS5kb25lKGZ1bmN0aW9uICgpIHtcblx0XHR9KTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRtYWluSW1hZ2VzLmZhZGVPdXQoMCk7XG5cdFx0bWFpbkltYWdlcy5lcSgwKS5mYWRlSW4oMCk7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKChwcmV2SW1hZ2VzLmxlbmd0aCAtIDEpKS5jc3MoJ3RvcCcsIDApO1xuXHRcdG5leHRJbWFnZXMuZXEoMSkuY3NzKCd0b3AnLCAwKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG59KCkpOyIsInZhciBzbGlkZXJUZXh0ID0gKGZ1bmN0aW9uKCkge1xuXHR2YXIgdGl0bGVzQ29udGFpbmVyID0gJCgnLndvcmtzX19sZWZ0X2hlYWRlcicpO1xuXHR2YXIgdGl0bGVzID0gJCgnLndvcmtzX19sZWZ0X2hlYWRlcl9pbm5lcicpO1xuXHR2YXIgdGl0bGVFbGVtID0gJCgnLndvcmtzX19sZWZ0X2hlYWRlcl9pbm5lcicpLmVxKDApO1xuXG5cdHZhciBkZXNjcmlwdGlvbkNvbnRhaW5lciA9ICQoJy53b3Jrc19fbGVmdF9kb25lLXdpdGgnKTtcblx0dmFyIGRlc2NyaXB0aW9uID0gJCgnLndvcmtzX19sZWZ0X2RvbmUtd2l0aF9pbm5lcicpO1xuXHR2YXIgZGVzY3JpcHRpb25FbGVtID0gJCgnLndvcmtzX19sZWZ0X2RvbmUtd2l0aF9pbm5lcicpLmVxKDApO1xuXG5cdC8vY29udHJvbCBidXR0b25zXG5cdHZhciBuZXh0QnV0dG9uID0gJCgnLnNsaWRlcl9fbmV4dCcpO1xuXHR2YXIgcHJldkJ1dHRvbiA9ICQoJy5zbGlkZXJfX3ByZXYnKTtcblxuXHQvL2FycmF5cyB3aXRoIHRpdGxlcyBhbmQgZGVzY3JpcHRpb25cblx0dmFyIHRpdGxlc0FycmF5ID0gW107XG5cdHZhciBkZXNjcmlwdGlvbkFycmF5ID0gW107XG5cblx0Ly8gU2F2ZXMgYWxsIHRpdGxlcyBpbnRvIGFycmF5XG5cdGZ1bmN0aW9uIF9wcm9jZXNzVGl0bGVzKHRpdGxlcywgYXJyYXkpIHtcblx0XHR0aXRsZXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgdGV4dCA9ICR0aGlzLnRleHQoKTtcblx0XHRcdCR0aGlzLmh0bWwoJycpO1xuXHRcdFx0YXJyYXkucHVzaChfc3BhbmlmeSh0ZXh0KSk7XG5cdFx0fSk7XG5cblx0XHQvL3JlbW92ZXMgYWxsIGVsZW1lbnRzIGV4Y2VwdCBvbmUgZnJvbSBET01cblx0XHRkZXNjcmlwdGlvbkNvbnRhaW5lci5lbXB0eSgpO1xuXHRcdGRlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZChkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdHRpdGxlc0NvbnRhaW5lci5lbXB0eSgpO1xuXHRcdHRpdGxlc0NvbnRhaW5lci5hcHBlbmQodGl0bGVFbGVtKTtcblx0fVxuXG5cdC8vIFNhdmVzIGFsbCBkZXNjcmlwdGlvbnMgaW50byBhcnJheVxuXHRmdW5jdGlvbiBfcHJvY2Vzc0Rlc2NyaXB0aW9uKHRpdGxlcywgYXJyYXkpIHtcblx0XHR0aXRsZXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0ZXh0ID0gJCh0aGlzKS5odG1sKCk7XG5cdFx0XHRhcnJheS5wdXNoKHRleHQpXG5cdFx0fSlcblx0fVxuXG5cdC8vIEZ1bmN0aW9uIGFkZHMgc3BhbiB3aXRoIC53b3JkIGNsYXNzIHRvIGVhY2ggd29yZCBhbmQgc3BhbiB3aXRoIC5sZXR0ZXIgY2xhc3Ncblx0Ly8gdG8gZWFjaCBsZXR0ZXJcblx0ZnVuY3Rpb24gX3NwYW5pZnkodGV4dCkge1xuXHRcdHZhciBhcnJheSA9IFtdO1xuXHRcdHZhciB3b3Jkc0FycmF5ID0gdGV4dC5zcGxpdCgnICcpO1xuXHRcdHZhciBzcGFubmVkVGV4dCA9ICcnO1xuXG5cdFx0d29yZHNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHdvcmQpIHtcblx0XHRcdHZhciBsZXR0ZXJzQXJyYXkgPSB3b3JkLnNwbGl0KCcnKTtcblx0XHRcdHZhciBzcGFubmVkV29yZCA9ICcnO1xuXG5cdFx0XHRsZXR0ZXJzQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXR0ZXIpIHtcblx0XHRcdFx0c3Bhbm5lZFdvcmQgKz0gJzxzcGFuIGNsYXNzPVwibGV0dGVyXCI+JyArIGxldHRlciArICc8L3NwYW4+Jztcblx0XHRcdH0pO1xuXG5cdFx0XHRzcGFubmVkVGV4dCArPSAnPHNwYW4gY2xhc3M9XCJ3b3JkXCI+JyArIHNwYW5uZWRXb3JkICsgJzwvc3Bhbj4nO1xuXHRcdH0pO1xuXG5cdFx0YXJyYXkucHVzaChzcGFubmVkVGV4dCk7XG5cdFx0cmV0dXJuIGFycmF5XG5cdH1cblxuXHQvL1Nob3dzIHNlbGVjdGVkIHRpdGxlXG5cdGZ1bmN0aW9uIF9yZW5kZXJUaXRsZShudW0sIGFycmF5LCBlbGVtKSB7XG5cdFx0ZWxlbS5odG1sKGFycmF5W251bV0pO1xuXHRcdGVsZW0uZmluZCgnLmxldHRlcicpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cblx0XHRcdChmdW5jdGlvbihlbGVtKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZWxlbS5hZGRDbGFzcygnYWN0aXZlTGV0dGVyJylcblx0XHRcdFx0fSwgMTAgKiBpbmRleCk7XG5cdFx0XHR9KSgkdGhpcyk7XG5cblx0XHR9KVxuXHR9XG5cblx0Ly9TaG93cyBzZWxlY3RlZCBkZXNjcmlwdGlvblxuXHRmdW5jdGlvbiBfcmVuZGVyRGVzY3JpcHRpb24obnVtLCBhcnJheSwgZWxlbSkge1xuXHRcdGVsZW0uaHRtbChhcnJheVtudW1dKVxuXHR9XG5cblx0ZnVuY3Rpb24gX3NldEV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdHZhciBxdHkgPSB0aXRsZXMubGVuZ3RoO1xuXHRcdHZhciBjb3VudGVyID0gMDtcblxuXHRcdG5leHRCdXR0b24uY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRjb3VudGVyKys7XG5cdFx0XHRjb3VudGVyID0gY291bnRlciA8PSAocXR5IC0gMSkgPyBjb3VudGVyIDogMDtcblx0XHRcdF9yZW5kZXJUaXRsZShjb3VudGVyLCB0aXRsZXNBcnJheSwgdGl0bGVFbGVtKTtcblx0XHRcdF9yZW5kZXJEZXNjcmlwdGlvbihjb3VudGVyLCBkZXNjcmlwdGlvbkFycmF5LCBkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdH0pO1xuXG5cdFx0cHJldkJ1dHRvbi5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdGNvdW50ZXItLTtcblx0XHRcdGNvdW50ZXIgPSBjb3VudGVyIDwgMCA/IChxdHkgLSAxKSA6IGNvdW50ZXI7XG5cdFx0XHRfcmVuZGVyVGl0bGUoY291bnRlciwgdGl0bGVzQXJyYXksIHRpdGxlRWxlbSk7XG5cdFx0XHRfcmVuZGVyRGVzY3JpcHRpb24oY291bnRlciwgZGVzY3JpcHRpb25BcnJheSwgZGVzY3JpcHRpb25FbGVtKTtcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfcHJvY2Vzc1RpdGxlcyh0aXRsZXMsIHRpdGxlc0FycmF5KTtcblx0XHRfcHJvY2Vzc0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uLCBkZXNjcmlwdGlvbkFycmF5KTtcblx0XHRfcmVuZGVyVGl0bGUoMCwgdGl0bGVzQXJyYXksIHRpdGxlRWxlbSk7XG5cdFx0X3JlbmRlckRlc2NyaXB0aW9uKDAsIGRlc2NyaXB0aW9uQXJyYXksIGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0X3NldEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG59KCkpO1xuIiwidmFyIHRhYiA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgdGFicyA9ICQoJy50YWJzX19saXN0LWl0ZW0nKTtcblx0dmFyIHRhYnNMaW5rID0gJCgnLnRhYnNfX2NvbnRyb2wtaXRlbScpO1xuXG5cdGZ1bmN0aW9uIF9zZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdHRhYnMuZXEoMCkuYWRkQ2xhc3MoJ2FjdGl2ZVRhYicpO1xuXHRcdHRhYnNMaW5rLmVxKDApLmFkZENsYXNzKCdhY3RpdmVUYWJMaW5rJyk7XG5cblx0XHR0YWJzTGluay5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhY3RpdmUgPSAkKHRoaXMpLmRhdGEoJ2NsYXNzJyk7XG5cdFx0XHR0YWJzLnJlbW92ZUNsYXNzKCdhY3RpdmVUYWInKTtcblx0XHRcdHRhYnNMaW5rLnJlbW92ZUNsYXNzKCdhY3RpdmVUYWJMaW5rJyk7XG5cdFx0XHR0YWJzLmVxKGFjdGl2ZSkuYWRkQ2xhc3MoJ2FjdGl2ZVRhYicpO1xuXHRcdFx0dGFic0xpbmsuZXEoYWN0aXZlKS5hZGRDbGFzcygnYWN0aXZlVGFiTGluaycpO1xuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcbiIsInZhciBkaWFncmFtID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBlbGVtID0gJCgnLnNraWxsc19fZWxlbXMnKS5lcSgwKTtcblx0dmFyIGRpYWdyYW1BcnJheSA9ICQoJy5zZWN0b3InKTtcblx0dmFyIGRpYWdyYW1WYWx1ZXM7XG5cblx0ZnVuY3Rpb24gX3NldEV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdG9wRWRnZSA9ICQoZWxlbSkub2Zmc2V0KCkudG9wO1xuXHRcdFx0dmFyIHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHRcdHZhciBoZWlnaHQgPSAkKHdpbmRvdykuaW5uZXJIZWlnaHQoKTtcblx0XHRcdHZhciBhbmltYXRpb25TdGFydCA9IGhlaWdodCArIHNjcm9sbCAtIGhlaWdodCAvIDU7XG5cdFx0XHRpZiAoYW5pbWF0aW9uU3RhcnQgPiB0b3BFZGdlKSB7XG5cdFx0XHRcdF9hbmltYXRlKCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIF9hbmltYXRlKCkge1xuXHRcdHZhciBtYXhWYWwgPSAyODA7XG5cdFx0ZGlhZ3JhbUFycmF5LmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIGRhdGFJZCA9ICR0aGlzLmRhdGEoJ2RpYWdyYW0nKTtcblx0XHRcdHZhciBlbGVtVmFsdWUgPSBkaWFncmFtVmFsdWVzW2RhdGFJZF07XG5cdFx0XHR2YXIgZGFzaCA9IChlbGVtVmFsdWUgLyAxMDApICogbWF4VmFsO1xuXHRcdFx0JHRoaXMuY3NzKHtcblx0XHRcdFx0J3N0cm9rZS1kYXNoYXJyYXknOiBkYXNoICsgJyAnICsgbWF4VmFsXG5cdFx0XHR9KVxuXG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIF9nZXRWYWx1ZXMoKSB7XG5cdFx0JC5nZXQoJy9nZXRkaWFncmFtJywgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0ZGlhZ3JhbVZhbHVlcyA9IGRhdGFbMF07XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9nZXRWYWx1ZXMoKTtcblx0XHRfc2V0RXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG59KCkpO1xuIiwidmFyIHNjcm9sbEFycm93ID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIF9zZXRFdmVudExpc3RlbmVycygpIHtcblxuXHRcdCQoJy5hcnJvdy1kb3duLWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgaGVpZ2h0ID0gJCh3aW5kb3cpLmlubmVySGVpZ2h0KCk7XG5cdFx0XHQkKCdib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRcdHNjcm9sbFRvcDogaGVpZ2h0XG5cdFx0XHR9LCA4MDApO1xuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9zZXRFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciB2YWxpZGF0aW9uID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBtb2RhbENvbnRhaW5lclJvYm90ID0gJCgnI2luZGV4LW1vZGFsLWNvbnRhaW5lci1yb2JvdHMnKTtcbiAgdmFyIG1vZGFsQ29udGFpbmVyRmllbGQgPSAkKCcjaW5kZXgtbW9kYWwtY29udGFpbmVyLWZpZWxkJyk7XG4gIHZhciBhbGxNb2RhbHMgPSAkKCcuaW5kZXgtbW9kYWwtY29udGFpbmVyJyk7XG4gIHZhciBhY3RpdmVNb2RhbCA9ICdpbmRleC1tb2RhbC1hY3RpdmUnO1xuICB2YXIgaXNIdW1hbiA9ICQoJyNpc0h1bWFuJyk7XG4gIHZhciBub3RSb2JvdCA9ICQoJyNyYWRpbzEnKTtcbiAgdmFyIGxvZ2luID0gJCgnI2luZGV4X2xvZ2luJyk7XG4gIHZhciBwYXNzID0gJCgnI2luZGV4X3Bhc3MnKTtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIF9zZXRVcEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfc2V0VXBFdmVudExpc3RlbmVycygpIHtcblxuICAgICQoJyNhdXRob3JpemUnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmKCFpc0h1bWFuLnByb3AoJ2NoZWNrZWQnKSB8fCAhbm90Um9ib3QucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgIF9zaG93TW9kYWwobW9kYWxDb250YWluZXJSb2JvdCk7XG4gICAgICB9IGVsc2UgaWYgKGxvZ2luLnZhbCgpID09PSAnJyB8fCBwYXNzLnZhbCgpID09PSAnJykge1xuICAgICAgICBfc2hvd01vZGFsKG1vZGFsQ29udGFpbmVyRmllbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgZm9ybSA9ICQoJy5hdXRoX2Zvcm0nKTtcbiAgICAgICAgICB2YXIgZGVmT2JqID0gX2FqYXhGb3JtKGZvcm0sICcuL2xvZ2luJyk7XG4gICAgICAgICAgaWYgKGRlZk9iaikge1xuICAgICAgICAgICAgZGVmT2JqLmRvbmUoZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgIHZhciBzdGF0dXMgPSByZXMuc3RhdHVzO1xuICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSAnT0snKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYWRtaW4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRlZk9iai5mYWlsKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoJy5pbmRleC1tb2RhbC1ibG9jay1idXR0b24nKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBfaGlkZU1vZGFsKGFsbE1vZGFscyk7XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zaG93TW9kYWwoZWxlbWVudCkge1xuICAgIGVsZW1lbnQuYWRkQ2xhc3MoYWN0aXZlTW9kYWwpO1xuICB9XG4gIGZ1bmN0aW9uIF9oaWRlTW9kYWwoZWxlbWVudCkge1xuICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoYWN0aXZlTW9kYWwpXG4gIH1cbiAgZnVuY3Rpb24gX2FqYXhGb3JtKGZvcm0sIHVybCl7XG4gICAgdmFyIGRhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpO1xuICAgIHZhciBkZWZPYmogPSAkLmFqYXgoe1xuICAgICAgdHlwZSA6IFwiUE9TVFwiLFxuICAgICAgdXJsIDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlZk9iajtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9XG5cbn0oKSk7IiwidmFyIGFkbWluID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBtb2RhbCA9ICQoJy5tb2RhbC1jb250YWluZXInKTtcbiAgdmFyIG9rQnV0dG9uID0gJCgnLm1vZGFsT2snKTtcbiAgdmFyIGJhY2tUb01haW4gPSAkKCcuYWRtaW5faGVhZGVyX3JldHVybicpO1xuICB2YXIgc2F2ZURpYWdyYW0gPSAkKCcjc2F2ZURpYWdyYW0nKTtcblxuICBmdW5jdGlvbiBfc2hvd01vZGFsKHJlc3VsdCkge1xuICAgIGlmIChyZXN1bHQgPT09ICdzdWNjZXNzJykge1xuICAgICAgbW9kYWwuZXEoMCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZGFsLmVxKDEpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9sb2dPdXQoKSB7XG4gICAgZGVmT2JqID0gJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgdXJsOiAnLi9sb2dvdXQnXG4gICAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcbiAgICB9KS5jb21wbGV0ZShmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX2FkZE5ld1dvcmsoKSB7XG4gICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCQoJyN1cGxvYWRGb3JtJylbMF0pO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgdXJsOiBcIi4vdXBsb2FkXCIsXG4gICAgICBkYXRhOiAgZm9ybURhdGFcbiAgICB9KVxuICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIF9zaG93TW9kYWwoJ3N1Y2Nlc3MnKVxuICAgICAgfSkuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgIF9zaG93TW9kYWwoJ2ZhaWwnKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfcG9zdERpYWdyYW1WYWx1ZXMoKSB7XG4gICAgdmFyIGVsZW1lbnRzID0gJCgnLnRhYnNfX2xpc3RfYmxvY2stZWxlbScpO1xuICAgIHZhciB0ZXh0ID0gJCgnLnRhYnNfX2xpc3QtdGV4dCcpO1xuICAgIHZhciB2YWx1ZSA9ICQoJy50YWJzX19saXN0LWlucHV0Jyk7XG4gICAgdmFyIGRpYWdyYW1WYWx1ZXMgPSB7fTtcblxuICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmZpbmQodGV4dCkudGV4dCgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnLicsICcnKTtcbiAgICAgIGRpYWdyYW1WYWx1ZXNbbmFtZV0gPSAkKHRoaXMpLmZpbmQodmFsdWUpLnZhbCgpO1xuICAgIH0pO1xuXG4gICAgJC5wb3N0KFwiL2RpYWdyYW1cIiwgZGlhZ3JhbVZhbHVlcykuZG9uZShmdW5jdGlvbiAoKSB7XG4gICAgICBfc2hvd01vZGFsKCdzdWNjZXNzJylcbiAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zaG93TW9kYWwoJ2ZhaWwnKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfc2V0dXBFdmVudExpc3RlbmVycygpIHtcbiAgICBva0J1dHRvbi5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBtb2RhbC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpXG4gICAgfSk7XG5cbiAgICBiYWNrVG9NYWluLmNsaWNrKF9sb2dPdXQpO1xuICAgIHNhdmVEaWFncmFtLmNsaWNrKF9wb3N0RGlhZ3JhbVZhbHVlcyk7XG5cbiAgICAkKCcjdXBsb2FkRm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBfYWRkTmV3V29yaygpO1xuICAgIH0pO1xuXG4gICAgJCgnI2Jsb2dQb3N0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBkYXRhID0gJCh0aGlzKS5zZXJpYWxpemUoKTtcblxuICAgICAgJC5wb3N0KFwiLi9hZGRibG9ncG9zdFwiLCBkYXRhKS5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICBfc2hvd01vZGFsKCdzdWNjZXNzJylcbiAgICAgICAgJCgnI2Jsb2dQb3N0JylbMF0ucmVzZXQoKTtcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIF9zaG93TW9kYWwoJ2ZhaWwnKVxuICAgICAgfSk7XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgX3NldHVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9XG59KCkpO1xuIiwiZnVuY3Rpb24gbmF2aWdhdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHQkKCcjbmF2LWljb24nKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG5cdFx0JCgnI292ZXJsYXknKS50b2dnbGVDbGFzcygnb3BlbicpO1xuXHR9KTtcbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdHZhciBwYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXG5cdHByZWxvYWRlci5pbml0KCk7XG5cdG5hdmlnYXRpb24oKTtcblxuXHRpZiAocGF0aCA9PT0gJy8nIHx8IHBhdGggPT09ICcvaW5kZXguaHRtbCcpIHtcblx0XHRwYXJhbGxheC5pbml0KCk7XG5cdFx0ZmxpcHBlci5pbml0KCk7XG5cdFx0dmFsaWRhdGlvbi5pbml0KCk7XG5cdH0gZWxzZSB7XG5cdFx0c2Nyb2xsLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL2Jsb2cuaHRtbCcgfHwgcGF0aCA9PT0gJy9ibG9nJykge1xuXHRcdGJsb2dOYXYuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvd29ya3MuaHRtbCcgfHwgcGF0aCA9PT0gJy93b3JrcycpIHtcblx0XHRzbGlkZXIuaW5pdCgpO1xuXHRcdHNsaWRlclRleHQuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvYWJvdXRtZS5odG1sJyB8fCBwYXRoID09PSAnL2Fib3V0bWUnKSB7XG5cdFx0Z29vZ2xlTWFwLmluaXQoKTtcblx0XHRkaWFncmFtLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL2FkbWluLmh0bWwnIHx8IHBhdGggPT09ICcvYWRtaW4nKSB7XG5cdFx0dGFiLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoICE9PSAnYWRtaW4nKSB7XG5cdFx0c2Nyb2xsQXJyb3cuaW5pdCgpO1xuXHRcdGFkbWluLmluaXQoKTtcblx0fVxuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
