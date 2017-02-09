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
			let returnString = tokenized[i].replace('k', '000');
			returnString = returnString.replace(',', '');
			return returnString.substring(1);
		} else if (tokenized[i][tokenized[i].length -1] == 'k') {
				if (!isNaN(tokenized[i][tokenized[i].length - 2]) && !isNaN(tokenized[i][tokenized[i].length - 3])) {
					let guessString = tokenized[i].replace('k', '000');
					guessString = guessString.replace(',', '');
					return guessString;
				}
		}
	}
	return null;
}

function guessPrice(text) {
	let tokenized = text.toLowerCase().split(' ');
	for (let i in tokenized) {
		if (tokenized[i] == 'for' || tokenized[i] == 'under') {
			let iMore = parseInt(i) +1;
			console.log(tokenized[iMore-1]);
			console.log(tokenized[iMore]);
			let current = tokenized[iMore].replace('k', '000').replace(',', '');
			if (!isNaN(current)) {
				return current;
			} else if (current == 'under') {
				return tokenized[iMore+1].replace('k', '000').replace(',', '');
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
