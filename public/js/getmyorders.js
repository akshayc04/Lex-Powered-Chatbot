
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
/*function close(sessionAttributes, slots, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            message,
              "slots": {
      locReserve: slots.fromDate,
      fromDateReserve: slots.fromDateOriginal,
      toDateReserve:slots.toDateOriginal,
      categoryReserve:slots.categoryOriginal
      }
        },
                      "slots": {
      locReserve: slots.fromDate,
      fromDateReserve: slots.fromDateOriginal,
      toDateReserve:slots.toDateOriginal,
      categoryReserve:slots.categoryOriginal
      }
 
    };
}*/

// --------------- Events -----------------------

function dispatch(intentRequest, callback_local) {
    console.log('request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}');
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
       var locationName = slots.location;
       var fromDateOriginal = slots.fromDate;
       var toDateOriginal = slots.toDate;
       var categoryOriginal = slots.category;
       var usrid = sessionAttributes.name;
  //     var temphn = "sujay";

       var slotsPassing = {
           fd : fromDateOriginal,
           td : toDateOriginal,
           cat : categoryOriginal,
           loc : locationName,
           hn : null
       };
       
   //    var locationName = slots.location;
        var obj ;
     var rooms = [];
     //rooms.push('arvind');
                  /* fromDate: "11/11/11",
                  toDate: "11/11/11",
                  category: "king"
                              fulfillmentState: "Fulfilled",*/
    https.get('https://chatbot-e646b.firebaseio.com/orders/'+usrid+'.json', (resp) => {
              let data = '';
              
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {

                  data += chunk;
                    
        if(data === "null"){
            console.log("inside if");
            rooms = "You don't have any reservations at the moment";
        }else{
             console.log("inside else");
            rooms = JSON.stringify(data);
           rooms = rooms.replace(/\\/g, '');
           rooms = rooms.replace(/{/g, '');
           rooms = rooms.replace(/}/g, '');
            rooms = rooms.replace(/\\/g, '');
             rooms = rooms.replace(/"/g, '');
              rooms.split(',').join("\n");
        }
            
              });
              
              // The whole response has been received. Print out the result.
             resp.on('end', () => {
                                var orig = close(sessionAttributes, 'Fulfilled',
                                {'contentType': 'PlainText', 'content':  rooms.toString()});
                                callback_local(orig);
              });
              
/*                resp.on('end', () => {
                                var orig = close(sessionAttributes,slotsPassing,
                                {'contentType': 'PlainText', 'content':  rooms.toString()});
                                callback_local(orig);
              });*/
             
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
