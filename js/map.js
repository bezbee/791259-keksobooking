'use strict';

document.querySelector('.map').classList.remove('map--faded');

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var avatars = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];

var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var types = ['palace', 'flat', 'house', 'bungalo'];

var hoursNoonOneTwo = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var photographs = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var mapWidth = document.querySelector('.map').offsetWidth;

var ads = [];

var customFeatures = [];

var NUMBER_OF_ADS = 8;

for (var j = getRandomNumber(1, 6); j > 0; j--) {
  customFeatures.push(features[j - 1]);
}

var structureAds = function () {
  for (var i = 0; i < NUMBER_OF_ADS; i++) {
    ads[i] = {
      author: avatars[i],
      offer: {
        title: titles[i],
        // Не знаю как вписать значения из location
        address: location.x + ',' + location.y,
        price: getRandomNumber(1000, 1000000),
        type: types[Math.floor(Math.random() * types.length)],
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 5),
        checkin: hoursNoonOneTwo[Math.floor(Math.random() * hoursNoonOneTwo.length)],
        checkout: hoursNoonOneTwo[Math.floor(Math.random() * hoursNoonOneTwo.length)],
        features: customFeatures,
        description: '',
        photos: photographs
      },
      location: {
        x: getRandomNumber(1, mapWidth),
        y: getRandomNumber(130, 630)
      }
    };
  }
  return ads;
};
structureAds();

var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

var fragment = document.createDocumentFragment();

for (var i = 0; i < ads.length; i++) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.top = location.y - 50 + 'px';
  pinElement.style.left = location.x - 70 + 'px';
  pinElement.querySelector('img').src = avatars[i];
  pinElement.querySelector('img').alt = titles[i];
  fragment.appendChild(pinElement);
}
// получается вставить только одну точку на карте
document.querySelector('.map__pins').appendChild(fragment);

var adTemplate = document.querySelector('#card').content.querySelector('.map__card');

var adElement = adTemplate.cloneNode(true);
adElement.querySelector('.popup__title').textContent = ads[0].offer.title;
adElement.querySelector('.popup__text--address').textContent = ads[0].offer.address;
adElement.querySelector('.popup__text--price').textContent = ads[0].offer.price + '₽/ночь';
if (ads[0].offer.type === 'palace') {
  ads[0].offer.type = 'Дворец';
} else if (ads[0].offer.type === 'flat') {
  ads[0].offer.type = 'Квартира';
} else if (ads[0].offer.type === 'house') {
  ads[0].offer.type = 'Дом';
} else if (ads[0].offer.type === 'bungalo') {
  ads[0].offer.type = 'Бунгало';
}
adElement.querySelector('.popup__type').textContent = ads[0].offer.type;
adElement.querySelector('.popup__text--capacity').textContent = ads[0].offer.rooms + ' комнаты для ' + ads[0].offer.guests + ' гостей';
adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ads[0].offer.checkin + ', выезд до ' + ads[0].offer.checkout;
// убодства вставляются без стилей
adElement.querySelector('.popup__features').textContent = ads[0].offer.features;
adElement.querySelector('.popup__description').textContent = ads[0].offer.description;
// adElement.querySelector('img').src = ads[0].author; не получается с //аватаркой
// photos доделаю завтра
document.querySelector('.map').insertBefore(adElement, document.querySelector('.map__filters-container'));
