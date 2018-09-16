'use strict';

document.querySelector('.map').classList.remove('map--faded');

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var NUMBER_OF_ADS = 8;

var mapWidth = document.querySelector('.map').offsetWidth;
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
  var x = getRandomNumber(1, mapWidth);
  var y = getRandomNumber(130, 630);

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

var createPin = function (adData) {
  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.top = adData.location.y - PIN_WIDTH + 'px';
  pinElement.style.left = adData.location.x - PIN_HEIGHT + 'px';
  pinElement.querySelector('img').src = adData.author.avatar;
  pinElement.querySelector('img').alt = adData.offer.title;
  return pinElement;
};

var fragment = document.createDocumentFragment();
for (var v = 0; v < ads.length; v++) {
  fragment.appendChild(createPin(ads[v]));
}
document.querySelector('.map__pins').appendChild(fragment);

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

  var children = listFeatures.children;
  for (var n = children.length - 1; n >= 0; n--) {
    var child = children[n];
    child.parentElement.removeChild(child);
  }
  var fragment1 = document.createDocumentFragment();
  for (var k = 0; k < adDataFeatures.length; k++) {
    var valueFeatures = adDataFeatures[k];
    var elementFeatures = document.createElement('li');
    elementFeatures.className = 'popup__feature popup__feature--' + valueFeatures;
    fragment1.appendChild(elementFeatures);
  }
  listFeatures.appendChild(fragment1);

  cardElement.querySelector('.popup__description').textContent = adData.offer.description;
  cardElement.querySelector('.popup__avatar').src = adData.author.avatar;
  cardElement.querySelector('.popup__photo').src = adData.offer.photos[0];
  var renderPhotos = function (src) {
    var image = cardTemplate.querySelector('.popup__photo');
    var imageElement = image.cloneNode();
    imageElement.src = src;
    return imageElement;
  };
  var fragment2 = document.createDocumentFragment();
  for (var t = 1; t < adData.offer.photos.length; t++) {
    fragment2.appendChild(renderPhotos(adData.offer.photos[t]));
  }
  cardElement.querySelector('.popup__photos').appendChild(fragment2);
  return cardElement;
};
document.querySelector('.map').insertBefore(fillCard(ads[0]), document.querySelector('.map__filters-container'));
