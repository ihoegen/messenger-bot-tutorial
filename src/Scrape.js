'use strict'

function scrapeText(file) {
  var bedsArray = file.match(/property-meta-beds"><span class="data-value">(\d+)/g);
  var bathsArray = file.match(/property-meta-baths"><span class="data-value">(\d+)/g);
  var priceArray = file.match(/"srp-item-price" data-label="property-price">\s+(.+)/g);
  var photoArray = file.match(/"srp-item-photo" data-label="property-photo">\s+(.+\s+.+)/g);
  var finalResults = [];
  for (var i = 0; i < bedsArray.length; i++) {
    finalResults[i] = {};
    finalResults[i].beds = bedsArray[i].replace(/\D/g, '');
    finalResults[i].baths = bathsArray[i].replace(/\D/g, '');
    finalResults[i].price = priceArray[i].replace(/\D/g, '');
    finalResults[i].address = photoArray[i].match(/"[^"]+"|(\+)/g)[3];
    finalResults[i].photo = photoArray[i].match(/"[^"]+"|(\+)/g)[7];
  }
  return finalResults;
}


module.exports = scrapeText;
