/*Insert js*/
// Initialize Firebase

var firebaseDB;
var uid;
var name;
var email;
var config = {
    apiKey: "AIzaSyAdm4JmVuJYwGCXV9Zrsruqf43bfXqY4bs",
    authDomain: "chatbot-e646b.firebaseapp.com",
    databaseURL: "https://chatbot-e646b.firebaseio.com",
    projectId: "chatbot-e646b",
    storageBucket: "chatbot-e646b.appspot.com",
    messagingSenderId: "914791893667"
};

firebase.initializeApp(config);
var ref = firebase.database().ref();
ref.on("value", function(snapshot){
    console.log('firebase db:');
    firebaseDB = snapshot.val();
    console.log(firebaseDB);

    var num = 1;

    //for each hotel retrieved from DB, populate div on home page.

    firebaseDB.hotels.forEach(function (hotel) {
        $('#hotels-div').append('<div class="col-lg-4 col-md-4 col-sm-6 hotel-box-' + num + '">\n' +
            '\t\t\t\t<div class="tm-home-box-1 tm-home-box-1-2 tm-home-box-1-center">\n' +
            '\t\t\t\t\t<img src="public/img/hotel_' + num + '.jpg" alt="image" class="img-responsive">\n' +
            '\t\t\t\t\t<a class="hotel-link" href="#" data-hotel-id="' + (num - 1) + '">\n' +  //store hotel id as attribute for link
            '\t\t\t\t\t\t<div class="tm-green-gradient-bg tm-city-price-container">\n' +
            '\t\t\t\t\t\t\t<span>' + hotel.name + '</span>\n' +
            '\t\t\t\t\t\t\t<span>' + hotel.location + '</span>\n' +
            '\t\t\t\t\t\t</div>\t\n' +
            '\t\t\t\t\t</a>\t\t\t\n' +
            '\t\t\t\t</div>\t\t\t\t\n' +
            '\t\t\t</div>');

        $('#hotel-list').append('<option value="' + hotel.name + '">' + hotel.name +  ' - ' + hotel.location + '</option>');

        num++;
    })
});


function get_chat(num){
	if(num==0){
			$('#bot-iframe').attr("hidden",false);
			$('#main_btn').hide();
	}
	else{
		$('#bot-iframe').attr("hidden",true);
		$('#main_btn').show();
	}
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log("inside signin");
    console.log(profile);
    console.log(profile);
    writeUserData(profile.getId(), profile.getName(), profile.getEmail(), profile.getImageUrl()); //store user info on Firebase DB (/users).
    uid = profile.getId();
    name = profile.getName();
    email = profile.getEmail();
    //var xhttp = new XMLHttpRequest();
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
        unsubscribe();
        var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.

            console.log(credential);
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        } else {
            console.log('User already signed-in Firebase.');
            console.log(credential);
        }
        // Send the code to the server
        document.getElementById('bot-iframe').src = './bot.html';
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                // return true;
            }
        }
    }
    return false;
}

//store user data under their ID in /users node of Database.
function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture : imageUrl
    });
}

//listen for click on hotel link.
//store that hotel object in localStorage and navigate to hotel.html page.
$(document).on('click', '.hotel-link', function (event) {
    event.preventDefault();

    var hotelID = $(this).attr('data-hotel-id');
    var thisHotel = firebaseDB.hotels[hotelID];

    localStorage.setItem('hotelID', hotelID);
    localStorage.setItem('selectedHotel', JSON.stringify(thisHotel));
    location.replace('/hotel.html');
});