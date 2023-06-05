var stations = [
  {
    // b&c, mellow
    "stream": 'https://eu10.fastcast4u.com:2650/stream/1/',
    "icon": "noun-vinyl-4463482.svg",
    "audio": "turntable.mp3",
    "background-color": "#bfef45",		// lime
    "icon-color": "#3b6e00" // dark lime
  },
  {
    // b&c, strong	robot
    "stream": 'https://streams.radiomast.io:443/0cef93cd-5974-43b1-868e-c739e81f4f2b',
    "icon": "noun-robot-1004193.svg",
    "audio": "robot.mp3",
    "background-color": "red",
    "icon-color": "#ff9999" // light red
  },
  {
    // Frome TuneIn. Pop Hits.	star with music
    "stream": 'https://rfcmedia.streamguys1.com/newpophits.mp3',
    "icon": "noun-stars-1171664.svg",
    "audio": "stars.mp3",
    "background-color": "#12748a",		// cyan
    "icon-color": "#42d4f4" // dark cyan
  },
  {
    // funk	disco ball
    "stream": 'https://radio4.cdm-radio.com:18008/stream-mp3-Funk',
    "icon": "noun-disco-5301484.svg",
    "audio": "mirror_ball.mp3",
    "background-color": "#f04a00",		// orange
    "icon-color": "#ff8c33" // light orange
  },
  {
    // classic hits	cassette
    "stream": 'https://tunein-music.streamguys1.com/JACKFM-direct',
    "icon": "noun-cassette-1134380.svg",
    "audio": "cassette.mp3",
    "background-color": "#fffac8",		// yellow / beige
    "icon-color": "#7f6b00" // dark yellow
  },
  {
    // 80s	rubik's cube
    "stream": 'https://ors.cdnstream1.com/5214_128',
    "icon": "noun-rubiks-cube-571725.svg",
    "audio": "rubiks_cube.mp3",
    "background-color": "#800000",		// maroon
    "icon-color": "#ff8080" // light maroon
  },
  {
    // classic hip hop		boom box
    "stream": 'https://listen.181fm.com/181-oldschool_128k.mp3',
    "icon": "noun-boom-box-4888853.svg",
    "audio": "boombox.mp3",
    "background-color": "#000075",		// navy
    "icon-color": "#7373ff" // light navy
  },
  {
    // modern spanish	tequila
    "stream": 'https://strm112.1.fm/latino_mobile_mp3',
    "icon": "noun-tequila-4764344.svg",
    "audio": "tequila.mp3",
    "background-color": "#911eb4",		// purple
    "icon-color": "#d69cf0" // light purple
  },
  {
    // heavy metal	pirate flag
    "stream": 'https://s6-webradio.rockantenne.de/heavy-metal/stream/mp3',
    "icon": "noun-pirate-flag-787807.svg",
    "audio": "jolly_roger.mp3",
    "background-color": "#000000",		// black
    "icon-color": "#ffffff" // white
  },
  {
    // electroswing	gramophone
    "stream": 'https://jazzradio.ice.infomaniak.ch/jazz-wr04-128.mp3',
    "icon": "noun-gramophone-3243255.svg",
    "audio": "gramophone.mp3",
    "background-color": "#f032e6",		// pink
    "icon-color": "#b30086" // dark pink
  }
];

  /*
  {
    // "crazy taxi"-ish	taxi
    "stream": 'https://mp3channels.webradio.antenne.de/punkrock',
    "icon": "noun-taxi-10379.svg",
    "audio": "taxi.mp3",
    "background-color": "#a9a9a9",		// gray
    "icon-color": "#4d4d4d" // dark gray
  },
  */
  
// Done

var currentChannel = undefined; // undefined indicates intro page
var numChannels = stations.length;
var initialized = false;
var fadeInterval = 20;    // In ms
let introFade = 1.0;
var fadeTime = 0.85; // In seconds
let fadeStep = (fadeInterval / 1000.0) / fadeTime;
console.log("Fade step: " + fadeStep);

let audio = new Audio();

function startDisco() {
    // Hide the landing page content
    //document.getElementById('landing-page').style.display = 'none';
    
    if(initialized == false) {
	    console.log("Initializing...");
	    
	    let pageContainer = document.getElementById("page-container");
	    
	    // Create variables
	    for (let i = 0; i < numChannels; i++) {
	        let station = stations[i];
	        station["fade"] = 0;
	        
	        // Create page
            let page = document.createElement('div');
            page.style.backgroundColor = station["background-color"];
            station["page"] = page;
            page.classList.add('page');
            
            let img = document.createElement('img');
            img.classList.add("svg-icon");
            img.src = "images/" + station["icon"];
            img.style.color = station["icon-color"];
            page.appendChild(img);
            
            // Create player
            var playerAudio = document.createElement('audio');
            station["player"] = playerAudio;
		    playerAudio.setAttribute('src', station["stream"]);
		    playerAudio.setAttribute('controls', '');
		    playerAudio.setAttribute('autoplay', '');
		    playerAudio.style.display = 'none';  // This hides the audio player
		    playerAudio.volume = 0;
		    page.appendChild(playerAudio);
		    
		    // Add page
		    page.style.display = "none";    // Hide initially
            pageContainer.appendChild(page);
        }
    
	    // Add an event listener to the body that responds to click events
	    document.body.addEventListener('click', changeChannel);
    
	    // Start the fade system
	    setInterval(handleFade, fadeInterval);
	    
	    initialized = true;
    }
    
    // Set us to the first channel
    currentChannel = 0;
    playCurrentChannelName();

    // Push a new state to the history
    history.pushState({ page: "disco" }, "", window.location.pathname);
}

// When the history changes...
window.addEventListener("popstate", function(event) {
    // For now assume we're going back to the main state.
    currentChannel = undefined;
});

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function playCurrentChannelName() {
    // If a sound is playing, stop it
    if (!audio.paused) {
        audio.pause();
        // To ensure the sound starts from the beginning when played again
        audio.currentTime = 0;
    }

    // Load the next sound
    audio.src = "audio/" + stations[currentChannel]["audio"];
    console.log("Playing " + audio.src);
    audio.play();
}

function handleFade() {
    let status = '';
   
    // Handle intro page specially
    if(currentChannel == undefined)
        introFade = Math.min(introFade + fadeStep, 1.0);
    else
        introFade = Math.max(introFade - fadeStep, 0);
    document.getElementById('landing-page').style.opacity = introFade;
    document.getElementById('landing-page').style.display = (introFade > 0) ? "block" : "none";

    // Now the station pages   
    for (let i = 0; i < numChannels; i++) {
        let station = stations[i];
        if(i == currentChannel)
            station["fade"] = Math.min(station["fade"] + fadeStep, 1.0);
        else
            station["fade"] = Math.max(station["fade"] - fadeStep, 0);
        station["page"].style.opacity = station["fade"]
        station["page"].style.display = (station["fade"] > 0) ? "flex" : "none";
        station["player"].volume = clamp((station["fade"] - 0.8) * 2.5, 0.0, 0.5);
        //status += i + ": " + station["fade"] + " ~ " + station["player"].volume + "   "
    }
    //console.log(status);
}

function changeChannel() {
    if(introFade > 0) {
        console.log("Click while still fading into the player; ignoring.");
        return;
    }

    currentChannel = ((currentChannel + 1) % numChannels);
    playCurrentChannelName();
    console.log("Changed channel to " + currentChannel);
}

// Wake lock stuff
let wakeLock = null;

// Function that attempts to request a screen wake lock
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Screen Wake Lock is active');
  } catch (err) {
    console.error(`Could not establish a wake lock (${err.name}: ${err.message})`);
  }
}

// Function to release the wake lock
const releaseWakeLock = () => {
  if (wakeLock !== null) {
    wakeLock.release()
    .then(() => {
      console.log('Screen Wake Lock was released');
      wakeLock = null;
    })
    .catch((err) => {
      console.error(`An error occurred while releasing the wake lock (${err.name}: ${err.message})`);
    });
  }
}

// Request a wake lock when the page loads
window.addEventListener('load', () => {
  if ('wakeLock' in navigator) {
    requestWakeLock();
  }
  else {
    console.log("Wake lock not supported :(");
    console.log(JSON.stringify(navigator));
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
