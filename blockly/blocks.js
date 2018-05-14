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
      .appendField(new Blockly.FieldVariable('mpu9250'), 'name_')
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_DETECTED);
    this.appendStatementInput('detected_')
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['mpu9250_val'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable("mpu9250"), "name_")
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_S)
      .appendField(new Blockly.FieldDropdown([
        ["x_1", "_x1"],
        ["y_1", "_y1"],
        ["z_1", "_z1"],
        ["x_2", "_x2"],
        ["y_2", "_y2"],
        ["z_2", "_z2"],
        ["x_3", "_x3"],
        ["y_3", "_y3"],
        ["z_3", "_z3"],
      ]), "val_")
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_VAL);
    this.setOutput(true);
    this.setColour(35);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['mpu9250_stop'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable('mpu9250'), 'name_')
      .appendField(Blockly.Msg.WEBDUINO_MPU9250_STOP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
