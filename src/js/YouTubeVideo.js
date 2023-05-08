import React from 'react';
import YouTube from 'react-youtube';

function YouTubeVideo() {
    const videoId = 'jyQiAA_O9pA';
    const opts = {
        height: "150px",
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };
    return (
        <div style={{marginBottom: "2px"}}>
            < YouTube videoId={videoId} opts={opts}/>
        </div>
    );
}

export default YouTubeVideo;
