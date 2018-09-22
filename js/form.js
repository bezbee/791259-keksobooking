'use strict';

(function () {
  var priceInput = document.querySelector('#price');
  var typeSelect = document.querySelector('#type');
  var MIN_PRICE = ['0', '5000', '1000', '10000'];

  var timeInSelect = document.querySelector('#timein');
  var timeOutSelect = document.querySelector('#timeout');

  var roomsAndCapacity = {};
  roomsAndCapacity['1'] = ['для 1 гостя'];
  roomsAndCapacity['2'] = ['для 1 гостя', 'для 2 гостей'];
  roomsAndCapacity['3'] = ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'];
  roomsAndCapacity['100'] = ['не для гостей'];
  var roomsList = document.querySelector('#room_number');

  var syncronizeTypeWithPrice = function (index, minPrice) {
    if (typeSelect.selectedIndex === index) {
      priceInput.placeholder = minPrice;
      priceInput.setAttribute('min', minPrice);
    }
  };

  function changeRoomsList() {
    var capacityList = document.querySelector('#capacity');
    var roomNumber = roomsList.options[roomsList.selectedIndex].value;
    while (capacityList.options.length) {
      capacityList.remove(0);
    }
    var guestsQuantity = roomsAndCapacity[roomNumber];
    if (guestsQuantity) {
      for (var b = 0; b < guestsQuantity.length; b++) {
        var guestsQuantityOption = new Option(guestsQuantity[b], b);
        capacityList.options.add(guestsQuantityOption);
      }
    }
  }
  typeSelect.addEventListener('change', function () {
    for (var t = 0; t < typeSelect.length; t++) {
      syncronizeTypeWithPrice(t, MIN_PRICE[t]);
    }
  });

  timeInSelect.addEventListener('change', function () {
    var setCheckTimes = function (index) {
      if (timeInSelect.selectedIndex === index) {
        timeOutSelect.selectedIndex = index.toString();
      }
    };
    for (var t = 0; t < timeInSelect.length; t++) {
      setCheckTimes(t);
    }
  });

  roomsList.addEventListener('change', changeRoomsList);
})();
