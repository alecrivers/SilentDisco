// Define the radio stream URLs for each channel
var streamUrls = {
        '1': 'https://radio4.cdm-radio.com:18008/stream-mp3-Funk',	// funk
        '2': 'https://playerservices.streamtheworld.com/api/livestream-redirect/SMOOTH953_AAC48.aac', // current hits
        '3': 'https://streams.radiomast.io:443/0cef93cd-5974-43b1-868e-c739e81f4f2b',	// b&c, strong
        '4': 'https://eu10.fastcast4u.com:2650/stream/1/',	// b&c, mellow
        '5': 'https://sonic.portalfoxmix.cl/8002/stream', // classics
        '6': 'https://ors.cdnstream1.com/5214_128', // 80s
        '7': 'https://listen.181fm.com/181-oldschool_128k.mp3', // classic hip hop
        '8': 'https://strm112.1.fm/latino_mobile_mp3', // modern spanish
        '9': 'https://radio.metal-invasion.fr/radio/8000/stream.mp3', // death metal
        '10': 'https://mp3channels.webradio.antenne.de/punkrock', // "crazy taxi"-ish
        '11': 'https://jazzradio.ice.infomaniak.ch/jazz-wr04-128.mp3', // electroswing
};

// Define the background colors for each channel
var colors = {
    '1': 'red',	// red
    '2': '#bfef45',	// lime
    '3': '#42d4f4',	// cyan,
    '4': '#f04a00',	// orange
    '5': '#fffac8',	// yellow / beige
    '6': '#800000',	// maroon
    '7': '#000075', 	// navy
    '8': '#911eb4', 	// purple
    '9': '#000000',	// black
    '10': '#a9a9a9',	// gray
    '11': '#f032e6',	// pink
};

// Define the players for each channel
var players = {
};

var fadeStates = {
    '0': 1.0	// The landing page fade state
};

// Initialize the current channel to 1
var currentChannel = '1';
var numChannels = Object.keys(streamUrls).length;
// Define a step for fading (e.g. over 1 second)
var fadeStep = 0.2;

function startDisco() {
    // Hide the landing page content
    //document.getElementById('landing-page').style.display = 'none';

    console.log("Initializing...");
    
    // Create variables
    for (let i = 1; i <= numChannels; i++) {
    	fadeStates[i.toString()] = -1;
    	players[i.toString()] = null;
    }
    
    // Show the player
    document.getElementById('player').style.display = 'block';
    
    // Get the player div
    var playerDiv = document.getElementById('player');

    // For each channel, create an audio element for the radio player and add it to the player div
    for (var channel in streamUrls) {
        var playerAudio = document.createElement('audio');
        playerAudio.setAttribute('src', streamUrls[channel]);
        playerAudio.setAttribute('controls', '');
        playerAudio.setAttribute('autoplay', '');
        playerAudio.style.display = 'none';  // This hides the audio player
        playerAudio.volume = 0;
        playerDiv.appendChild(playerAudio);
        players[channel] = playerAudio;
    }

    // Set the initial background color
    document.body.style.backgroundColor = colors[currentChannel];
    
    // Add an event listener to the body that responds to click events
    document.body.addEventListener('click', changeChannel);
    
    // Start the fade system
    setInterval(handleFade, 50);
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function handleFade() {
   let status = ''
   for (let i = 0; i <= numChannels; i++) {
        if(i.toString() == currentChannel)
            fadeStates[i] = Math.min(fadeStates[i] + fadeStep, 1.0);
        else
            fadeStates[i] = Math.max(fadeStates[i] - fadeStep, -1.1);
        if(i == 0) {
            document.getElementById('landing-page').style.opacity = clamp(fadeStates[i], 0.0, 1.0);
        }
        else {
            let player = players[i];
            player.volume = clamp(fadeStates[i], 0.0, 1.0);
            //status += i + ": " + fadeStates[i] + " ~ " + player.volume + "   "
        }
    }
    //console.log(status);
}

function changeChannel() {
    if(fadeStates['0'] != -1.1) {
        console.log("Click while still fading into the player; ignoring.");
        return;
    }

    // Increment the current channel, then use modulo to wrap back to 1 after 3
    currentChannel = ((currentChannel % numChannels) + 1).toString();
    
    console.log("Changed channel to " + currentChannel);

    // Change the background color
    document.body.style.backgroundColor = colors[currentChannel];
}

