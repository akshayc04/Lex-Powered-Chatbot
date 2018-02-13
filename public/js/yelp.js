
'use strict';
var http = require('http');
const https = require('https');


function close(sessionAttributes, fulfillmentState,slots, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ConfirmIntent',
            intentName: "SendSMS",
            message,
            "slots" : {
                 location: slots.loc,
                              fromDate: slots.fromDate,
                              toDate:slots.toDate,
                              category:slots.category,
                              hotelName:slots.hotelName,
                              location : slots.location
            }
                    }
        
    };
}

// --------------- Events -----------------------

function dispatch(intentRequest, callback_local) {
    console.log(intentRequest.sessionAttributes.name);
    console.log('request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}');
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
       var locationName = slots.location;
       var fromDateOriginal = slots.fromDate;
       var toDateOriginal = slots.toDate;
       var categoryOriginal = slots.category;
       var hotelName = slots.hotelName;
       var userId = sessionAttributes.name;
       var userName = sessionAttributes.username;
       var userEmail = sessionAttributes.email;

let sendingSlots = {
    hotelName : slots.hotelName,
    fromDate : slots.fromDate,
    toDate : slots.toDate,
    category : slots.category,
    location : slots.location
};      
/*let sending = {
    hotelName : "Days Inn",
    fromDate : "11/12/13",
    toDate : "11/15/17",
    category : "king",
    location : "Syracuse"
}; */

var postData = JSON.stringify({    
    hotelName : slots.hotelName,
    fromDate : slots.fromDate,
    toDate : slots.toDate,
    category : slots.category,
    location : slots.location});
console.log(userId);
//var postData = JSON.stringify({userId:{sending}});

var rooms = "Successfully Booked Hotel! Do you want a confirmation Email? ";
var options = {
    hostname: 'chatbot-e646b.firebaseio.com',
    port: 443,
    path: '/orders/'+userId+'.json',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
    }
};

var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(postData);
req.end();

    var orig =  close(sessionAttributes, 'Fulfilled',sendingSlots,
                 {'contentType': 'PlainText', 'content':  rooms.toString()});
        callback_local(orig);

  

}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });

    } catch (err) {
        console.log("inside catch");
        console.log(err);
        callback(err);
    }
};
