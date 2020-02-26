#!/usr/bin/env node
'use strict';

var STATIC_OPTIONS = { maxAge: 3600000 };

const objectify = (str) => {let obj = {}; obj[str.split(':')[0]] = str.split(':')[1]; return obj};
const AUTH = process.env.HTTP_AUTH ? objectify(process.env.HTTP_AUTH) : { admin: 'password' };

var express = require('express'),
  http = require('http'),
  path = require('path'),
  serveStatic = require('serve-static'),
  socket = require('./socket'),
  api = require('./')
    .use(require('express-basic-auth')({ users: AUTH, challenge: true, realm: `You've stumbled upon a door where your mind is the key. There are none who will lend you guidance; these trials are yours to conquer alone. Entering here will take more than mere logic and strategy, but the criteria are just as hidden as what they reveal. Find yourself, and you will find the very thing hidden behind this page.` }))
    .use(serveStatic(path.join(__dirname, '../dist'), STATIC_OPTIONS))
    .use(serveStatic(path.join(__dirname, '../.tmp'), STATIC_OPTIONS))
    .use(serveStatic(path.join(__dirname, '../app'), STATIC_OPTIONS))

var server = http.createServer(api);
socket(server);
var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 9000;

server.listen(port).on('error', function (e) {
  if (e.code !== 'EADDRINUSE' && e.code !== 'EACCES') {
    throw e;
  }
  console.error('Port ' + port + ' is busy. Trying the next available port...');
  server.listen(++port);
}).on('listening', function () {
  console.log(`Listening on http://${host}:${port}`);
});
