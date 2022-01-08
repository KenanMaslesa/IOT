 // FIREBASE START
 const firebaseConfig = {
    apiKey: "AIzaSyB08EBwxY00N9-RzJ6jAfbv9v0A2eLXn3Y",
    authDomain: "iot-fc394.firebaseapp.com",
    databaseURL: "https://iot-fc394-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "iot-fc394",
    storageBucket: "iot-fc394.appspot.com",
    messagingSenderId: "1085347753926",
    appId: "1:1085347753926:web:1ae607a18372c2cded4cc7"
};

firebase.initializeApp(firebaseConfig);

let db = firebase.database().ref('Lights');
db.on('value', (status) => {
    let obj = status.val();
    if (obj.status == TURN_LIGHTS_OFF) {
        turnLightsOff();
    }
    else if (obj.status == TURN_LIGHTS_ON) {
        turnLightsOn();
    }
});

sendData = (command) => {
    db.set({
        status: command
    }, (error) => {
        if (error) {
            console.log("Greska u snimanju podataka!");
        } else {
            console.log("Uspjesno snimljeni podaci!");
        }
    });
}
// FIREBASE END


//  VOICE RECOGNITION START
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const TURN_LIGHTS_ON = 'on';
const TURN_LIGHTS_OFF = 'off';

var grammar = '#JSGF V1.0; grammar colors; public <color> = turn lights on | turn lights off ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function (event) {
    var voiceCommand = event.results[event.results.length - 1][0].transcript;
    voiceCommand = voiceCommand.trim();

    if (voiceCommand == TURN_LIGHTS_OFF) {
        sendData(TURN_LIGHTS_OFF);
    }
    else if (voiceCommand == TURN_LIGHTS_ON) {
        sendData(TURN_LIGHTS_ON);
    }
}

recognition.onspeechend = function () {
    recognition.stop();
}
// VOICE RECOGNITION END


const offBtn = document.getElementById('offBtn');
const onBtn = document.getElementById('onBtn');
const microphone = document.getElementById('microphone');
const time = document.getElementById('time');
let video = document.getElementById('video');

function turnLightsOn() {
    video.setAttribute('src', 'media/on.mp4');
    readOutLoud("turning lights on");
    onBtn.style.display = "none";
    offBtn.style.display = "block";
}

function turnLightsOff() {
    video.setAttribute('src', 'media/off.mp4');
    readOutLoud("turning lights off");
    setTimeout(() => {
        video.setAttribute('src', 'media/default.mp4');
        onBtn.style.display = "block";
        offBtn.style.display = "none";
    }, 2300);

}

// READ TEXT
function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

microphone.addEventListener('click', () => {
    recognition.start();
    readOutLoud("what do you want me to do?");
});

offBtn.addEventListener('click', () => {
    sendData(TURN_LIGHTS_OFF);
});

onBtn.addEventListener('click', () => {
    sendData(TURN_LIGHTS_ON);
});