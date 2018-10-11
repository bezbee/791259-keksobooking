'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var fileChooser = document.querySelector('#images');
  var div = document.querySelector('.ad-form__photo');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var newPhoto = document.createElement('img');
        newPhoto.src = reader.result;
        div.appendChild(newPhoto);
      });

      reader.readAsDataURL(file);
    }
  });
})();
