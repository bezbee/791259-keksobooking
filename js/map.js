'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');

  var MainPin = {
    TOP: 570,
    LEFT: 375
  };

  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.upload(new FormData(adForm), function () {
      onSuccessMessage();
      deactivateSite();

    }, onErrorMessage);
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

  var renderPins = function (adsData) {
    var fragment = document.createDocumentFragment();
    adsData.forEach(function (adData) {
      fragment.appendChild(window.createPin(adData));
    });
    document.querySelector('.map__pins').appendChild(fragment);
  };

  var hideMessageElement = function (element) {
    element.parentElement.removeChild(element);
  };

  var onESCHideErrorMessage = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      document.querySelector('.error').parentElement.removeChild(document.querySelector('.error'));
    }
  };

  var onESCHideSuccessMessage = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      document.querySelector('.success').parentElement.removeChild(document.querySelector('.success'));
    }
  };

  var onErrorMessage = function (errorMessage) {
    var errorElement = errorTemplate.cloneNode(true);
    errorElement.querySelector('.error__message').textContent = errorMessage;
    errorElement.addEventListener('click', function () {
      hideMessageElement(errorElement);
    });
    errorElement.addEventListener('keydown', function () {
      document.removeEventListener('keydown', onESCHideErrorMessage);
    });
    document.addEventListener('keydown', onESCHideErrorMessage);
    errorElement.querySelector('.error__button').addEventListener('click', function () {
      hideMessageElement(errorElement);
    });
    document.querySelector('main').appendChild(errorElement);
  };

  var onSuccessMessage = function () {
    var successElement = successTemplate.cloneNode(true);
    successElement.addEventListener('click', function () {
      hideMessageElement(successElement);
    });
    successElement.addEventListener('keydown', function () {
      document.removeEventListener('keydown', onESCHideSuccessMessage);
    });
    document.addEventListener('keyup', onESCHideSuccessMessage);
    document.querySelector('main').appendChild(successElement);
  };

  var activateSite = function () {
    window.data.map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.load(renderPins, onErrorMessage);
  };

  var deactivateSite = function () {
    adForm.reset();
    window.card.hideCard();
    window.data.map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    mainPin.style.left = MainPin.TOP + 'px';
    mainPin.style.top = MainPin.LEFT + 'px';
    adForm.querySelector('#address').setAttribute('value', MainPin.TOP + ', ' + MainPin.LEFT);
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = pins.length - 1; i >= 0; i--) {
      var child = pins[i];
      child.parentElement.removeChild(child);
    }
  };

  document.querySelector('.ad-form__reset').addEventListener('click', deactivateSite);

})();
