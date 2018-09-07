'use strict';

/*'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'*/

var avatars = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];

var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var types = ['palace', 'flat', 'house', 'bungalo'];

var numbersFromOneToFive = [1, 2, 3, 4, 5];
var hoursNoonOneTwo = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photographs = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var getRandomNumber = function(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var ads = [
  {
    author: 'img/avatars/user01.png',
    offer: {
      title: titles[Math.floor(Math.random() * titles.length)],
      address: 'location.x' +',' + 'location.y',
      price: getRandomNumber(1000, 1000000),
      type: types[Math.floor(Math.random() * types.length)],
      rooms: numbersFromOneToFive[Math.floor(Math.random() * numbersFromOneToFive.length)],
      checkin: hoursNoonOneTwo[Math.floor(Math.random() * hoursNoonOneTwo.length)],
      checkout: hoursNoonOneTwo[Math.floor(Math.random() * hoursNoonOneTwo.length)],
      features: features,
      description: '',
      photos: photographs
    },
    location: {
      x: getNumber(),
      y: getNumber(130, 630)
    }
  },
  {
    author: avatars,
    offer: description,
    location: coordinates
  }
]
