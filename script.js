// FIREBASE START
const firebaseConfig = {
  apiKey: "AIzaSyB08EBwxY00N9-RzJ6jAfbv9v0A2eLXn3Y",
  authDomain: "iot-fc394.firebaseapp.com",
  databaseURL:
    "https://iot-fc394-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "iot-fc394",
  storageBucket: "iot-fc394.appspot.com",
  messagingSenderId: "1085347753926",
  appId: "1:1085347753926:web:1ae607a18372c2cded4cc7",
};

firebase.initializeApp(firebaseConfig);

let lightsStatus;
let db = firebase.database().ref("Lights");
db.on("value", (status) => {
  lightsStatus = status.val().status;
  if (lightsStatus == TURN_LIGHTS_OFF) {
    turnLightsOff();
  } else if (lightsStatus == TURN_LIGHTS_ON) {
    turnLightsOn();
  }
});

sendData = (command) => {
  addNewTableRow(command);
  db.set(
    {
      status: command,
    },
    (error) => {
      if (error) {
        console.log("Greska u snimanju podataka!");
      } else {
        console.log("Uspjesno snimljeni podaci!");
      }
    }
  );
};
// FIREBASE END

//  VOICE RECOGNITION START
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const TURN_LIGHTS_ON = "on";
const TURN_LIGHTS_OFF = "off";

let recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function (event) {
  let voiceCommands = event.results[event.results.length - 1][0].transcript;
  // let voiceCommands = event.results[0][0].transcript;
  voiceCommands = voiceCommands.trim();
  voiceCommand.innerHTML = voiceCommands;

  if (voiceCommands == lightsStatus && lightsStatus == TURN_LIGHTS_OFF) {
    readOutLoud("lights are alredy off");
  } else if (voiceCommands == lightsStatus && lightsStatus == TURN_LIGHTS_ON) {
    readOutLoud("lights are alredy on");
  } else if (voiceCommands == TURN_LIGHTS_OFF) {
    sendData(TURN_LIGHTS_OFF);
  } else if (voiceCommands == TURN_LIGHTS_ON) {
    sendData(TURN_LIGHTS_ON);
  }
};

recognition.onspeechend = function () {
  recognition.stop();
};
// VOICE RECOGNITION END

const offBtn = document.getElementById("offBtn");
const onBtn = document.getElementById("onBtn");
const microphone = document.getElementById("microphone");
const voiceCommand = document.getElementById("voiceCommand");
const time = document.getElementById("time");
const video = document.getElementById("video");

function turnLightsOn() {
  readOutLoud("turning lights on");
  video.setAttribute("src", "media/on.mp4");
  onBtn.style.display = "none";
  offBtn.style.display = "block";
}

function turnLightsOff() {
  readOutLoud("turning lights off");
  video.setAttribute("src", "media/off.mp4");
  setTimeout(() => {
    video.setAttribute("src", "media/default.mp4");
    onBtn.style.display = "block";
    offBtn.style.display = "none";
  }, 2300);
}

// READ TEXT START
let speech = new SpeechSynthesisUtterance();
function readOutLoud(message) {
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}
// READ TEXT END

microphone.addEventListener("click", () => {
  readOutLoud("I'm listening");
  setTimeout(() => {
    recognition.start();
  }, 1800);
});

offBtn.addEventListener("click", () => {
  sendData(TURN_LIGHTS_OFF);
});

onBtn.addEventListener("click", () => {
  sendData(TURN_LIGHTS_ON);
});

function getCurrentTime() {
  const t = new Date();
  const hours = t.getHours();
  const minutes = t.getMinutes();
  const seconds = t.getSeconds();

  return `${hours}:${minutes}:${seconds}`;
}

function addNewTableRow(command) {
  let table = document.querySelector("table").getElementsByTagName("tbody")[0];
  let newRow = table.insertRow(table.rows.length);
  let htmlTemplate = `<tr><td>${getCurrentTime()}</td><td>${command}</td></tr>`;
  newRow.innerHTML = htmlTemplate;
}
