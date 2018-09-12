'use strict';

document.querySelector('.map').classList.remove('map--faded');

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var types = ['palace', 'flat', 'house', 'bungalo'];

var hoursNoonOneTwo = ['12:00', '13:00', '14:00'];

var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var mapWidth = document.querySelector('.map').offsetWidth;

var NUMBER_OF_ADS = 8;

var ads = [];

var customFeatures = [];

for (var j = getRandomNumber(1, 6); j > 0; j--) {
  customFeatures.push(features[j - 1]);
}

for (var i = 0; i < NUMBER_OF_ADS; i++) {
  var ad = {
    author: {
      avatar: 'img/avatars/user0' + (1 + i) + '.png'
    },
    offer: {
      title: TITLES[i],
      address: {
        x: getRandomNumber(1, mapWidth),
        y: getRandomNumber(130, 630)},
      price: getRandomNumber(1000, 1000000),
      type: types[Math.floor(Math.random() * types.length)],
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(1, 5),
      checkin: hoursNoonOneTwo[Math.floor(Math.random() * hoursNoonOneTwo.length)],
      checkout: hoursNoonOneTwo[Math.floor(Math.random() * hoursNoonOneTwo.length)],
      features: customFeatures,
      description: '',
      photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
    }
  };
  ads.push(ad);
}

var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.top = pin.offer.address.y - 50 + 'px';
  pinElement.style.left = pin.offer.address.x - 70 + 'px';
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
// Кость я здесь в правильном направлении двигаюсь? Она не работает но если а правильном я буду ее дорабатывать
var renderFeatures = function (items) {
  var featuresList = adTemplate.querySelector('.popup__features');
  for (var k = 0; k < items.length; k++) {
    if (!items[k] === 'wifi') {
      featuresList.removechild(adTemplate.querySelector('.popup__feature--wifi'));
    }
    if (!items[k] === 'dishwasher') {
      featuresList.removechild(adTemplate.querySelector('.popup__feature--dishwasher'));
    }
    if (!items[k] === 'parking') {
      featuresList.removechild(adTemplate.querySelector('.popup__feature--parking'));
    }
    if (!items[k] === 'washer') {
      featuresList.removechild(adTemplate.querySelector('.popup__feature--washer'));
    }
    if (!items[k] === 'elevator') {
      featuresList.removechild(adTemplate.querySelector('.popup__feature--elevator'));
    }
    if (!items[k] === 'conditioner') {
      featuresList.removechild(adTemplate.querySelector('.popup__feature--conditioner'));
    }
  }
  return featuresList;
};

var renderAd = function () {
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address.x + ', ' + ad.offer.address.y;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = translateOfferTypeintoRussian(ad.offer.type);
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  // подскажи как вставить весь блок UL. Когда после ('.popup__features') ничего не идет, eslint ругается
  // adElement.querySelector('.popup__features').innerHTML = renderFeatures(ad.offer.features);
  adElement.querySelector('.popup__description').textContent = ad.offer.description;
  adElement.querySelector('.popup__avatar').src = ad.author.avatar;
  // здесь намудрила, прости, но работает же!
  adElement.querySelector('.popup__photo').src = ad.offer.photos[0];
  for (var t = ad.offer.photos.length - 1; t > 0; t--) {
    var image = document.createElement('img');
    image.classList.add('popup__photo');
    image.src = ad.offer.photos[t];
    image.width = '45';
    image.height = '40';
    adElement.querySelector('.popup__photos').appendChild(image);
  }
  return adElement;
};
document.querySelector('.map').insertBefore(renderAd(ads[0]), document.querySelector('.map__filters-container'));
