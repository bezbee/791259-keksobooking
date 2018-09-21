'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var ESC_KEYCODE = 27;
var NUMBER_OF_ADS = 8;
var Y_START = 130;
var Y_END = 630;

var map = document.querySelector('.map');
var mapCoords = map.getBoundingClientRect();
var mainPin = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
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

var renderPins = function (adsData) {
  var fragment = document.createDocumentFragment();
  for (var v = 0; v < ads.length; v++) {
    fragment.appendChild(createPin(adsData[v]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

var translateOfferTypeintoRussian = function (adData) {
  if (adData === 'palace') {
    return 'Дворец';
  } else if (adData === 'flat') {
    return 'Квартира';
  } else if (adData === 'house') {
    return 'Дом';
  } else if (adData === 'bungalo') {
    return 'Бунгало';
  }
  return adData;
};

var conjugateRooms = function (adData) {
  var rooms = ' комнаты для ';
  if (adData === 1) {
    rooms = ' комнатa для ';
  }
  if (adData === 5) {
    rooms = ' комнат для ';
  }
  return rooms;
};

var renderFeature = function (adData) {
  var valueFeatures = adData;
  var elementFeatures = document.createElement('li');
  elementFeatures.className = 'popup__feature popup__feature--' + valueFeatures;
  return elementFeatures;
};

var fillCard = function (adData) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = adData.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = adData.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = adData.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = translateOfferTypeintoRussian(adData.offer.type);


  var guests = (adData.offer.guests === 1) ? ' гостя' : ' гостей';

  cardElement.querySelector('.popup__text--capacity').textContent = adData.offer.rooms + conjugateRooms(adData.offer.rooms) + adData.offer.guests + guests;
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adData.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var adDataFeatures = adData.offer.features;
  var listFeatures = cardElement.querySelector('.popup__features');
  listFeatures.innerHTML = '';

  for (var k = 0; k < adDataFeatures.length; k++) {
    listFeatures.appendChild(renderFeature(adData.offer.features[k]));
  }

  cardElement.querySelector('.popup__description').textContent = adData.offer.description;
  cardElement.querySelector('.popup__avatar').src = adData.author.avatar;
  cardElement.querySelector('.popup__photos').innerHTML = '';
  var renderPhoto = function (src) {
    var image = cardTemplate.querySelector('.popup__photo');
    var imageElement = image.cloneNode();
    imageElement.src = src;
    return imageElement;
  };

  for (var t = 0; t < adData.offer.photos.length; t++) {
    cardElement.querySelector('.popup__photos').appendChild(renderPhoto(adData.offer.photos[t]));
  }
  return cardElement;
};

// Module 4

var activateSite = function () {
  document.querySelector('.map').classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  renderPins(ads);
};


var createPin = function (adData) {
  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.top = adData.location.y - PIN_WIDTH + 'px';
  pinElement.style.left = adData.location.x - PIN_HEIGHT + 'px';
  pinElement.querySelector('img').src = adData.author.avatar;
  pinElement.querySelector('img').alt = adData.offer.title;
  pinElement.addEventListener('click', function () {
    hideCard();
    showCard(adData);
  });
  return pinElement;
};

(function () {

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var mainPinCoords = mainPin.getBoundingClientRect();


    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      activateSite();
      adForm.querySelector('#address').setAttribute('value', (mainPinCoords.top + mainPin.clientHeight) + ', ' +
    (mainPinCoords.left + mainPin.clientWidth / 2));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

})();

var onEscClose = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hideCard();
  }
};

var showCard = function (adData) {
  fillCard(adData);
  map.insertBefore(fillCard(adData), document.querySelector('.map__filters-container'));
  var closePopup = document.querySelector('.popup__close');
  closePopup.focus();
  closePopup.addEventListener('click', function () {
    hideCard();
  });
  document.addEventListener('keydown', onEscClose);
};

var hideCard = function () {
  document.removeEventListener('keydown', onEscClose);
  var cardToRemove = map.querySelector('.map__card');
  if (cardToRemove) {
    cardToRemove.parentElement.removeChild(cardToRemove);
  }
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
