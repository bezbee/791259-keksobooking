'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');
  var root = document.querySelector('main');
  var NUMBER_OF_ADS_TO_SHOW = 5;
  var filterSelects = document.querySelectorAll('.map__filters select');

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
      window.form.adForm.querySelector('#address').setAttribute('value', (mainPinCoords.top + mainPin.clientHeight) + ', ' +
    (mainPinCoords.left + mainPin.clientWidth / 2));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      activateSite();
      window.form.fillMainPinInitialCoordinates();
    }
  });

  var renderPins = function (adsData) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < NUMBER_OF_ADS_TO_SHOW; i++) {
      fragment.appendChild(window.pin.createPin(adsData[i]));
    }
    document.querySelector('.map__pins').appendChild(fragment);
  };

  var hidePopup = function (popup, listener) {
    window.util.removeElement(popup);
    document.removeEventListener('keydown', listener);
  };

  var onESCHideSuccessMessage = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      hidePopup(document.querySelector('.success'), onESCHideSuccessMessage);
    }
  };

  var onESCHideErrorMessage = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      hidePopup(document.querySelector('.error'), onESCHideErrorMessage);
    }
  };

  var showSuccessMessage = function () {
    var successElement = successTemplate.cloneNode(true);
    document.addEventListener('keydown', onESCHideSuccessMessage);
    successElement.addEventListener('click', function () {
      hidePopup(successElement);
    });
    root.appendChild(successElement);
  };

  var showErrorMessage = function (errorMessage) {
    var errorElement = errorTemplate.cloneNode(true);
    errorElement.querySelector('.error__message').textContent = errorMessage;
    document.addEventListener('keydown', onESCHideErrorMessage);
    errorElement.querySelector('.error__button').addEventListener('click', function () {
      hidePopup(errorElement);
    });
    root.appendChild(errorElement);
  };

  var activateSite = function () {
    window.data.map.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');
    window.backend.load(renderPins, showErrorMessage);
    window.util.removeDisabledAttribute(window.form.fieldsets);
    window.util.removeDisabledAttribute(filterSelects);
  };

  window.map = {
    mainPin: mainPin,
    showErrorMessage: showErrorMessage,
    showSuccessMessage: showSuccessMessage
  };


})();
