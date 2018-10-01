'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var removeElement = function (element) {
    element.parentElement.removeChild(element);
  };

  var removeDisabledAttribute = function (list) {
    for (var i = list.length - 1; i >= 0; i--) {
      var child = list[i];
      child.removeAttribute('disabled');
    }
  };


  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    removeElement: removeElement,
    removeDisabledAttribute: removeDisabledAttribute
  };
})();
