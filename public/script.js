function changeChannel(channel) {
    // Define the radio stream URLs for each channel
    var streamUrls = {
        '1': 'http://jenny.torontocast.com:8142/stream/1/',
        '2': 'http://sc4.easywebcommunications.com:18022/stream/1/',
        '3': 'http://158.69.114.190:8024/stream'
    };

    // Define the background colors for each channel
    var colors = {
        '1': 'red',
        '2': 'green',
        '3': 'blue'
    };

    // Change the background color
    document.body.style.backgroundColor = colors[channel];
    
    // Get the player div
    var playerDiv = document.getElementById('player');

    // Create the audio element for the radio player
    var playerAudio = document.createElement('audio');
    playerAudio.setAttribute('src', streamUrls[channel]);
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

