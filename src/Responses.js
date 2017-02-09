'use strict'

const request = require('request');

function sendRequest(token, sender, messageData) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

function getStarted(sender, token) {
	let messageData = {
  	attachment: {
  		type: "template",
   			payload: {
    			template_type: "button",
  				text: "Hi, I'm Real Estate Bot. What are you looking to do?",
    			buttons:[{
  					type: "postback",
        		title: "Sell a Home",
        		payload: "ACTION_PAYLOAD,sell"
      		},
  				{
  					type: "postback",
  					title: "Buy a Home",
  					payload: "ACTION_PAYLOAD,buy"
  				}
  				]
  			}
  		}
  	}
    sendRequest(token, sender, messageData);
}
function noZipGiven(trigger, sender, token) {
	let messageData = {
  	attachment: {
  		type: "template",
   			payload: {
    			template_type: "button",
  				text: "What zip code are you looking in?",
    			buttons:[
      		{
      			type: "postback",
        		title: "98335",
            payload: "ZIP_CODE,98335," + trigger
      		},
  				{
  					type: "postback",
  					title: "98332",
            payload: "ZIP_CODE,98332," + trigger
  				},
          {
            type: "postback",
            title: "98333",
            payload: "ZIP_CODE,98333," + trigger
          }
  				]
  			}
  		}
  	}
    sendRequest(token, sender, messageData);
}
function sendTextMessage(sender, text, token) {
	let messageData = { text:text }
  sendRequest(token, sender, messageData);
}

function getListings(searchParams) {
  let defaultLink = "http://www.realtor.com/realestateandhomes-search/";
  defaultLink += searchParams.zip;
  if (searchParams.beds) {
    defaultLink+='/beds-'+searchParams.beds
  }
  if (searchParams.baths) {
    defaultLink+='/baths-'+searchParams.beds
  }
  if (searchParams.price) {
    defaultLink+='/price-na-'+searchParams.price
  }
  return defaultLink;
}

function buyParams(sender, token) {
    sendTextMessage(sender, "Describe what you're looking for", token);
}
module.exports = {
  sendRequest: sendRequest,
  getStarted: getStarted,
  sendTextMessage: sendTextMessage,
  noZipGiven: noZipGiven,
  buyParams: buyParams,
  getListings: getListings
};
