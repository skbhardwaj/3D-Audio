// 'use strict';

// var app = app || {};

// function AudioController() {
//     window.AudioContext = window.AudioContext || window.webkitAudioContext;
// }

// AudioController.prototype = {
//     getContext : function() {
//         console.log(this);
//     }
// };

// app.init = function() {
//     app.initAudioController();
// };

// app.initAudioController = function() {
//     var audioCtrl = new AudioController();
//     audioCtrl.getContext();
// };

// app.init();




/*
========================================================================================================================
 */

// define variables

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

var panner = util.getPannerNode(audioCtx);
var listener = util.setListenerPerson(audioCtx);

// Note that the above three features have been deprecated
// in recent versions of the spec (mid April 2015 onwards)


var soundFiles = ['audio/drums.ogg', 'audio/flute.mp3', 'audio/guitar.mp3', 'audio/piano.mp3', 'audio/light.mp3', 'audio/viper.ogg'];
var soundBuffers = [];
var sounds = [];
window.orientationData = {
    alpha:0,
    beta:0,
    gamma:0,
    orientation:'test',
    initialGyroData: undefined
};

var source;
var myBuffer;
var play = document.querySelector('.play');
var stop = document.querySelector('.stop');

var boomBox = document.querySelector('.boom-box');

var listenerData = document.querySelector('.listener-data');
var pannerData = document.querySelector('.panner-data');
var gyroData = document.querySelector('.gyro-data');
var mousePanButton = document.querySelector('.mousepan');

// set up listener and panner position information
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var xPos = WIDTH / 2;
var yPos = HEIGHT / 2;
var zPos = 295;

var leftBound = (-xPos) + 50;
var rightBound = xPos - 50;

// Only x and z velocity needed, as the listener only moves left and right and in and out in this example. Never up and down.
var xVel = 0;
var zVel = 0;

var xIterator = WIDTH / 150;

// listener will always be in the same place for this demo
listener.setPosition(xPos, yPos, 300);
listenerData.innerHTML = 'Listener data: X ' + xPos + ' Y ' + yPos + ' Z ' + 300;
pannerData.innerHTML = 'Panner data: X ' + xPos + ' Y ' + yPos + ' Z ' + zPos;

// panner will move as the boombox graphic moves around on the screen
function positionPanner() {
    //console.log(xPos, yPos, zPos);
    panner.setPosition(xPos, yPos, zPos);
    panner.setVelocity(xVel, 0, zVel);
    pannerData.innerHTML = 'Panner data: X ' + xPos + ' Y ' + yPos + ' Z ' + zPos;
}

function setGyroData() {
    // // Listen for orientation changes
    // window.addEventListener("orientationchange", function() {
    //     // Announce the new orientation number
    //     //alert(window.orientation);
    // }, false);

    // On device orientation event for GYRO
    window.ondeviceorientation = function(event) {
        //if (!event.alpha) {return };
        alpha = Math.round(event.alpha);
        beta = Math.round(event.beta);
        gamma = Math.round(event.gamma);

        //console.log(alpha, beta, gamma);
        window.orientationData.alpha = alpha;
        window.orientationData.beta = beta;
        window.orientationData.gamma = gamma;

        if (window.orientation === 0 || window.orientation === 180) {
            window.orientationData.orientation = 'portrait';
        } else {
            window.orientationData.orientation = 'landscape';
        }

        // Setting up inital gyro data
        if (window.orientationData.initialGyroData === undefined) {
            window.orientationData.initialGyroData = {};
            window.orientationData.initialGyroData = {
                alpha:alpha,
                beta:beta,
                gamma:gamma,
                orientation: window.orientationData.orientation
            };
        }
        gyroData.innerHTML = 'Gyro data: <br/>' + JSON.stringify(window.orientationData, null, '\t');

    };
}

if (WIDTH <= 768) {
    setGyroData();
}

function mouselistener(e) {
    var listnerX = WIDTH / 2;
    var moved = (e.clientX / window.innerWidth) * 2 - 1;
    //console.log(moved);
    // xPos += -0.066; // moveright
    // xPos += 0.066; // moveleft
    xPos = moved * 10 + listnerX;
    positionPanner();
}

mousePanButton.onclick = function(event) {
    var mousepan = event.target.checked;
    if (mousepan) {
        play.click();
        document.addEventListener('mousemove', mouselistener, false);
    } else {
        document.removeEventListener('mousemove', mouselistener, false);
        xPos = WIDTH / 2;
        positionPanner();
        stop.click();
    }
};


// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source

function getData() {
    source = audioCtx.createBufferSource();
    var request = new XMLHttpRequest();

    request.open('GET', soundFiles[5], true);

    request.responseType = 'arraybuffer';

    request.onload = function(data) {
        var audioData = request.response;

        audioCtx.decodeAudioData(audioData, function(buffer) {
            myBuffer = buffer;
            source.buffer = myBuffer;
            
            console.log(myBuffer.sampleRate, myBuffer.duration, myBuffer.length, myBuffer.numberOfChannels);
            
            source.connect(panner);
            panner.connect(audioCtx.destination);
            positionPanner();
            source.loop = true;
        },
        function(e) {
            'Error with decoding audio data' + e.err;
        });

    }

    request.send();
}

// wire up buttons to stop and play audio

var pulseWrapper = document.querySelector('.pulse-wrapper');

play.onclick = function() {
    getData();
    
    //source.start(0);
    startPlaying();

    play.setAttribute('disabled', 'disabled');
    pulseWrapper.classList.add('pulsate');
}

stop.onclick = function() {
    //console.log(source);
    
    //source.stop(0);
    stopPlaying();

    play.removeAttribute('disabled');
    pulseWrapper.classList.remove('pulsate');
}

function startPlaying() {
    source.start(0);
}

function stopPlaying() {
    source.stop(0);
}

// controls to move left and right past the boom box
// and zoom in and out

var leftButton = document.querySelector('.left');
var rightButton = document.querySelector('.right');
var zoomInButton = document.querySelector('.zoom-in');
var zoomOutButton = document.querySelector('.zoom-out');

var boomX = 0;
var boomY = 0;
var boomZoom = 0.25;

function moveRight() {
    boomX += -xIterator;
    xPos += -0.066;
    xVel = 17;

    if (boomX <= leftBound) {
        boomX = leftBound;
        xPos = (WIDTH / 2) - 5;
    }
  
    boomBox.style.webkitTransform = "translate(" + boomX + "px , " + boomY + "px) scale(" + boomZoom + ")";
    boomBox.style.transform = "translate(" + boomX + "px , " + boomY + "px) scale(" + boomZoom + ")";
    positionPanner();
    rightLoop = requestAnimationFrame(moveRight);
    return rightLoop;
}

function moveLeft() {
    boomX += xIterator;
    xPos += 0.066;
    xVel = -17;

    if (boomX > rightBound) {
        boomX = rightBound;
        xPos = (WIDTH / 2) + 5;
    }

    positionPanner();
    boomBox.style.webkitTransform = "translate(" + boomX + "px , " + boomY + "px) scale(" + boomZoom + ")";
    boomBox.style.transform = "translate(" + boomX + "px , " + boomY + "px) scale(" + boomZoom + ")";
    leftLoop = requestAnimationFrame(moveLeft);
    return leftLoop;
}

function zoomIn() {
    boomZoom += 0.05;
    zPos += 0.066;
    zVel = 17;

    if (boomZoom > 4) {
        boomZoom = 4;
        zPos = 299.9;
    }
  
    positionPanner();
    boomBox.style.webkitTransform = "translate(" + boomX + "px , " + boomY + "px) scale(" + boomZoom + ")";
    boomBox.style.transform = "translate(" + boomX + "px , " + boomY + "px) scale(" + boomZoom + ")";
    zoomInLoop = requestAnimationFrame(zoomIn);
    return zoomInLoop;
}

function zoomOut() {
    boomZoom += -0.05;
    zPos += -0.066;
    zVel = -17;
  
    if (boomZoom <= 0.25) {
        boomZoom = 0.25;
        zPos = 295;
    }
  
    positionPanner();
    boomBox.style.webkitTransform = "translate(" + boomX + "px , " + boomY + "px) scale(" + boomZoom + ")";
    boomBox.style.transform = "translate(" + boomX + "px , " + boomY + "px) scale(" + boomZoom + ")";
    zoomOutLoop = requestAnimationFrame(zoomOut);
    return zoomOutLoop;
}

// In each of the cases below, onmousedown runs the functions above
// onmouseup cancels the resulting requestAnimationFrames.

leftButton.onmousedown = moveLeft;
leftButton.onmouseup = function() {
    window.cancelAnimationFrame(leftLoop);
    xVel = 0;
    panner.setVelocity(0, 0, 0);
}

rightButton.onmousedown = moveRight;
rightButton.onmouseup = function() {
    window.cancelAnimationFrame(rightLoop);
    xVel = 0;
    panner.setVelocity(0, 0, 0);
}

zoomInButton.onmousedown = zoomIn;
zoomInButton.onmouseup = function() {
    window.cancelAnimationFrame(zoomInLoop);
    zVel = 0;
    panner.setVelocity(0, 0, 0);
}

zoomOutButton.onmousedown = zoomOut;
zoomOutButton.onmouseup = function() {
    window.cancelAnimationFrame(zoomOutLoop);
    zVel = 0;
    panner.setVelocity(0, 0, 0);
}
