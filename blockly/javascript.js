Blockly.JavaScript['mpu9250_new'] = function (block) {
  var code = 'getMPU9250(board, 6)';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['mpu9250_detected'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var statements_detected_ = Blockly.JavaScript.statementToCode(block, 'detected_');
  var code = variable_name_ + '.measure(async function (val) {\n' +
    '  ' + variable_name_ + '.detectedVal = val;\n' +
    statements_detected_ +
    '});\n';
  return code;
};

Blockly.JavaScript['mpu9250_val'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.detectedVal';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['mpu9250_stop'] = function (block) {
  var variable_name_ = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name_'), Blockly.Variables.NAME_TYPE);
  var code = variable_name_ + '.off();\n';
  return code;
};
