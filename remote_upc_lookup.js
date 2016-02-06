// initialize the REST client for talking to the UPC database
var Client = require('node-rest-client').Client;
client = new Client();

exports.lookup = function (input_upc_code, callback) {
  upc_code = input_upc_code
  if (!upc_code) {
    return callback(new Error("Invalid UPC code "+input_upc_code+"."));
  } else {
    client.get("http://api.upcdatabase.org/json/ee4a533ddb0ea98a8015e87887e550c8/"+upc_code, function upcdatabase_org_response(data, response){
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

/*// registering remote methods 
client.registerMethod("jsonMethod", "http://api.upcdatabase.org/json/ee4a533ddb0ea98a8015e87887e550c8/0111222333446", "GET");
'upc_codes.db'
client.methods.jsonMethod(function(data,response){
  // parsed response body as js object 
  console.log(data);
  // raw response 
  console.log(response);
});
*/
