+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var MPU9250Event = {
    ACCELEROMETER_MESSAGE: 'a',
    GYROSCOPE_MESSAGE: 'g',
    MAGNETOMETER_MESSAGE: 'm',
  };

  var COMMAND = {
    "START_DETECT": [0xf0, 0x04, 0x60, 0x02 /*start*/, 0xf7],
    "STOP_DETECT": [0xf0, 0x04, 0x60, 0x03, 0xf7],
    "START_ACC": [0xf0, 0x04, 0x60, 0x11, 0x1, 0xf7],
    "STOP_ACC": [0xf0, 0x04, 0x60, 0x11, 0x0, 0xf7],
    "START_GYR": [0xf0, 0x04, 0x60, 0x12, 0x1, 0xf7],
    "STOP_GYR": [0xf0, 0x04, 0x60, 0x12, 0x0, 0xf7],
    "START_MAG": [0xf0, 0x04, 0x60, 0x13, 0x1, 0xf7],
    "STOP_MAG": [0xf0, 0x04, 0x60, 0x13, 0x0, 0xf7]
  };

  /**
   * The MPU9250 class.
   * @namespace webduino.module
   * @class MPU9250
   * @constructor
   * @param {webduino.Board} board The board that the MPU9250 accelerometer is attached to.
   * @extends webduino.Module
   */
  function MPU9250(board) {
    Module.call(this);
    this._board = board;
    this._detectTime = 250;
    this._messageHandler = onMessage.bind(this);
    this._callbackNum = 0;
    this._a_callback = function (x, y, z, t) { };
    this._g_callback = function (x, y, z, t) { };
    this._m_callback = function (x, y, z, t) { };
  }

  function parseMPU9250Info(q) {
    if (q[0] != 0x60) return "";
    var info = String.fromCharCode(q[1] + 0x20) + " ";
    var xType = q[1];
    for (var i = 2; i < q.length; i++) {
      info += String.fromCharCode(q[i]);
    }
    info = info.trim().split(/\s+/);
    return info;
  }

  function onMessage(event) {
    var msg = event.message;
    if (msg[0] != 0x60) return;
    var info = parseMPU9250Info(msg);
    var t = new Date().getTime();
    switch (msg[1]) {
      case 0x02: //start
        console.log("Start mpu9250 detect...");
        break;
      case 0x03: //stop
        console.log("Stop mpu9250 detect.");
        break;
      case 0x11: //accelerometer data
        this._a_callback(info[1], info[2], info[3], t);
        break;
      case 0x12: //gyroscope data
        this._g_callback(info[1], info[2], info[3], t);
        break;
      case 0x13: //magnetometer data
        this._m_callback(info[1], info[2], info[3], t);
        break;
    }
  }

  MPU9250.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: MPU9250
    },
    state: {
      get: function () {
        return this._state;
      },
      set: function (val) {
        this._state = val;
      }
    }
  });

  proto.startDetectAccelerometer = function (callback) {
    this._a_callback = callback;
    this._board.send(COMMAND.START_ACC);
    this._callbackNum++;
  }

  proto.startDetectGyroscope = function (callback) {
    this._g_callback = callback;
    this._board.send(COMMAND.START_GYR);
    this._callbackNum++;
  }

  proto.startDetectMagnetometer = function (callback) {
    this._m_callback = callback;
    this._board.send(COMMAND.START_MAG);
    this._callbackNum++;
  }

  proto.stopDetectAccelerometer = function () {
    this._a_callback = function (x, y, z, t) { };
    this._board.send(COMMAND.STOP_ACC);
    this._callbackNum--;
  }

  proto.stopDetectGyroscope = function () {
    this._g_callback = function (x, y, z, t) { };
    this._board.send(COMMAND.STOP_GYR);
    this._callbackNum--;
  }

  proto.stopDetectMagnetometer = function () {
    this._m_callback = function (x, y, z, t) { };
    this._board.send(COMMAND.STOP_MAG);
    this._callbackNum--;
  }

  proto.on = function (sensorType, callback) {
    if (arguments.length !== 2) {
      return false;
    }
    switch (sensorType) {
      case MPU9250Event.ACCELEROMETER_MESSAGE:
        this.startDetectAccelerometer(callback);
        break;
      case MPU9250Event.GYROSCOPE_MESSAGE:
        this.startDetectGyroscope(callback);
        break;
      case MPU9250Event.MAGNETOMETER_MESSAGE:
        this.startDetectMagnetometer(callback);
        break;
      default:
        return false;
        break;
    }
    if (this._state !== 'on') {
      this._state = 'on';
      this._board.send(COMMAND.START_DETECT);
      this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    }
  };

  proto.off = function (sensorType) {
    switch (sensorType) {
      case MPU9250Event.ACCELEROMETER_MESSAGE:
        this.stopDetectAccelerometer();
        break;
      case MPU9250Event.GYROSCOPE_MESSAGE:
        this.stopDetectGyroscope();
        break;
      case MPU9250Event.MAGNETOMETER_MESSAGE:
        this.stopDetectMagnetometer();
        break;
      default:
        return false;
        break;
    }

    if (this._callbackNum === 0) {
      this._state = 'off';
      this._board.send(COMMAND.STOP_DETECT);
      this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    }
  };

  proto.setDetectTime = function (detectTime) {
    if (detectTime !== this._detectTime) {
      this._detectTime = detectTime;
      this._board.send([0xf0, 0x04, 0x60, 0x01, detectTime, 0xf7]);
    }
  };

  scope.module.MPU9250 = MPU9250;
  scope.module.MPU9250Event = MPU9250Event;
}));