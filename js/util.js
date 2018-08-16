'use strict';

var util = util || {};

util.init = function() {
    
};

/*
  @deprecated
  Returns context listner after setting it up
  @function setContextListener
  @reference https://developer.mozilla.org/en-US/docs/Web/API/AudioListener
  @param [object] audioContext AudioContext
  @return [object] listener ContextListner
 */
util.setListenerPerson = function(audioContext) {
    var listener = audioContext.listener;
    listener.dopplerFactor = 1;
    listener.speedOfSound = 343.3;

    // https://developer.mozilla.org/en-US/docs/Web/API/AudioListener/setOrientation
    // First 3 params (x,y,z) : front vector : Direction of the face of the listener
    // Last 3 params (xUp,yUp,zUp) : up vector : Direction of the top of the listener's head OR direction the nose of the person pointing
    listener.setOrientation(0, 0, -1, 0, 1, 0);

    return listener;
};

/*
  Returns sound, after setup sound, loop, and connection to destination
  @function setupSound
  @param [object] audioContext AudioContext
  @param [object] panner PannerNode
  @param [object] bufferData Buffer of the source file
  @return [object] sound BufferSource
 */
util.setupSound = function(audioContext, panner, bufferData) {
    var sound = audioContext.createBufferSource();
    
    sound.buffer = bufferData;
    sound.loop = true; // true, false : whether sound to be played in loop
    sound.connect(panner);
    panner.connect(audioContext.destination);

    return sound;
};

/*
  Returns PannerNode(inherits properties from parent AudioNode) for the AudioContext
  @function getPannerNode
  @reference https://developer.mozilla.org/en-US/docs/Web/API/PannerNode
  @param [object] audioContext AudioContext
  @return [object] panner PannerNode
 */
util.getPannerNode = function(audioContext) {
    var panner = audioContext.createPanner();
    // Methods: setOrientation(1,0,0), setPosition(0,0,0)
    // Defaults are given
    // x,y,z: Right hand coordinate system
    
    panner.panningModel = 'HRTF'; // equalpower, HRTF
    panner.distanceModel = 'inverse'; // linear, exponential, inverse
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;
    panner.setOrientation(1, 0, 0);

    return panner;
};

/*
  Returns buffer of sounds which are loaded via AJAX
  @function loadSound
  @param [string] url The url of the sound to fetch
  @return [object] buffer The buffer of the sound
 */
util.loadSound = function(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function(e) {
        audioContext.decodeAudioData(request.response, function(buffer) {
            return buffer;
        });
    };
    request.send();
};

// util.getGyroData = function() {
//     if (window.innerWidth > 768) {
//         return;
//     }

//     // // Listen for orientation changes
//     // window.addEventListener("orientationchange", function() {
//     //     // Announce the new orientation number
//     //     //alert(window.orientation);
//     // }, false);

//     // On device orientation event for GYRO
//     window.ondeviceorientation = function(event) {
//         //if (!event.alpha) {return };
//         var alpha = Math.round(event.alpha),
//           beta = Math.round(event.beta),
//           gamma = Math.round(event.gamma),

//         //console.log(alpha, beta, gamma);
//         window.orientationData.alpha = alpha;
//         window.orientationData.beta = beta;
//         window.orientationData.gamma = gamma;

//         if (window.orientation == 0 || window.orientation == 180) {
//             window.orientationData.orientation = 'portrait';
//         } else {
//             window.orientationData.orientation = 'landscape';
//         }

//         // Setting up inital gyro data
//         if (window.orientationData.initialGyroData == undefined) {
//             window.orientationData.initialGyroData = {};
//             window.orientationData.initialGyroData = {
//                 alpha:alpha,
//                 beta:beta,
//                 gamma:gamma,
//                 orientation: window.orientationData.orientation
//             }
//         }
//         //gyroData.innerHTML = 'Gyro data: <br/>' + JSON.stringify(window.orientationData, null, '\t');
//         return window.orientationData;
//     };
// };




