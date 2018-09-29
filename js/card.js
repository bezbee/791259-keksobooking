'use strict';
(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');


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

  var renderPhoto = function (src) {
    var image = cardTemplate.querySelector('.popup__photo');
    var imageElement = image.cloneNode(true);
    imageElement.src = src;
    return imageElement;
  };

  var fillCard = function (adData) {

    var cardElement = cardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = adData.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = adData.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = adData.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = translateOfferTypeintoRussian(adData.offer.type);

    var guests = (adData.offer.guests === 1) ? ' гостя' : ' гостей';

    cardElement.querySelector('.popup__text--capacity').textContent = adData.offer.rooms + conjugateRooms(adData.offer.rooms) + adData.offer.guests + guests;
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adData.offer.checkin + ', выезд до ' + adData.offer.checkout;

    var listFeatures = cardElement.querySelector('.popup__features');
    listFeatures.innerHTML = '';

    adData.offer.features.forEach(function (adFeature) {
      listFeatures.appendChild(renderFeature(adFeature));
    });

    cardElement.querySelector('.popup__description').textContent = adData.offer.description;
    cardElement.querySelector('.popup__avatar').src = adData.author.avatar;
    cardElement.querySelector('.popup__photos').innerHTML = '';

    adData.offer.photos.forEach(function (adPhoto) {
      cardElement.querySelector('.popup__photos').appendChild(renderPhoto(adPhoto));
    });
    return cardElement;
  };

  var showCard = function (adData) {
    window.data.map.insertBefore(window.card.fillCard(adData), document.querySelector('.map__filters-container'));
    var closePopup = document.querySelector('.popup__close');
    closePopup.focus();
    closePopup.addEventListener('click', function () {
      hideCard();
    });
    document.addEventListener('keydown', onEscClose);
  };

  var hideCard = function () {
    var pins = document.querySelectorAll('.map__pin');
    pins.forEach(function (pin) {
      if (pin.className === 'map__pin map__pin--active') {
        pin.classList.remove('map__pin--active');
      }
    });

    document.removeEventListener('keydown', onEscClose);
    var cardToRemove = document.querySelector('.map__card');
    if (cardToRemove) {
      window.util.removeElement(cardToRemove);
    }
  };
  var onEscClose = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      hideCard();
    }
  };

  window.card = {
    fillCard: fillCard,
    showCard: showCard,
    hideCard: hideCard,
  };

})();
