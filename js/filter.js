'use strict';

(function () {

  var filter = {
    roomCount: 'any',
    type: 'any',
    price: '0',
    guests: 'any',
    features: []
  };

  var filterByType = function (offer, type) {
    if (type === 'any') {
      return true;
    }
    return offer.type === type;
  };

  var filterByRooms = function (offer, roomCount) {
    if (roomCount === 'any') {
      return true;
    }
    return parseInt(roomCount, 10) === offer.rooms;
  };

  var filterByPrice = function (offer, priceType) {
    switch (priceType) {
      case 'low': return offer.price < 10000;
      case 'middle': return offer.price <= 50000 && offer.price >= 10000;
      case 'high': return offer.price > 50000;
    }
    return true;
  };

  var filterbyGuests = function (offer, guests) {
    if (guests === 'any') {
      return true;
    }
    return parseInt(guests, 10) === offer.guests;
  };

  var filterByFeatures = function (offer, featuresArr) {
    if (featuresArr.length === 0) {
      return true;
    } else {
      return featuresArr.every(function (feature) {
        return offer.features.indexOf(feature) !== -1;
      });
    }
  };

  var addFilter = function (type, value) {
    filter[type] = value;
  };

  var addFeatureToArray = function (value) {
    filter.features.push(value);
  };

  var removeFeatureFromArray = function (value) {
    filter.features.splice(filter.features.indexOf(value), 1);
  };

  var apply = function (array) {
    return array.filter(function (ad) {
      return filterByPrice(ad.offer, filter.price) &&
             filterByType(ad.offer, filter.type) &&
             filterByRooms(ad.offer, filter.roomCount) &&
             filterbyGuests(ad.offer, filter.guests) &&
             filterByFeatures(ad.offer, filter.features);
    });
  };

  var resetFilterArray = function () {
    filter = {
      roomCount: 'any',
      type: 'any',
      price: '0',
      guests: 'any',
      features: []
    };
  };

  window.filter = {
    addFeatureToArray: addFeatureToArray,
    removeFeatureFromArray: removeFeatureFromArray,
    addFilter: addFilter,
    apply: apply,
    resetFilterArray: resetFilterArray
  };

})();
