
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
    console.log('request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}');
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
       var name = slots.location;
    var obj ;
     var rooms = [];
    https.get('https://chatbot-e646b.firebaseio.com/hotels.json', (resp) => {
              let data = '';
              
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
                 obj = JSON.parse(data);
                 console.log(obj);
             

        obj.forEach((hotel) =>{
            if(hotel.location === 'sajhdsajdh' || hotel.location === 'sajdsajdh' ){
               rooms.push(hotel.name);
            }
        });
        
        if(rooms.toString() === ""){
            rooms.push('None');
        }
              });
             
              
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                                var orig = close(sessionAttributes, 'Fulfilled',
                                {'contentType': 'PlainText', 'content':  rooms.toString()});
                                callback_local(orig);
              });
             
            }).on("error", (err) => {
              console.log("Error: " + err.message);
        });

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
