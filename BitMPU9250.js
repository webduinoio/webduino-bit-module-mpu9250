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
    this._startDetect = startDetect.bind(this);
    this._stopDetect = stopDetect.bind(this);
    this._stopDetectAll = stopDetectAll.bind(this);
    this._a_handlers = [];
    this._g_handlers = [];
    this._m_handlers = [];
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
        this._a_handlers.forEach(function (cb) {
          cb.call(null, info[1], info[2], info[3], t);
        });
        break;
      case 0x12: //gyroscope data
        this._g_handlers.forEach(function (cb) {
          cb.call(null, info[1], info[2], info[3], t);
        });
        break;
      case 0x13: //magnetometer data
        this._m_handlers.forEach(function (cb) {
          cb.call(null, info[1], info[2], info[3], t);
        });
        break;
    }
  }

  function startDetect(sensorType, handler) {
    if (typeof handler !== 'function') {
      return false;
    }
    switch (sensorType) {
      case MPU9250Event.ACCELEROMETER_MESSAGE:
        if (this._a_handlers.length === 0) {
          this._board.send(COMMAND.START_ACC);
        }
        this._a_handlers.push(handler);
        break;
      case MPU9250Event.GYROSCOPE_MESSAGE:
        if (this._g_handlers.length === 0) {
          this._board.send(COMMAND.START_GYR);
        }
        this._g_handlers.push(handler);
        break;
      case MPU9250Event.MAGNETOMETER_MESSAGE:
        if (this._m_handlers.length === 0) {
          this._board.send(COMMAND.START_MAG);
        }
        this._m_handlers.push(handler);
        break;
      default:
        return false;
        break;
    }
    return true;
  }

  function stopDetect(sensorType, handler) {
    switch (sensorType) {
      case MPU9250Event.ACCELEROMETER_MESSAGE:
        var idx = this._a_handlers.indexOf(handler);
        this._a_handlers.splice(idx, 1);
        if (this._a_handlers.length === 0) {
          this._board.send(COMMAND.STOP_ACC);
        }
        break;
      case MPU9250Event.GYROSCOPE_MESSAGE:
        var idx = this._g_handlers.indexOf(handler);
        this._g_handlers.splice(idx, 1);
        if (this._g_handlers.length === 0) {
          this._board.send(COMMAND.STOP_GYR);
        }
        break;
      case MPU9250Event.MAGNETOMETER_MESSAGE:
        var idx = this._m_handlers.indexOf(handler);
        this._m_handlers.splice(idx, 1);
        if (this._m_handlers.length === 0) {
          this._board.send(COMMAND.STOP_MAG);
        }
        break;
      default:
        return false;
        break;
    }
    return true;
  }

  function stopDetectAll(sensorType) {
    switch (sensorType) {
      case MPU9250Event.ACCELEROMETER_MESSAGE:
        this._a_handlers.length = 0;
        this._board.send(COMMAND.STOP_ACC);
        break;
      case MPU9250Event.GYROSCOPE_MESSAGE:
        this._g_handlers.length = 0;
        this._board.send(COMMAND.STOP_GYR);
        break;
      case MPU9250Event.MAGNETOMETER_MESSAGE:
        this._m_handlers.length = 0;
        this._board.send(COMMAND.STOP_MAG);
        break;
      default:
        return false;
        break;
    }
    return true;
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

  proto.on = function (sensorType, handler) {
    if (arguments.length !== 2) {
      return false;
    }
    var result = this._startDetect(sensorType, handler);
    if (result && this._state !== 'on') {
      this._state = 'on';
      this._board.send(COMMAND.START_DETECT);
      this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    }
  };

  proto.off = function (sensorType, handler) {
    var result;
    if (arguments.length === 1) {
      result = this._stopDetectAll(sensorType);
    } else {
      result = this._stopDetect(sensorType, handler);
    }
    if (result && !this._a_handlers.length && !this._g_handlers.length && !this._m_handlers.length) {
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