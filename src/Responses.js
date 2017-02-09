'use strict'

const request = require('request');
const Scrape = require('./Scrape.js');
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

function sendResults(searchData, link, token, sender) {
  let messageData = {
    attachment: {
      type: "template",
      payload: {
        template_type: "list",
        elements: []
        buttons: [{
          title: "View More",
          type: "web_url",
          url: link
        }]
      }
    },
  }
  for (let i = 0; i < 4; i++) {
    let currentSearchItem = searchData[i]
    messageData.attachment.payload.elements.push({
      title: currentSearchItem.address,
      image_url: currentSearchItem.photo,
      subtitle: "$"+currentSearchItem.price+ ', ' + currentSearchItem.beds + ' beds, ' + currentSearchItem.baths + ' baths',
      default_action: {
          type: "web_url",
          url: currentSearchItem.link,
      }
    });
  }
  sendRequest(token, sender, messageData);
}
function sendTextMessage(sender, text, token) {
  let textString = JSON.stringify(text).substring(0,200);
	let messageData = { text:textString }
  sendRequest(token, sender, messageData);
}

function getListings(searchParams, token, sender) {
  let defaultLink = "http://www.realtor.com/realestateandhomes-search/";
  defaultLink += searchParams.zip;
  if (searchParams.beds) {
    defaultLink+='/beds-'+searchParams.beds;
  }
  if (searchParams.baths) {
    defaultLink+='/baths-'+searchParams.beds;
  }
  if (searchParams.price) {
    defaultLink+='/price-na-'+searchParams.price;
  }
  defaultLink+='/sby-2';
  request({
    url: defaultLink,
    method: 'GET',
  }, function(error, response, body) {
    sendResults(Scrape(body), defaultLink, token, sender);
  });
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
