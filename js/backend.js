
'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000; // 10s
  var URL = 'https://js.dump.academy/keksobooking';

  var createXhrRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIMEOUT;
    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = createXhrRequest(onLoad, onError);
    xhr.open('GET', URL + '/data');
    xhr.send();
  };

  var upload = function (onLoad, onError, data) {
    var xhr = createXhrRequest(onLoad, onError);
    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };

})();
