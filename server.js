"use strict";

/*
 * Dependencies
 */
var express = require('express')
	, jade = require('jade')
	, gen = require('./generator');

/*
 * Server Setup
 */
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(gen.error.log);
app.use(gen.error.response);
app.use(gen.error.general);

gen.server.init(app);

gen.server.start();
