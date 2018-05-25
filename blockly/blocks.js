var mainUrl = 'https://tutorials.webduino.io/zh-tw/docs/';
var utmUrl = '?utm_source=cloud-blockly&utm_medium=contextMenu&utm_campaign=tutorials';

Blockly.Blocks['mpu9250_new'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_MPU9250);
    this.setOutput(true);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['mpu9250_detected'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable("mpu9250"), "name_")
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_DETECTED)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_MPU9250_ACCELEROMETER, 'webduino.module.MPU9250Event.ACCELEROMETER_MESSAGE'], 
        [Blockly.Msg.WEBDUINO_MPU9250_GYROSCOPE, 'webduino.module.MPU9250Event.GYROSCOPE_MESSAGE'], 
        [Blockly.Msg.WEBDUINO_MPU9250_MAGNETOMETER, 'webduino.module.MPU9250Event.MAGNETOMETER_MESSAGE']
      ]), 'type_');
    this.appendStatementInput("do_")
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['mpu9250_val'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable("mpu9250"), "name_")
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_S)
      .appendField(new Blockly.FieldDropdown([
        ["x", "_x"], ["y", "_y"], ["z", "_z"]
      ]), "val_")
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_VAL);
    this.setOutput(true, null);
    this.setColour(35);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['mpu9250_stop'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable('mpu9250'), 'name_')
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_STOP)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.WEBDUINO_MPU9250_ACCELEROMETER, 'webduino.module.MPU9250Event.ACCELEROMETER_MESSAGE'],
        [Blockly.Msg.WEBDUINO_MPU9250_GYROSCOPE, 'webduino.module.MPU9250Event.GYROSCOPE_MESSAGE'],
        [Blockly.Msg.WEBDUINO_MPU9250_MAGNETOMETER, 'webduino.module.MPU9250Event.MAGNETOMETER_MESSAGE']
      ]), 'type_');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['mpu9250_detectTime'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_SET)
      .appendField(new Blockly.FieldVariable('mpu9250'), 'name_')
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_DETECTTIME)
      .appendField(new Blockly.FieldDropdown([
        ["150", "0"],
        ["200", "1"],
        ["250", "2"],
        ["500", "3"],
        ["1000", "4"]
      ]), 'detectTimeType_')
      .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
