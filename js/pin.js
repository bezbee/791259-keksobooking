'use strict';
(function () {
  var PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27;

  document.createPin = function (adData) {
    var pinTemplate = document.querySelector('#pin')
        .content
        .querySelector('.map__pin');
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.top = adData.location.y - window.data.PIN_WIDTH + 'px';
    pinElement.style.left = adData.location.x - PIN_HEIGHT + 'px';
    pinElement.querySelector('img').src = adData.author.avatar;
    pinElement.querySelector('img').alt = adData.offer.title;
    pinElement.addEventListener('click', function () {
      hideCard();
      showCard(adData);
    });
    return pinElement;
  };

  var showCard = function (adData) {
    window.card.fillCard(adData);
    window.data.map.insertBefore(window.card.fillCard(adData), document.querySelector('.map__filters-container'));
    var closePopup = document.querySelector('.popup__close');
    closePopup.focus();
    closePopup.addEventListener('click', function () {
      hideCard();
    });
    document.addEventListener('keydown', onEscClose);
  };

  var hideCard = function () {
    document.removeEventListener('keydown', onEscClose);
    var cardToRemove = document.querySelector('.map__card');
    if (cardToRemove) {
      cardToRemove.parentElement.removeChild(cardToRemove);
    }
  };
  var onEscClose = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      hideCard();
    }
  };
})();
