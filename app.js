let port = process.env.PORT || 3000;
const express = require('express');
var bodyParser = require('body-parser');

const app = express();
var path = require('path');
var http = require('http');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

app.use(bodyParser.urlencoded({
  extended: true
}));
var aws_access_key_id = "xxxxxxx";
var aws_secret_access_key = "xxxxxx";

// Import Admin SDK
var admin = require("firebase-admin");
var serviceAccount = require("./chatbot-e646b-firebase-adminsdk-pdcem-fdbfc2329b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatbot-e646b.firebaseio.com/"
});
app.use("/", express.static(__dirname + '/'));

// Get a database reference to our posts
var db = admin.database();
var hotels = db.ref("/hotels");

// Attach an asynchronous callback to read the data at our posts reference
hotels.on("value", function(snapshot) {
	console.log("Fetching hotel details");
    console.log(snapshot.val());
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

var lexruntime = new AWS.LexRuntime();
var endPoint = AWS.Endpoint;
console.log(endPoint);
lexruntime.postContent({}, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
app.get('/', function(req, res) {
		 res.sendFile('index.html',{root:path.join(__dirname,'./')});
});

app.get('/index', function(req, res) {
		 res.sendFile('index.html',{root:path.join(__dirname,'./')});
});

app.get('/hotel', function(req, res) {
    
    res.sendFile('hotel.html',{root:path.join(__dirname,'./')});
});
app.get('/about', function(req, res) {
    
    res.sendFile('about.html',{root:path.join(__dirname,'./')});
});
app.get('/tours', function(req, res) {
    
    res.sendFile('tours.html',{root:path.join(__dirname,'./')});
});

app.post('/storeauthcode', function(req,res) {
    console.log("Firebase tokens");
    console.log(JSON.stringify(req.body.param1));

});

app.listen(port, function () {
    console.log('Server started on port 3000!')
});
