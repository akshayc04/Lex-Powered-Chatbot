
'use strict';
var http = require('http');
const https = require('https');


function close(sessionAttributes, fulfillmentState,slots, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ConfirmIntent',
            intentName: "GetRoomSpecs",
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
       var usrid = sessionAttributes.name;
       var userName = sessionAttributes.username;
       var userEmail = sessionAttributes.email;
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
    var myString;
     //rooms.push('arvind');
                  /* fromDate: "11/11/11",
                  toDate: "11/11/11",
                  category: "king"
                              fulfillmentState: "Fulfilled",*/
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

                         let categoryJson = room.type;
/*                         let parts =fromDateOriginal.split('/');
                         let fromdate = new Date(parts[2],parts[0]-1,parts[1]);
                         parts = toDateOriginal.split('/');
                         let todate = new Date(parts[2],parts[0]-1,parts[1]);*/
                         let   parts = room.fromDate.split('/');
                         let fromDateJSON = new Date(parts[2],parts[0]-1,parts[1]);
                            parts = room.toDate.split('/');
                         let toDateJSON = new Date(parts[2],parts[0]-1,parts[1]);
               /*            let checkDate = new Date(2017,10,23);*/
                
                             let checkFromDate = new Date(2017,0,1);
                             let checkToDate = new Date(2050,11,31);
                         let availability = room.availability;
            //             console.log("category:"+category);
                        //  console.log("fromdate:"+fromdate);
                        //  console.log("todate:"+todate);
                         console.log("availability:"+availability);

                         if( categoryJson === categoryOriginal && availability === 'available'){
                             console.log("inside if:");
                            if(!rooms.includes(hotel.name)){
                                  rooms.push(hotel.name+'\r');
                            }
                           
                         }
                     });

            }
        });
        

/*       var s = "";
       for(var x in rooms){
           s += x"\n";
       }*/
                if(rooms.toString() === ""){
                    console.log(" inside ifffff");
                    rooms.push('No Rooms found');
                    rooms.push('Try another search result by saying or typing book another');
                }else if(rooms.length == 1){
                    rooms.push("Do you want to know the services offered in this room? Say yes or no");
                }else{
                    rooms.push("Do you want to know the services offered in any of these rooms? Say yes or no");
                }
                
                myString = rooms.join('\r\n');
             
              });
             
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
