// pull in configuration files
var nconf = require('nconf');
// load environment variables
nconf.argv().env();
// load config files
nconf.file({ file: 'config.json' });

// include the functions to look up local UPC codes
var local_upc = require('./local_upc_lookup')
var remote_upc = require('./remote_upc_lookup')
var lcd = require('./adafruit_lcd')
// load the USB barcode scanner libraries
var usbScanner = require('node-usb-barcode-scanner').usbScanner;
var getDevices = require('node-usb-barcode-scanner').getDevices;
//get array of attached HID devices 
var connectedHidDevices = getDevices()
 
//initialize new usbScanner - vendorId is specific to the model of scanner
var scanner = new usbScanner({vendorId:1241});

//scanner emits a data event once a barcode has been read and parsed 
scanner.on("data", function(code){
  lookup_upc(code);        
});

// we'll use this to track of the code has been
// found in the various lookup services
var barcode_found;

function lookup_upc(upc_code) {
  barcode_found = false;
  lcd.display("looking up \x03\n"+upc_code);
  // console.log("Looking up UPC code "+upc_code+" ...\n");
  remote_upc.lookup(upc_code, function display_upc_code(err, upc_code, description) {
    if (err) {
      console.log(err.toString())
    } else {
      if (barcode_found) return;
      barcode_found = true;
      lcd.display(description)
    }
  });
  
  // look up this value in the local database
  local_upc.lookup(upc_code, function display_upc_code(err, upc_code, description) {
    if (err) {
      console.log(err.toString())
    } else {
      if (barcode_found) return;
      barcode_found = true;
      lcd.display(description)
    }
  });

  setTimeout(function() {
    if (!barcode_found) {
      lcd.display("Not found \x02");
    }
  },1000);

}

function display(message) {
  lcd.clear();
  lcd.display(message);
  // turn off the backlight after 3 seconds
  setTimeout(function(){ lcd.powersave(); }, 3000);
}

lcd.display("Ready to scan! \x01")
