# express-qs-parser
Query string parser middleware for express.
Easily apply regular expressions on query string parameters.

###Installation
    npm install --save express-qs-parser

###Configuration
#### options.params
Type: `Object` : `{ string: RegExp }`  
Default value: `{}`

list of parameters to be analyzed  

#### options.storage
Type: `String`  
Default value: `"parsedQuery"`

name of the request property where the middleware will store the parsed parameters  

###Example

````javascript
// http://localhost:1337/?filters=fu>9,bar=test
// => parsedQuery: { filters: [['fu','>','9'],['bar','=','test']] }
// http://localhost:1337/?filters=fubar
// => parsedQuery: { filters: null }
// http://localhost:1337/?filters=fu>9,bar=test&order=-fu
// => parsedQuery: { filters: [['fu','>','9'],['bar','=','test']], order: ['-','fu'] }
````

````javascript
var http = require('http'),
	express = require('express'),
	expressQSParser = require('express-qs-parser');

var app = express(),
	server = http.Server(app),
	qsParserMiddleware = expressQSParser({
	    // list of parameters to be analyzed
		params: { 
		    //applies the pattern on all matched elements thanks to the global option
			filters: /([\w-_]+)(\>|<|\=|\!=)([\w_-]+)/g, 
			order: /(-?)([\w\s]+)/
		},
		// name of the request property where the middleware will store the parsed parameters
		storage: 'parsedQuery' 
	});

//--------------------------------------------------------------------

// applies the parser on all routes
app.use(qsParserMiddleware);

var router = express.Router();
router.get('/', function(request, response) {
	response.status(200).json(request.parsedQuery);
});

//--------------------------------------------------------------------

// router.get('/', qsParserMiddleware, function(request, response) {
// 	response.status(200).json(request.parsedQuery);
// });

//--------------------------------------------------------------------

app.use(router);

server.listen(1337, function() {
	console.log('Server listening on %s:%d',this.address().address,this.address().port);
});

module.exports = { app: app, server: server };
````
