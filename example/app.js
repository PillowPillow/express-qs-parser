var http = require('http'),
	express = require('express'),
	expressQSParser = require('../index');

var app = express(),
	server = http.Server(app),
	qsParserMiddleware = expressQSParser({
		params: {
			filters: /([\w-_]+)(\>|<|\=|\!=)([\w_-]+)/g,
			order: /(-?)([\w\s]+)/
		},
		storage: 'parsedQuery'
	});

app.use(qsParserMiddleware);

var router = express.Router();

router.get('/', function(request, response) {
	response.status(200).json(request.parsedQuery);
});

app.use(router);

server.listen(1337, function() {
	console.log('Server listening on %s:%d',this.address().address,this.address().port);
});

module.exports = { app: app, server: server };