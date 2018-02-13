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

function dispatch(intentRequest, callback_local) {
    console.log('request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}');
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
       var locationName = slots.location;
       var fromDateOriginal = slots.fromDate;
       var toDateOriginal = slots.toDate;
       var categoryOriginal = slots.category;
       var usrid = 'Hi '+sessionAttributes.username+' how may i help you today? I can book you a hotel, just stary by saying book a hotel.';


        var orig = close(sessionAttributes, 'Fulfilled',
                 {'contentType': 'PlainText', 'content':  usrid.toString()});
            callback_local(orig);


}

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