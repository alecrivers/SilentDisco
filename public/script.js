// Define the radio stream URLs for each channel
var streamUrls = {
        '1': 'https://eu10.fastcast4u.com:8120/stream/1/',
        '2': 'https://air.broadcastinggroup.ro/MegaHit',
        '3': 'https://s3.slotex.pl:7354/stream/1/'
};

// Define the background colors for each channel
var colors = {
    '1': 'red',
    '2': 'green',
    '3': 'blue'
};

// Define the players for each channel
var players = {
    '1': null,
    '2': null,
    '3': null
};

var fadeStates = {
    '0': 1.0,	// The landing page fade state
    '1': -1,
    '2': -1,
    '3': -1
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
            status += i + ": " + fadeStates[i] + " ~ " + player.volume + "   "
        }
    }
    console.log(status);
}

function changeChannel() {
    if(fadeStates['0'] != -1.1) {
        console.log("Click while still fading into the player; ignoring.");
        return;
    }

    // Increment the current channel, then use modulo to wrap back to 1 after 3
    currentChannel = ((currentChannel % 3) + 1).toString();
    
    console.log("Changed channel to " + currentChannel);

    // Change the background color
    document.body.style.backgroundColor = colors[currentChannel];
}

