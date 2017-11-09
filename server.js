/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

var path = require('path');
var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();

// Set the address and the certificate.
var options = {
    hostname: 'localhost',
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
    ca: fs.readFileSync('ca.crt')
};

// Define the port. The service uses 'localhost' as the host address.
// Set the host member in the options object to set a custom host domain name or IP address.
var port = 8088;

// Set the front-end folder to serve public assets.
app.use(express.static(__dirname + '/Scripts'));

// Set the front-end folder to serve public assets.
app.use(express.static(__dirname + '/Content'));

// Set the front-end folder to serve public assets.
app.use(express.static(__dirname + '/Css'));

// Set the front-end folder to serve public assets.
app.use(express.static(__dirname));

app.use(express.static(__dirname + '/Functions'));

app.use(express.static(__dirname + '/Images'));


// Set the route to the index.html file.
app.get('/', function(req, res) {
    var homepage = path.join(__dirname, 'Home.html');
    res.sendFile(homepage);
});

// Start the server.
http.createServer(app).listen(port, function() {
    console.log('Listening on http://localhost:' + port + '...');
});