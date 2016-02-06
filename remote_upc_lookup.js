// initialize the REST client for talking to the UPC database
var Client = require('node-rest-client').Client;
client = new Client();

var nconf = require('nconf');
// pull the URL and API keys from the conf file
var upc_url = nconf.get("upc_databases:upcdatabase.org:url");
var upc_api_key = nconf.get("upc_databases:upcdatabase.org:api_key");

exports.lookup = function (input_upc_code, callback) {
  upc_code = input_upc_code
  if (!upc_code) {
    return callback(new Error("Invalid UPC code "+input_upc_code+"."));
  } else {
    client.get(upc_url + upc_api_key + "/" + upc_code, function upcdatabase_org_response(data, response){
      if (data.valid == 'true') {
        console.log(data);
        // return the idem details. If there is an "itemname" (short),
        // return that, otherwise return the (long) description
        return callback(null, data.number, (data.itemname) ? data.itemname : data.description);
      } else {
        return null
      }
    })
  }
}
