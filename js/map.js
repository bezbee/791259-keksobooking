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
document.querySelector('.map').insertBefore(fillCard(ads[0]), document.querySelector('.map__filters-container'));

var syncronizeTypeWithPrice = function (index, minPrice) {
  if (typeSelect.selectedIndex === index) {
    priceInput.placeholder = minPrice;
    priceInput.setAttribute('min', minPrice);
  }
};

var priceInput = document.querySelector('#price');
var typeSelect = document.querySelector('#type');
var MIN_PRICE = ['0', '5000', '1000', '10000'];
typeSelect.addEventListener('change', function () {
  for (var t = 0; t < typeSelect.length; t++) {
    syncronizeTypeWithPrice(t, MIN_PRICE[t]);
  }
});

var timeInSelect = document.querySelector('#timein');
var timeOutSelect = document.querySelector('#timeout');


timeInSelect.addEventListener('change', function () {
  var setCheckTimes = function (index) {
    if (timeInSelect.selectedIndex === index) {
      timeOutSelect.selectedIndex = index.toString();
    }
  };
  for (var t = 0; t < timeInSelect.length; t++) {
    setCheckTimes(t);
  }
});

var roomsAndCapacity = {};
roomsAndCapacity['1'] = ['для 1 гостя'];
roomsAndCapacity['2'] = ['для 1 гостя', 'для 2 гостей'];
roomsAndCapacity['3'] = ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'];
roomsAndCapacity['100'] = ['не для гостей'];

function changeRoomsList() {
  var roomsList = document.querySelector('#room_number');
  var capacityList = document.querySelector('#capacity');
  var roomNumber = roomsList.options[roomsList.selectedIndex].value;
  while (capacityList.options.length) {
    capacityList.remove(0);
  }
  var guestsQuantity = roomsAndCapacity[roomNumber];
  if (guestsQuantity) {
    for (var b = 0; b < guestsQuantity.length; b++) {
      var guestsQuantityOption = new Option(guestsQuantity[b], b);
      capacityList.options.add(guestsQuantityOption);
    }
  }
}

var roomsList = document.querySelector('#room_number');
roomsList.addEventListener('change', changeRoomsList);
