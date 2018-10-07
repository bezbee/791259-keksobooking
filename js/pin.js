'use strict';
(function () {
  var PIN_HEIGHT = 70;
  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');

  var createPin = function (adData) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinElementImage = pinElement.querySelector('img');
    pinElement.style.top = adData.location.y - window.data.PIN_WIDTH + 'px';
    pinElement.style.left = adData.location.x - PIN_HEIGHT + 'px';
    pinElementImage.src = adData.author.avatar;
    pinElementImage.alt = adData.offer.title;
    pinElement.addEventListener('click', function () {

      window.card.hideCard();
      pinElement.classList.add('map__pin--active');
      window.card.showCard(adData);

    });
    return pinElement;
  };

  window.pin = {
    create: createPin
  };

})();
