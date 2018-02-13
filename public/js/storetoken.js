
'use strict';
var http = require('http');
const https = require('https');


function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
 
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
       var userId = sessionAttributes.name === undefined?'random':sessionAttributes.name;
       var userEmail = sessionAttributes.email === undefined?'random':sessionAttributes.email;
       var userName = sessionAttributes.username === undefined?'random':sessionAttributes.username;
       console.log(userId);
/*       var slotsPassing = {
           fd : fromDateOriginal,
           td : toDateOriginal,
           cat : categoryOriginal,
           loc : locationName
       };*/
/*let sending = {
    hotel : slots.hotelName,
    fdate : slots.fromDate,
    tdate : slots.toDate,
    cate : slots.category,
    lc : slots.location
};  */    

let sending = {
    hotel : userId,
    fdate : 655656,
    tdate : 546565,
    cate : "asdsadk",
    lc : "sasdsads"
}; 
var postData = JSON.stringify(sending);
//console.log(userId);
//var postData = JSON.stringify({userId:{sending}});

var rooms = "Succeffully updated data";
var temp = [];
temp.push(userId);
temp.push(userEmail);
temp.push(userName);
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

    var orig =  close(sessionAttributes, 'Fulfilled',
                 {'contentType': 'PlainText', 'content':  temp.toString()});
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
