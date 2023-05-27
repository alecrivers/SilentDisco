// Keep track of the current channel
var currentChannel = 0;

function changeChannel() {
    // Increment the current channel, then use modulo to wrap back to 1 after 3
    currentChannel = (currentChannel % 3) + 1;

    // Define the radio stream URLs for each channel
    var streamUrls = {
        '1': 'https://eu10.fastcast4u.com:8120/stream/1/',
        '2': 'https://ssl1.viastreaming.net:7005/stream/1/',
        '3': 'https://kathy.torontocast.com:2800/stream/1/'
    };

    // Define the background colors for each channel
    var colors = {
        '1': 'red',
        '2': 'green',
        '3': 'blue'
    };

    // Change the background color
    document.body.style.backgroundColor = colors[currentChannel];
    
    // Get the player div
    var playerDiv = document.getElementById('player');

    // Create the audio element for the radio player
    var playerAudio = document.createElement('audio');
    playerAudio.setAttribute('src', streamUrls[currentChannel]);
    playerAudio.setAttribute('controls', '');
    playerAudio.setAttribute('autoplay', '');
    playerAudio.style.display = 'none';  // This hides the audio player

    // Remove any existing audio elements from the player div
    while (playerDiv.firstChild) {
        playerDiv.firstChild.remove();
    }

    // Add the new audio element to the player div
    playerDiv.appendChild(playerAudio);
}
