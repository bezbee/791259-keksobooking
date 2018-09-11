'use strict';

document.querySelector('.map').classList.remove('map--faded');

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var types = ['palace', 'flat', 'house', 'bungalo'];

var hoursNoonOneTwo = ['12:00', '13:00', '14:00'];

var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var mapWidth = document.querySelector('.map').offsetWidth;

var pinLocation = {
  x: getRandomNumber(1, mapWidth),
  y: getRandomNumber(130, 630)
};

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
      title: titles[i],
      address: pinLocation.x + ', ' + pinLocation.y,
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

var renderPin = function () {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.top = pinLocation.y - 50 + 'px';
  pinElement.style.left = pinLocation.x - 70 + 'px';
  pinElement.querySelector('img').src = ad.author.avatar;
  pinElement.querySelector('img').alt = ad.offer.title;
  return pinElement;
};
// цикл написала, а появляется только один пин. Не знаю что дальше делать!
var fragment = document.createDocumentFragment();
for (var v = 0; v < ads.length; v++) {
  fragment.appendChild(renderPin());
}
document.querySelector('.map__pins').appendChild(fragment);

var adTemplate = document.querySelector('#card').content.querySelector('.map__card');

var renderAd = function () {
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  if (ad.offer.type === 'palace') {
    ad.offer.type = 'Дворец';
  } else if (ad.offer.type === 'flat') {
    ad.offer.type = 'Квартира';
  } else if (ad.offer.type === 'house') {
    ad.offer.type = 'Дом';
  } else if (ad.offer.type === 'bungalo') {
    ad.offer.type = 'Бунгало';
  }
  adElement.querySelector('.popup__type').textContent = ad.offer.type;
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  // удобства вставляются без стилей Не знаю, что делать
  adElement.querySelector('.popup__features').textContent = ad.offer.features;
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
