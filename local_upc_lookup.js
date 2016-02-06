// search the local database first for the UPC code

function sanitize_upc(input_upc_code) {
  if (!input_upc_code) {
    return null;
  }
  // take an input UPC code and make sure it's valid
  // i.e., 11-13 numbers
  upc_code = input_upc_code.toString().match(/^[0-9]{8,13}$/);
  if (!upc_code) { 
    return null 
  } else { 
    return upc_code[0];
  }
}

exports.lookup = function lookup_upc(input_upc_code, callback) {
  // don't accept invalid data
  upc_code = sanitize_upc(input_upc_code);
  if (!upc_code) {
    return callback(new Error("Invalid UPC code "+input_upc_code+"."));
  }

  // open the local UPC database
  var fs = require("fs");
  var file = "upc_codes.db";
  var exists = fs.existsSync(file);
  if (!exists) {
  // no local database
    return callback(new Error("Local UPC database not found."));
  }

  // initialize the database
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);

  var sql_query = "SELECT upc_code, description FROM upc WHERE upc_code = '"+upc_code+"'";
  //console.log("Executing statement: "+sql_query);
  db.all(sql_query,function upc_lookup_db_response(err,rows) {
    db.close();
    if (err) throw err;
    if (rows.length == 0) {
      // UPC code was not found
      //return callback(new Error("UPC code "+upc_code+" not found."))
      return null;
    } else {
      //console.log("returning UPC "+rows[0].upc_code)
      return callback(null, rows[0].upc_code, rows[0].description)
    }
  });
}
