'use strict';                 // Use strict mode to enable ES6 : class, etc ...

// Prepare server environment
//==============================================================================

var app = require("./myapp").app();

// START THE SERVER
// =============================================================================

// set our port in the PORT environment variable
var port = process.env.PORT || 8080;

app.listen(port);
console.log(new Date());
console.log('Waiting for connection on port ' + port);
