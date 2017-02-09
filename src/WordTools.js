'use strict'

const keywords = ['find', 'buy', 'sell', 'search', 'purchase', 'look', 'looking'];
const criteriaKeywords = ['bedrooms', 'bedroom', 'bed', 'beds', 'bath', 'baths', 'bathroom', 'bathrooms'];

function searchKeywords(text) {
	let tokenized = text.toLowerCase().split(' ');
	for (let i in tokenized) {
		if (keywords.includes(tokenized[i])) {
			return tokenized[i];
		}
	}
	return null;
}

function findZip(text) {
	let tokenized = text.toLowerCase().split(' ');
	for (let i in tokenized) {
		if (!isNaN(tokenized[i]) && tokenized[i].length == 5) {
			return tokenized[i];
		}
	}
	return null;
}

function getSearchParams(text) {
	var finalObject = {};
	var changed = false;
	let tokenized = text.toLowerCase().split(' ');
	for (let i in tokenized) {
		if (criteriaKeywords.includes(tokenized[i])) {
			changed = true;
			if (criteriaKeywords.indexOf(tokenized[i]) < 4 ) {
				finalObject.beds = tokenized[i-1];
			} else {
				finalObject.baths = tokenized[i-1];
			}
		}
	}
	if (changed) return finalObject;
	return null;
}

function findPrice(text) {
	let tokenized = text.toLowerCase().split(' ');
	for (let i in tokenized) {
		if (tokenized[i][0] == '$') {
			return tokenized[i];
		}
	}
	return null;
}

function guessPrice(text) {
	let tokenized = text.toLowerCase().split(' ');
	for (let i in tokenized) {
		if (tokenized[i] == 'for') {
			console.log(tokenized[i]);
			console.log(tokenized[i+1]);
			if (!isNaN(tokenized[i+1])) {
				return tokenized[i+1];
			} else if (tokenized[i+1] == 'under') {
				return tokenized[i+2];
			}
		}
	}
	return null;
}

module.exports = {
  searchKeywords: searchKeywords,
  findZip: findZip,
	getSearchParams: getSearchParams,
	findPrice: findPrice,
	guessPrice: guessPrice
}