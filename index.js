module.exports = ExpressQSParser;

var basicConfig = {
	storage: 'parsedQuery'
};

/** ExpressQSParser Middleware
 * @param {literal object} config middleware configuration
 *
 * config: {
 * 	params: {
 * 		filters: /([\w-_]+)(\>|\<|\=|\!=)([\w_-]+)/g
 * 	},
 * 	storage: 'query'
 * }
 */
function ExpressQSParser(config) {

	var storageName = '', parametersNames, params;
	params = config.params || {};
	storageName = config.storage || basicConfig.storage;
	parametersNames = Object.keys(params);
	
	initParams();

	return middleware;

	function initParams() {
		for(var i = parametersNames.length; i>=0; i--) 
			if(!(params[parametersNames[i]] instanceof RegExp)) {
				delete params[parametersNames[i]];
				parametersNames.splice(i, 1);
			}
			else {
				params[parametersNames[i]] = {
					exp:params[parametersNames[i]],
					isGlobal: params[parametersNames[i]].global
				};
				if(params[parametersNames[i]].isGlobal)
					params[parametersNames[i]].nGExp = new RegExp(params[parametersNames[i]].exp.toString().slice(1,-2));
			}
	}

	function applyExpression(field, value) {
		var result = value, temp;
		if(!!~parametersNames.indexOf(field)) {
			value = value || '';
			result = value.match(params[field].exp);
			if(params[field].isGlobal && result instanceof Array) {
				for(var i = 0; i<result.length; i++) {
					result[i] = result[i].match(params[field].nGExp);
					result[i] = sanitizeRegExpMatch(result[i]);
				}
			}
			else
				result = sanitizeRegExpMatch(result);
		}

		return result;
	}

	function sanitizeRegExpMatch(match) {
		if(match instanceof Array) {
			var temp = [];
			for(var j = 1; j<match.length; j++)
				temp.push(match[j]);
			match = temp;
		}
		return match;
	}

	function middleware(request, response, next) {

		var queryParams = request.query,
			paramNames = Object.keys(queryParams);

		var storage = request[storageName];
		if(!storage || !(storage instanceof Object))
			storage = request[storageName] = {};

		for(var i =0; i<paramNames.length; i++) {
			storage[paramNames[i]] = applyExpression(paramNames[i], queryParams[paramNames[i]]);
		}
		next();
	}
}
