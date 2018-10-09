'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var fieldsets = document.querySelectorAll('fieldset');
  var priceInput = document.querySelector('#price');
  var typeSelect = document.querySelector('#type');
  var MIN_PRICE = ['0', '5000', '1000', '10000'];

  var timeInSelect = document.querySelector('#timein');
  var timeOutSelect = document.querySelector('#timeout');

  var capacityList = document.querySelector('#capacity');
  var roomsAndCapacity = {};
  roomsAndCapacity['1'] = ['для 1 гостя'];
  roomsAndCapacity['2'] = ['для 1 гостя', 'для 2 гостей'];
  roomsAndCapacity['3'] = ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'];
  roomsAndCapacity['100'] = ['не для гостей'];
  var roomsList = document.querySelector('#room_number');

  var MainPin = {
    TOP: 570,
    LEFT: 375
  };

  var syncronizeTypeWithPrice = function (index, minPrice) {
    if (typeSelect.selectedIndex === index) {
      priceInput.placeholder = minPrice;
      priceInput.setAttribute('min', minPrice);
    }
  };

  var changeRoomsList = function () {
    var roomNumber = roomsList.options[roomsList.selectedIndex].value;
    while (capacityList.options.length) {
      capacityList.remove(0);
    }
    var guestsQuantity = roomsAndCapacity[roomNumber];
    if (guestsQuantity) {
      for (var i = 0; i < guestsQuantity.length; i++) {
        var guestsQuantityOption = new Option(guestsQuantity[i], i);
        capacityList.options.add(guestsQuantityOption);
      }
    }
  };
  typeSelect.addEventListener('change', function () {
    for (var i = 0; i < typeSelect.length; i++) {
      syncronizeTypeWithPrice(i, MIN_PRICE[i]);
    }
  });

  timeInSelect.addEventListener('change', function () {
    var setCheckTimes = function (index) {
      if (timeInSelect.selectedIndex === index) {
        timeOutSelect.selectedIndex = index.toString();
      }
    };
    for (var i = 0; i < timeInSelect.length; i++) {
      setCheckTimes(i);
    }
  });

  roomsList.addEventListener('change', changeRoomsList);

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(adForm), function () {
      window.map.showSuccessMessage();
      deactivateSite();
    }, window.map.showErrorMessage);
  });

  var fillMainPinInitialCoordinates = function () {
    adForm.querySelector('#address').setAttribute('value', MainPin.TOP + ', ' + MainPin.LEFT);
  };

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = pins.length - 1; i >= 0; i--) {
      var child = pins[i];
      window.util.removeElement(child);
    }
  };

  var deactivateSite = function () {
    window.map.setActive(false);
    adForm.reset();
    window.map.filterForm.reset();
    window.filter.resetFilterArray();
    for (var j = fieldsets.length - 1; j >= 0; j--) {
      var childForm = fieldsets[j];
      childForm.setAttribute('disabled', '');
    }
    window.card.hideCard();
    window.data.map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    window.map.mainPin.style.left = MainPin.TOP + 'px';
    window.map.mainPin.style.top = MainPin.LEFT + 'px';
    fillMainPinInitialCoordinates();
    removePins();
  };

  document.querySelector('.ad-form__reset').addEventListener('click', deactivateSite);

  window.form = {
    adForm: adForm,
    fieldsets: fieldsets,
    fillMainPinInitialCoordinates: fillMainPinInitialCoordinates,
    removePins: removePins
  };
})();
