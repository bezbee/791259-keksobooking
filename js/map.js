'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.upload(new FormData(adForm), function () {
      adForm.reset();
    }, errorHandler);
  });

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var mainPinCoords = mainPin.getBoundingClientRect();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';

      if (mainPin.offsetTop - shift.y < window.data.Y_START - mainPinCoords.height) {
        mainPin.style.top = window.data.Y_START - mainPinCoords.height + 'px';

      }
      if (mainPin.offsetLeft - shift.x < 0) {
        mainPin.style.left = 0 + 'px';
      }
      if (mainPin.offsetTop - shift.y > window.data.Y_END) {
        mainPin.style.top = window.data.Y_END + 'px';
      }

      if (mainPin.offsetLeft - shift.x > window.data.map.clientWidth - mainPinCoords.width) {
        mainPin.style.left = window.data.map.clientWidth - mainPinCoords.width + 'px';

      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      activateSite();
      adForm.querySelector('#address').setAttribute('value', (mainPinCoords.top + mainPin.clientHeight) + ', ' +
    (mainPinCoords.left + mainPin.clientWidth / 2));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var successHandler = function (adsData) {
    var fragment = document.createDocumentFragment();
    for (var v = 0; v < adsData.length; v++) {
      fragment.appendChild(window.createPin(adsData[v]));
    }
    document.querySelector('.map__pins').appendChild(fragment);
  };

  var errorHandler = function (errorMessage) {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    errorElement.querySelector('.error__message').textContent = errorMessage;
    document.querySelector('main').appendChild(errorElement);
  };

  var activateSite = function () {
    window.data.map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.load(successHandler, errorHandler);
  };

})();
