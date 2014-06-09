/**
 * Created by Hien on 6/2/2014.
 */

angular.module('creator.audio.service', [

])
    .service('audioSrv', function() {
        this.playAudio = function(url) {
            var mySound = soundManager.createSound({
                url: url
            });
            mySound.play();
        };

        this.checkSoundUrl = function(url) {
            var callback = arguments[1];
            var audio = new Audio();
            var timer;
            audio.oncanplay = function() {
                clearTimeout(timer);
                if (callback) callback(true);
            };
            audio.onerror = function() {
                clearTimeout(timer);
                if (callback) callback(false);
            };
            audio.src = url;
            timer = setTimeout(function() {
                audio.src = url;
                timer;
            }, 3000);
        };
    });