'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var errorElement = errorTemplate.cloneNode(true);

  var hideMessageElement = function (element) {
    element.parentElement.removeChild(element);
  };
  var MainPin = {
    TOP: 570 + 'px',
    LEFT: 375 + 'px'
  };

  var onESCHideMessageElement = function (evt, element) {
    if (evt.keyCode === window.card.ESC_KEYCODE) {
      hideMessageElement(element);
    }
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.upload(new FormData(adForm), function () {
      deactivateSite();
      onSuccessMessage();
      document.removeEventListener('keydown', function () {
        onESCHideMessageElement(evt, errorElement);
      });
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
  var fragment = document.createDocumentFragment();
  var renderPins = function (adsData) {

    adsData.forEach(function (adData) {
      fragment.appendChild(window.createPin(adData));
    });
    document.querySelector('.map__pins').appendChild(fragment);
    document.removeEventListener('keydown', function (evt) {
      onESCHideMessageElement(evt, errorElement);
    });
  };

  var onErrorMessage = function (errorMessage) {
    errorElement.querySelector('.error__message').textContent = errorMessage;
    errorElement.addEventListener('click', function () {
      hideMessageElement(errorElement);
    });
    document.addEventListener('keydown', function (evt) {
      onESCHideMessageElement(evt, errorElement);
    });
    errorElement.querySelector('.error__button').addEventListener('click', function () {
      hideMessageElement(errorElement);
    });
    document.querySelector('main').appendChild(errorElement);
  };

  var activateSite = function () {
    window.data.map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.load(renderPins, onErrorMessage);
  };

  var deactivateSite = function (evt) {
    evt.preventDefault();
    adForm.reset();
    window.card.hideCard();
    window.data.map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    mainPin.style.left = MainPin.TOP;
    mainPin.style.top = MainPin.LEFT;
    adForm.querySelector('#address').setAttribute('value', '570, 375');
    while (document.querySelector('.map__pins').children.length > 2) {
      document.querySelector('.map__pins').removeChild(document.querySelector('.map__pins').lastChild);
    }
  };

  var onSuccessMessage = function () {
    var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
    var successElement = successTemplate.cloneNode(true);
    successElement.addEventListener('click', function () {
      hideMessageElement(successElement);
    });
    document.addEventListener('keydown', function (evt) {
      onESCHideMessageElement(evt, successElement);
    });
    document.querySelector('main').appendChild(successElement);
  };
  document.querySelector('.ad-form__reset').addEventListener('click', deactivateSite);

})();
