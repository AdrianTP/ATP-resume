"use strict";

var fs = require('fs');

var Error = function() {
	return {
		log: function(err, req, res, next) {
			console.error(err.stack);
			next(err);
		},
		response: function(err, req, res, next) {
			if (req.xhr) {
				res.send(500, {
					error: 'Oops. Something went wrong.'
				});
			} else {
				next(err);
			}
		},
		general: function(err, req, res, next) {
			req.status(500);
			res.render('error', {
				error: err
			});
		}
	};
};

var Routes = function() {
	return {
		build: function(app, data) {
			this._data = data;
			
			var _self = this;
			
			app.get('/', function(req, res) {
				res.render('index', _self._data);
			});
		}
	};
};

var Store = function() {
	return {
		data: {
			resume: {}
		},
		load: function(name, filepath, callback) {
			var _self = this;
			(function(name, filepath, callback) {
				fs.readFile(__dirname + filepath, {encoding: 'utf8'}, function(err, data) {
					if (err) throw err;
					_self.data[name] = JSON.parse(data);
					callback(_self.data[name]);
				});
			})(name, filepath, callback);
		}
	};
};

var Server = function() {
	var app
		, store
		, routes
		, server;
	
	return {
		init: function(expressInstance) {
			var _self = this;
			
			app = expressInstance;
			routes = new Routes();
			store = new Store();
			
			store.load('resume', '/resume.json', function(data) {
				_self.setRoutes(data);
			});
		},
		setRoutes: function(data) {
			routes.build(app, data);
		},
		start: function() {
			server = app.listen(9999, '127.0.0.1', function() {
				console.log('Listening on port %d', server.address().port);
			});
			return server;
		}
	};
};

module.exports.error = new Error();

module.exports.routes = new Routes();

module.exports.server = new Server();