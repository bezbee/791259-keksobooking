'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var photoInput = document.querySelector('#images');
  var avatarInput = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoBlock = document.querySelector('.ad-form__photo-container');
  var reader = new FileReader();

  var onAvatarLoad = function () {
    avatarPreview.src = reader.result;
  };

  var onPhotoLoad = function () {
    var img = document.createElement('img');
    img.src = reader.result;
    img.width = '70';
    img.height = '70';
    img.alt = 'Фотография пользователя';
    var div = document.createElement('div');
    div.className = 'ad-form__photo';
    div.appendChild(img);
    photoBlock.insertBefore(div, photoBlock.childNodes[3]);
  };

  var addPhoto = function (fileChooser, handler) {

    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        reader.addEventListener('load', handler);
        reader.readAsDataURL(file);
      }
    });
  };

  addPhoto(avatarInput, onAvatarLoad);
  addPhoto(photoInput, onPhotoLoad);
})();
