'use strict';

document.querySelector('.map').classList.remove('map--faded');

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var TYPES = ['palace', 'flat', 'house', 'bungalo'];

var time = ['12:00', '13:00', '14:00'];

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var mapWidth = document.querySelector('.map').offsetWidth;

var NUMBER_OF_ADS = 8;

var ads = [];

var customFeatures = [];

for (var j = getRandomNumber(1, 6); j > 0; j--) {
  customFeatures.push(FEATURES[j - 1]);
}

for (var i = 0; i < NUMBER_OF_ADS; i++) {

  var getLocationX = function () {
    var x = getRandomNumber(1, mapWidth);
    return x;
  };
  var locationX = getLocationX();

  var getLocationY = function () {
    var y = getRandomNumber(130, 630);
    return y;
  };
  var locationY = getLocationY();

  var ad = {
    author: {
      avatar: 'img/avatars/user0' + (1 + i) + '.png'
    },
    offer: {
      title: TITLES[i],
      address: locationX + ', ' + locationY,
      price: getRandomNumber(1000, 1000000),
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(1, 5),
      checkin: time[Math.floor(Math.random() * time.length)],
      checkout: time[Math.floor(Math.random() * time.length)],
      features: customFeatures,
      description: '',
      photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
  ads.push(ad);
}

var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.top = pin.location.y - PIN_WIDTH + 'px';
  pinElement.style.left = pin.location.x - PIN_HEIGHT + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;
  return pinElement;
};

var fragment = document.createDocumentFragment();
for (var v = 0; v < ads.length; v++) {
  fragment.appendChild(renderPin(ads[v]));
}
document.querySelector('.map__pins').appendChild(fragment);

var adTemplate = document.querySelector('#card').content.querySelector('.map__card');

var translateOfferTypeintoRussian = function (type) {
  if (type === 'palace') {
    return 'Дворец';
  } else if (type === 'flat') {
    return 'Квартира';
  } else if (type === 'house') {
    return 'Дом';
  } else if (type === 'bungalo') {
    return 'Бунгало';
  }
  return type;
};

var renderAd = function (listing) {
  var adElement = adTemplate.cloneNode(true);

  adElement.querySelector('.popup__title').textContent = listing.offer.title;
  adElement.querySelector('.popup__text--address').textContent = listing.offer.address;
  adElement.querySelector('.popup__text--price').textContent = listing.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = translateOfferTypeintoRussian(listing.offer.type);

  var rooms = ' комнаты для ';
  if (listing.offer.rooms === 1) {
    rooms = ' комнатa для ';
  }
  if (listing.offer.rooms === 5) {
    rooms = ' комнат для ';
  }

  var guests = (listing.offer.guests === 1) ? ' гостя' : ' гостей';

  adElement.querySelector('.popup__text--capacity').textContent = listing.offer.rooms + rooms + listing.offer.guests + guests;
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + listing.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var listingFeatures = listing.offer.features;
  var listFeatures = adElement.querySelector('.popup__features');

  var children = listFeatures.children;
  for (var n = children.length - 1; n >= 0; n--) {
    var child = children[n];
    child.parentElement.removeChild(child);
  }
  var fragment1 = document.createDocumentFragment();
  for (var k = 0; k < listingFeatures.length; k++) {
    var valueFeatures = listingFeatures[k];
    var elementFeatures = document.createElement('li');
    elementFeatures.className = 'popup__feature popup__feature--' + valueFeatures;
    fragment1.appendChild(elementFeatures);
  }
  listFeatures.appendChild(fragment1);

  adElement.querySelector('.popup__description').textContent = listing.offer.description;
  adElement.querySelector('.popup__avatar').src = listing.author.avatar;
  adElement.querySelector('.popup__photo').src = listing.offer.photos[0];
  var fragment2 = document.createDocumentFragment();
  for (var t = listing.offer.photos.length - 1; t > 0; t--) {
    var image = adTemplate.querySelector('.popup__photo');
    var imageElement = image.cloneNode();
    imageElement.src = listing.offer.photos[t];
    fragment2.appendChild(imageElement);
  }

  adElement.querySelector('.popup__photos').appendChild(fragment2);
  return adElement;
};
document.querySelector('.map').insertBefore(renderAd(ads[0]), document.querySelector('.map__filters-container'));
