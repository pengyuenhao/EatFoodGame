"use strict";

var _frameRate = 60;
cc.game.setFrameRate = function (frameRate) {
    _frameRate = frameRate;
    wx.setPreferredFramesPerSecond(frameRate);
};

cc.game.getFrameRate = function () {
    return _frameRate;
};

cc.game._runMainLoop = function () {
    var self = this,
        _callback,
        config = self.config,
        director = cc.director,
        skip = true,
        frameRate = config.frameRate;

    cc.debug.setDisplayStats(config.showFPS);

    _callback = function callback() {
        if (!self._paused) {
            self._intervalId = window.requestAnimFrame(_callback);
            director.mainLoop();
        }
    };

    self._intervalId = window.requestAnimFrame(_callback);
    self._paused = false;
};