+(function (window, webduino) {

  'use strict';

  window.getMPU9250 = function (board, pin, leds) {
    return new webduino.module.MPU9250(board);
  };

}(window, window.webduino));
