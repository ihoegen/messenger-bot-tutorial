'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const token = "EAADB3ttHzLMBAGfjo1tbVFTjWjynytD1w6YdQeFB4xVSkaQmlqBVxxzGIbOgusEtZA9y8mlyVAgLkxZCEEZCcQtSp2PcdAZB5Ks5pydy3oNAXHlSFJDaAdKITQA5RvQ8am7IpU6jc7OkLbod2qOi3zUkmHjwbI1ZCNPohuwufzwZDZD"
const Responses = require('./src/Responses.js');
const WordTools = require('./src/WordTools.js');
var contextStore = {};
var searchStore = {};

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (!contextStore[sender]) searchStore[sender] = {};
		if (event.message && event.message.text) {
			let text = event.message.text || '';
			let chosenClue = WordTools.searchKeywords(text);
			let zipCode = WordTools.findZip(text);
			let searchParams = WordTools.getSearchParams(text);
			let price = WordTools.findPrice(text) || WordTools.guessPrice(text);
			if (!contextStore[sender]&& searchParams) {
				searchStore[sender].beds = searchParams.beds;
				searchStore[sender].baths = searchParams.baths;
			}
			if (!contextStore[sender] && price) {
				searchStore[sender].price = price;
			}
			if (contextStore[sender] == 'describe') {
				contextStore[sender] = null;
				if (searchParams) {
					searchStore[sender].beds = searchParams.beds;
					searchStore[sender].baths = searchParams.baths;
				}
				if (price) {
					searchStore[sender].price = price;
				}
				Responses.getListings(searchStore[sender], token);
				continue;
			}
			switch (chosenClue) {
				case 'find':
				case 'search':
				case 'buy':
				case 'purchase':
					contextStore[sender] = 'buy';
					searchStore[sender].type = 'buy';
					if (zipCode) {
						searchStore[sender].zip = zipCode;
						if (searchStore[sender].beds || searchStore[sender].baths) {
							contextStore[sender] = null;
							Responses.getListings(searchStore[sender], token);
						} else {
							Responses.buyParams(sender, token);
						}
					} else {
						Responses.noZipGiven('buy', sender, token);
					}
					break;
				case 'sell':
					contextStore[sender] = 'sell';
					searchStore[sender].type = 'sell';
					Responses.sendTextMessage(sender, "You want to sell a home", token);
					break;
				default:
				if (searchStore[sender].type == 'buy' && zipCode) {
					searchStore[sender].zip = zipCode;
					if (searchStore[sender].beds || searchStore[sender].baths) {
						contextStore[sender] = null;
						Responses.getListings(searchStore[sender], token);
					} else {
						contextStore[sender] = 'describe';
						Responses.buyParams(sender, token);
					}
				} else {
					Responses.getStarted(sender, token);
				}
				continue;
			}
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback.payload)
			let searchParams = WordTools.getSearchParams(text);
			if (!searchStore) searchStore[sender] = {};
			if (!contextStore[sender] && searchParams) {
				searchStore[sender].beds = searchParams.beds;
				searchStore[sender].baths = searchParams.baths;
			}
			text = text.replace(/"/g, '');
			let splitPostback = text.split(',');
			let postbackType = splitPostback[0];
			switch (postbackType) {
				case "ZIP_CODE":
					searchStore[sender].zip = splitPostback[1];
					if (searchStore[sender].beds || searchStore[sender].baths) {
						contextStore[sender] = null;
						Responses.getListings(searchStore[sender], token);
					} else {
						contextStore[sender] = 'describe';
						Responses.buyParams(sender, token);
					}
					break;
				case "ACTION_PAYLOAD":
					contextStore[sender] = 'sell';
					let triggerType = splitPostback[1];
					if (triggerType != 'sell') {
						contextStore[sender] = triggerType;
						searchStore[sender].type = triggerType;
						Responses.noZipGiven(triggerType, sender, token);
					} else {
						Responses.sendTextMessage(sender, "You want to sell a home", token);
					}
					break;
				default:
				Responses.sendTextMessage(sender, text, token)
			}
			continue
		}
	}
	res.sendStatus(200)
})
// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
