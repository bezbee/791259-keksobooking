'use strict';

(function () {
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TIME = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var PIN_WIDTH = 50;

  var NUMBER_OF_ADS = 8;
  var Y_START = 130;
  var Y_END = 630;
  var map = document.querySelector('.map');
  var mapCoords = map.getBoundingClientRect();
  var ads = [];

  var getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var shuffleArray = function (array) {
    for (var c = array.length - 1; c > 0; c--) {
      var j = Math.floor(Math.random() * (c + 1));
      var x = array[c];
      array[c] = array[j];
      array[j] = x;
    }
    return array;
  };

  for (var i = 0; i < NUMBER_OF_ADS; i++) {
    var x = getRandomNumber(1, mapCoords.width - PIN_WIDTH);
    var y = getRandomNumber(Y_START, Y_END);

    var ad = {
      author: {
        avatar: 'img/avatars/user0' + (1 + i) + '.png'
      },
      offer: {
        title: TITLES[i],
        address: x + ', ' + y,
        price: getRandomNumber(1000, 1000000),
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 5),
        checkin: TIME[Math.floor(Math.random() * TIME.length)],
        checkout: TIME[Math.floor(Math.random() * TIME.length)],
        features: shuffleArray(FEATURES).slice(0, getRandomNumber(1, FEATURES.length)),
        description: '',
        photos: shuffleArray(PHOTOS)
      },
      location: {
        x: x,
        y: y
      }
    };
    ads.push(ad);
  }

  window.data = {
    Y_START: Y_START,
    Y_END: Y_END,
    PIN_WIDTH: PIN_WIDTH,
    map: map,
    ads: ads
  };

})();
