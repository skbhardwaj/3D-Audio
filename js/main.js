'use strict';

var main = main || {};

main.bindEvents = function($body) {
    $body.find('.play').on('click', function(e) {
        console.log(this);
    });

    $body.find('.stop').on('click', function(e) {
        console.log(this);
    });

    $body.find('.left').on({
        'mousedown' : function(e) {
            console.log(e);
            main.moveLeft(e);
        },
        'mouseup'   : function(e) {
            console.log(e);
            window.cancelAnimationFrame(zoomOutLoop);
            zVel = 0;
            panner.setVelocity(0, 0, 0);
        }
    });

    $body.find('.right').on({
        'mousedown' : function(e) {
            console.log(e);
            main.moveRight(e);
        },
        'mouseup'   : function(e) {
            console.log(e);
            window.cancelAnimationFrame(zoomOutLoop);
            zVel = 0;
            panner.setVelocity(0, 0, 0);
        }
    });

    $body.find('.zoom-in').on({
        'mousedown' : function(e) {
            console.log(e);
            main.zoomIn(e);
        },
        'mouseup'   : function(e) {
            console.log(e);
            window.cancelAnimationFrame(zoomOutLoop);
            zVel = 0;
            panner.setVelocity(0, 0, 0);
        }
    });

    $body.find('.zoom-out').on({
        'mousedown' : function(e) {
            console.log(e);
            main.zoomOut(e);
        },
        'mouseup'   : function(e) {
            console.log(e);
            window.cancelAnimationFrame(zoomOutLoop);
            zVel = 0;
            panner.setVelocity(0, 0, 0);
        }
    });
};

main.moveLeft = function() {

};

main.init = function($body) {
    console.log($body);
    util.init();
    main.bindEvents($body);
};

//main.init($('body')); 
    