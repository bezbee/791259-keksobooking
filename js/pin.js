'use strict';
(function () {
  var PIN_HEIGHT = 70;

  window.createPin = function (adData) {
    var pinTemplate = document.querySelector('#pin')
        .content
        .querySelector('.map__pin');
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.top = adData.location.y - window.data.PIN_WIDTH + 'px';
    pinElement.style.left = adData.location.x - PIN_HEIGHT + 'px';
    pinElement.querySelector('img').src = adData.author.avatar;
    pinElement.querySelector('img').alt = adData.offer.title;
    pinElement.addEventListener('click', function () {
      window.card.hideCard();
      window.card.showCard(adData);
    });
    return pinElement;
  };

})();
