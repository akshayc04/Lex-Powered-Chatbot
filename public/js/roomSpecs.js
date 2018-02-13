
'use strict';
var http = require('http');
const https = require('https');


function close(sessionAttributes, fulfillmentState,slots, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ConfirmIntent',
            intentName: "ReserveHotel",
            message,
                 "slots": {
                              location: slots.loc,
                              fromDate: slots.fd,
                              toDate:slots.td,
                              category:slots.cat,
                              hotelName:slots.hn
                              }
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
       var hotelOrg = slots.hotelName;
       var usrid = sessionAttributes.name;
  //     var temphn = "sujay";
        var myString = '';

       var slotsPassing = {
           fd : fromDateOriginal,
           td : toDateOriginal,
           cat : categoryOriginal,
           loc : locationName,
           hn : hotelOrg
       };
       
   //    var locationName = slots.location;
        var obj ;
     var rooms = [];
    https.get('https://chatbot-e646b.firebaseio.com/hotels.json', (resp) => {
              let data = '';
              
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {

                  data += chunk;
                obj = JSON.parse(data);
                //var rooms = [];
        obj.forEach((hotel) =>{
           if(hotel.location === locationName){
                hotel.rooms.forEach((room)=>{
                   if(room.type === categoryOriginal){
                       if(!rooms.includes(room.services) ){
                        rooms.push(room.description);
                       rooms.push(room.services);
                       rooms.push('Price:'+room.price);
                       }
                   }
                });

            }
                     });

                if(rooms.toString() === ""){
                    console.log("Inside empty string");
                    rooms.push('Sorry could not find services');
                    rooms.push('Try another search result by saying or typing book a hotel');
                }else{
                    rooms.push("Do you want to book this? say yes if you are satisfied");
                }
              });
              
             /* myString+= rooms.toString();
             myString =  myString.split(",").join("\r\n");*/
              
              // The whole response has been received. Print out the result.
             resp.on('end', () => {
                                var orig = close(sessionAttributes, 'Fulfilled',slotsPassing,
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
