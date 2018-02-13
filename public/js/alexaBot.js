$(document).ready(function(){
    setTimeout(function () {
        lexaudio.appendMessage = function (message) {
            $("#messageWindow").append(message);
        };

        lexaudio.clearWindows = function () {
            $("#messageWindow").clear();
        };

        lexaudio.idleCount = 0;

    },1000);
    $("#voiceControl").click(function(){

        setTimeout( function () {
            if($("#voicePanel")[0].style.display === "block"){
                // window is open
                lexaudio.windowState = "open";
                $("#audio-control").click();
            } else  if($("#voicePanel")[0].style.display === "none") {
                //stop alexa
                lexaudio.windowState = "close";
            }
        }, 2000);

        $("#voicePanel").slideToggle("slow");
        });
});
