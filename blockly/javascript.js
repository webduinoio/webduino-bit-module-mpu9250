Blockly.JavaScript['mpu9250_new'] = function (block) {
  var code = 'getMPU9250(board, 6)';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['mpu9250_detected'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_type_ = block.getFieldValue('type_');
  var statements_do_ = Blockly.JavaScript.statementToCode(block, 'do_');
  var code = variable_name_ + '.on(' + dropdown_type_ +', async function ( _x, _y, _z) {\n' +
    '  ' + variable_name_ + '._x = _x;\n' +
    '  ' + variable_name_ + '._y = _y;\n' +
    '  ' + variable_name_ + '._z = _z;\n' +
    statements_do_ +
    '});\n';
  return code;
};

Blockly.JavaScript['mpu9250_val'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_val_ = block.getFieldValue('val_');
  var code = variable_name_ + '.' + dropdown_val_
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['mpu9250_stop'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var dropdown_type_ = block.getFieldValue('type_');
  var code = variable_name_ + '.off(' + dropdown_type_ + ');\n';
  return code;
};

Blockly.JavaScript['mpu9250_detectTime'] = function (block) {
  var variable_matrix_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var value_detectTime_ = Blockly.JavaScript.valueToCode(block, 'detectTime_', Blockly.JavaScript.ORDER_ATOMIC);
  var code = variable_matrix_ + '.setDetectTime(' + value_detectTime_ + ');\n';
  return code;
};