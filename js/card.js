'use strict';
(function () {
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
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adData.offer.checkin + ', выезд до ' + adData.offer.checkout;

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
  window.card = {
    fillCard: fillCard
  };

})();
