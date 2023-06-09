
// ### CONSTANTS & GLOBALS ###

var stations = [
  {
    // b&c, mellow
    "stream": 'https://eu10.fastcast4u.com:2650/stream/1/',
    "icon": "noun-vinyl-4463482.svg",
    "name_audio": "turntable.mp3",
    "background-color": "#bfef45",		// lime
    "icon-color": "#3b6e00" // dark lime
  },
  {
    // b&c, strong	robot
    "stream": 'https://streams.radiomast.io:443/0cef93cd-5974-43b1-868e-c739e81f4f2b',
    "icon": "noun-robot-1004193.svg",
    "name_audio": "robot.mp3",
    "background-color": "red",
    "icon-color": "#ff9999" // light red
  },
  {
    // Frome TuneIn. Pop Hits.	star with music
    "stream": 'https://rfcmedia.streamguys1.com/newpophits.mp3',
    "icon": "noun-stars-1171664.svg",
    "name_audio": "stars.mp3",
    "background-color": "#12748a",		// cyan
    "icon-color": "#42d4f4" // dark cyan
  },
  {
    // funk	disco ball
    "stream": 'https://radio4.cdm-radio.com:18008/stream-mp3-Funk',
    "icon": "noun-disco-5301484.svg",
    "name_audio": "mirror_ball.mp3",
    "background-color": "#f04a00",		// orange
    "icon-color": "#ff8c33" // light orange
  },
  {
    // classic hits	cassette
    "stream": 'https://tunein-music.streamguys1.com/JACKFM-direct',
    "icon": "noun-cassette-1134380.svg",
    "name_audio": "cassette.mp3",
    "background-color": "#fffac8",		// yellow / beige
    "icon-color": "#7f6b00" // dark yellow
  },
  {
    // 80s	rubik's cube
    "stream": 'https://ors.cdnstream1.com/5214_128',
    "icon": "noun-rubiks-cube-571725.svg",
    "name_audio": "rubiks_cube.mp3",
    "background-color": "#800000",		// maroon
    "icon-color": "#ff8080" // light maroon
  },
  {
    // classic hip hop		boom box
    "stream": 'https://listen.181fm.com/181-oldschool_128k.mp3',
    "icon": "noun-boom-box-4888853.svg",
    "name_audio": "boombox.mp3",
    "background-color": "#000075",		// navy
    "icon-color": "#7373ff" // light navy
  },
  {
    // modern spanish	tequila
    "stream": 'https://strm112.1.fm/latino_mobile_mp3',
    "icon": "noun-tequila-4764344.svg",
    "name_audio": "tequila.mp3",
    "background-color": "#911eb4",		// purple
    "icon-color": "#d69cf0" // light purple
  },
  {
    // heavy metal	pirate flag
    "stream": 'https://s6-webradio.rockantenne.de/heavy-metal/stream/mp3',
    "icon": "noun-pirate-flag-787807.svg",
    "name_audio": "jolly_roger.mp3",
    "background-color": "#000000",		// black
    "icon-color": "#ffffff" // white
  },
  {
    // electroswing	gramophone
    "stream": 'https://jazzradio.ice.infomaniak.ch/jazz-wr04-128.mp3',
    "icon": "noun-gramophone-3243255.svg",
    "name_audio": "gramophone.mp3",
    "background-color": "#f032e6",		// pink
    "icon-color": "#b30086" // dark pink
  }
];
var numChannels = stations.length;
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var audioBuffers = {};
var logToPage = false;

// ### HELPER FUNCTIONS ###

function logText(text) {
    if(logToPage) {
        var textElement = document.createElement('p');
        textElement.innerHTML = text;
        document.getElementById("text-container").appendChild(textElement);
    }
    console.log(text);
}

function logError(text) {
    if(logToPage) {
        var textElement = document.createElement('p');
        textElement.innerHTML = "ERROR: " + text;
        document.getElementById("text-container").appendChild(textElement);
    }
    console.error(text);
}

function loadAudioFile(url, name) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        audioContext.decodeAudioData(request.response,
            function(buffer) {
                // Store the decoded audio buffer
                audioBuffers[name] = buffer;
            },
            function() {
                logError('Decoding error for audio file: ' + url);
            }
        );
    };
    request.onerror = function() {
        logError('Network error while loading audio file: ' + url);
    };

    request.send();
}

function playAudio(name) {
    // Get the audio buffer
    var buffer = audioBuffers[name];
    if (!buffer) {
        logError('Audio file not loaded: ' + name);
        return undefined;
    }
    logText("Playing " + name);
    lastPlayedEnded = false;

    // Create an audio source and connect it to the destination
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    // Play the audio
    source.start();
    
    return source;
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function nextChannel(channel) {
    return (channel + 1) % numChannels;
}

// ### STATE MACHINE ###

class State {
    constructor(app) {
        this.app = app;
    }

    transition(newState) {
        logText("Transitioning from " + this.app.currentState.name() + " to " + newState.name());
        this.app.currentState = newState;
    }
}

class OnIntroWithStationsUninitializedState extends State {
    name() {
        return "OnIntroWithStationsUninitializedState";
    }
    
    startDisco() {
        if(this.app.currentState != this) return;    // Handle race conditions
	    
        // User interaction is required to start the AudioContext due to autoplay policies in some browsers
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        for (let i = 0; i < numChannels; i++) {
            stations[i]["audio"].muted = true;  // iOS doesn't seem to respect the takeover of the audio element... I have no idea why.
            stations[i]["audio"].play();
        }

        // Push a new state to the history
        history.pushState({ page: "disco" }, "", window.location.pathname);
        
        // Hide intro
        document.getElementById('landing-page').style.display = "none";
        
        this.transition(new PlayingChannelNameState(this.app, 0));
    }
}

class OnIntroWithStationsInitializedState extends State {
    constructor(app) {
        super(app);
        
        document.getElementById('landing-page').style.display = "block";
    }
    
    name() {
        return "OnIntroWithStationsInitializedState";
    }

    startDisco() {
        if(this.app.currentState != this) return;    // Handle race conditions
        
        document.getElementById('landing-page').style.display = "none";
        
        // Push a new state to the history
        history.pushState({ page: "disco" }, "", window.location.pathname);
        
        this.transition(new PlayingChannelNameState(this.app, 0));
    }
}

class PlayingChannelNameState extends State {
    constructor(app, channel) {
        super(app);
        this.channel = channel;
        
        stations[this.channel]["page"].style.display = "flex";
        
        let ret = playAudio(stations[this.channel]["name_audio"]);
        if(ret == undefined) {
            // Yikes! Presumably the name audio hasn't loaded yet? Just go straight to the station.
            this.transition(new PlayingChannelState(this.app, this.channel));
        }
        else {
            this.source = ret;
        
            this.source.addEventListener("ended", () => {
                this.finish();
            });
        }
    }
    
    name() {
        return "PlayingChannelNameState(" + this.channel + ")";
    }

    finish() {
        if(this.app.currentState != this) return;    // Handle race conditions
        
        this.source.disconnect(audioContext.destination);
        
        this.transition(new PlayingChannelState(this.app, this.channel));
    }
    
    changeChannel() {
        if(this.app.currentState != this) return;    // Handle race conditions
        
        this.source.disconnect(audioContext.destination);
        this.source.stop();
        stations[this.channel]["page"].style.display = "none";
        
        this.transition(new PlayingChannelNameState(this.app, nextChannel(this.channel)));
    }
    
    goToIntro() {
        if(this.app.currentState != this) return;    // Handle race conditions
        
        this.source.disconnect(audioContext.destination);
        this.source.stop();
        
        this.transition(new OnIntroWithStationsInitializedState(this.app));
    }
}

class PlayingChannelState extends State {
    constructor(app, channel) {
        super(app);
        this.channel = channel;
        
        stations[this.channel]["source"].connect(audioContext.destination);
        stations[this.channel]["audio"].muted = false;  // iOS doesn't seem to respect the takeover of the audio element... I have no idea why.
    }
    
    name() {
        return "PlayingChannelState(" + this.channel + ")";
    }

    changeChannel() {
        if(this.app.currentState != this) return;    // Handle race conditions
        
        stations[this.channel]["source"].disconnect(audioContext.destination);
        stations[this.channel]["audio"].muted = true;  // iOS doesn't seem to respect the takeover of the audio element... I have no idea why.
        stations[this.channel]["page"].style.display = "none";
        
        this.transition(new PlayingChannelNameState(this.app, nextChannel(this.channel)));
    }
    
    goToIntro() {
        if(this.app.currentState != this) return;    // Handle race conditions
        
        stations[this.channel]["source"].disconnect(audioContext.destination);
        stations[this.channel]["audio"].muted = true;  // iOS doesn't seem to respect the takeover of the audio element... I have no idea why.
        stations[this.channel]["page"].style.display = "none";
        
        this.transition(new OnIntroWithStationsInitializedState(this.app));
    }
}

class App {
    constructor() {
        logText("Initializing...");
        
        // Handle start button
        document.getElementById("start-button").addEventListener('click', () => { this.currentState.startDisco(); });

        // Handle back button
        window.addEventListener("popstate", () => { this.currentState.goToIntro(); });
        
        // Create elements
        let pageContainer = document.getElementById("page-container");
        
        // Create variables
        for (let i = 0; i < numChannels; i++) {
            let station = stations[i];
            station["fade"] = 0;
            
            // Create page
            let page = document.createElement('div');
            pageContainer.appendChild(page);
            page.style.backgroundColor = station["background-color"];
            page.style.display = "none";
            page.addEventListener('click', () => { this.currentState.changeChannel(); });
            station["page"] = page;
            page.classList.add('page');
            
            let img = document.createElement('img');
            img.classList.add("svg-icon");
            img.src = "images/" + station["icon"];
            img.style.color = station["icon-color"];
            page.appendChild(img);
            
            // Create player
            var audioElement = new Audio();
            station["audio"] = audioElement;
            audioElement.crossOrigin = "anonymous";
            audioElement.src = station["stream"];
            var source = audioContext.createMediaElementSource(audioElement);
            station["source"] = source;
            
            // Load the station name
            loadAudioFile("audio/" + station["name_audio"], station["name_audio"]);
        }
        
        this.currentState = new OnIntroWithStationsUninitializedState(this);
    }
}

let app = new App();

// ### WAKE LOCK STUFF ###

let wakeLock = null;

// Function that attempts to request a screen wake lock
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    logText('Screen Wake Lock is active');
  } catch (err) {
    logError(`Could not establish a wake lock (${err.name}: ${err.message})`);
  }
}

// Function to release the wake lock
const releaseWakeLock = () => {
  if (wakeLock !== null) {
    wakeLock.release()
    .then(() => {
      logText('Screen Wake Lock was released');
      wakeLock = null;
    })
    .catch((err) => {
      logError(`An error occurred while releasing the wake lock (${err.name}: ${err.message})`);
    });
  }
}

// Request a wake lock when the page loads
window.addEventListener('load', () => {
  if ('wakeLock' in navigator) {
    requestWakeLock();
  }
  else {
    logError("Wake lock not supported :( Navigator: " + JSON.stringify(navigator));
  }
});

// Release the wake lock when the page is unloaded
window.addEventListener('unload', () => {
  releaseWakeLock();
});

// Reacquire the lock when the visibility of the page changes
document.addEventListener('visibilitychange', () => {
  if ('wakeLock' in navigator && document.visibilityState === 'visible') {
    requestWakeLock();
  }
});
