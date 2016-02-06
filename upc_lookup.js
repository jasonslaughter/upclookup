// pull in configuration files
var nconf = require('nconf');
// load environment variables
nconf.argv().env();
// load config files
nconf.file({ file: 'config.json' });

// include the functions to look up local UPC codes
var local_upc = require('./local_upc_lookup')
var remote_upc = require('./remote_upc_lookup')
// load the USB barcode scanner libraries
var usbScanner = require('node-usb-barcode-scanner').usbScanner;
var getDevices = require('node-usb-barcode-scanner').getDevices;

//get array of attached HID devices 
var connectedHidDevices = getDevices()
 
//initialize new usbScanner - takes optional parmeters vendorId and hidMap - check source for details 
var scanner = new usbScanner({vendorId:1241});

//scanner emits a data event once a barcode has been read and parsed 
scanner.on("data", function(code){
  lookup_upc(code);        
});

function lookup_upc(upc_code) {
  console.log("Looking up UPC code "+upc_code+" ...\n");
  remote_upc.lookup(upc_code, function display_upc_code(err, upc_code, description) {
    if (err) {
      console.log(err.toString())
    } else {
      console.log(description);
    }
  });
  
  // look up this value in the local database
  local_upc.lookup(upc_code, function display_upc_code(err, upc_code, description) {
    if (err) {
      console.log(err.toString())
    } else {
      console.log(description);
    }
  });

}
