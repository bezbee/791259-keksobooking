'use strict';

(function () {
  var NUMBER_OF_ADS = 5;
  var Y_START = 130;
  var Y_END = 630;
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');
  var root = document.querySelector('main');
  var filterForm = document.querySelector('.map__filters');
  var filterSelects = document.querySelectorAll('.map__filters select');
  var ads = [];
  var activated;

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

      if (mainPin.offsetTop - shift.y < Y_START - mainPinCoords.height) {
        mainPin.style.top = Y_START - mainPinCoords.height + 'px';

      }
      if (mainPin.offsetLeft - shift.x < 0) {
        mainPin.style.left = 0 + 'px';
      }
      if (mainPin.offsetTop - shift.y > Y_END) {
        mainPin.style.top = Y_END + 'px';
      }

      if (mainPin.offsetLeft - shift.x > map.clientWidth - mainPinCoords.width) {
        mainPin.style.left = map.clientWidth - mainPinCoords.width + 'px';

      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (!activated) {
        activateSite();
        activated = true;
      }
      window.form.adForm.querySelector('#address').setAttribute('value', Math.round((mainPin.offsetTop + mainPin.clientHeight)) + ', ' +
    Math.round((mainPin.offsetLeft + mainPin.clientWidth / 2)));
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
    adsData.forEach(function (adData) {
      fragment.appendChild(window.pin.create(adData));
    });
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

  var loaded = function (adsData) {
    ads = adsData;
    renderPins(ads.slice(0, NUMBER_OF_ADS));
  };

  var activateSite = function () {
    map.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');
    window.backend.load(loaded, showErrorMessage);
    window.util.removeDisabledAttribute(window.form.fieldsets);
    window.util.removeDisabledAttribute(filterSelects);
  };

  filterForm.addEventListener('change', function (evt) {
    switch (evt.target.id) {
      case 'housing-type':
        window.filter.addFilter('type', evt.target.value);
        break;
      case 'housing-rooms':
        window.filter.addFilter('roomCount', evt.target.value);
        break;
      case 'housing-price':
        window.filter.addFilter('price', evt.target.value);
        break;
      case 'housing-guests':
        window.filter.addFilter('guests', evt.target.value);
        break;
    }

    if (evt.target.checked) {
      window.filter.addFeatureToArray(evt.target.value);
    }
    if (evt.target.checked === false) {
      window.filter.removeFeatureFromArray(evt.target.value);
    }

    window.form.removePins();
    window.card.hideCard();
    window.debounce(renderPins(window.filter.apply(ads).slice(0, NUMBER_OF_ADS)));

  });

  var setActive = function (isActive) {
    activated = isActive;
  };

  window.map = {
    mainMap: map,
    setActive: setActive,
    mainPin: mainPin,
    showErrorMessage: showErrorMessage,
    showSuccessMessage: showSuccessMessage,
    filterForm: filterForm
  };

})();
