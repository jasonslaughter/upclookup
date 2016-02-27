// initialize the adafruit-i2c-lcd library
var LCDPLATE, lcd;
LCDPLATE = require('adafruit-i2c-lcd').plate;
lcd = new LCDPLATE(1, 0x20);

// smiley face
lcd.createChar(1, [0,0,10,0,17,14,0,0]);
// frowny face
lcd.createChar(2, [0,0,10,0,0,14,17,0]);
// clock
lcd.createChar(3, [0,14,21,23,17,14,0,0]);
//

exports.powersave = function() {
  lcd.backlight(lcd.colors.OFF);
}

exports.clear = function() {
  lcd.clear();
  lcd.backlight(lcd.colors.BLUE);
}

exports.display = function(message) {
  exports.clear();
  if (typeof message === 'undefined') {
    return false;
  }
  if (message.indexOf("\n") < 0 && message.length > 16) {
      var message = message.slice(0, 16) + "\n" + message.slice(16);
  }
  lcd.message(message);
  return true;
}
