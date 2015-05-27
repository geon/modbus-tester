'use strict';

var net = require('net');
var modbus = require('modbus-tcp');
var split = require('split');


var stdinLines = process.stdin.pipe(split());


console.log('enter host:');
stdinLines.once('data', function (host) {

	console.log('connecting...');
	var socket = net.connect({
		host: host,
		port: 502
	}, function () {

		console.log('connected');

		console.log('enter registers (one per line):');
		stdinLines.on('data', function (register) {

			modbusClient.readInputRegisters(1, register, register, function (error, buffers) {

				if (error) {

					console.log('error reading register:', error.stack);
					return;
				}

				// We only asked for one register.
				var value = buffers && buffers[0] && buffers[0].readUInt16BE(0);
				console.log('value:', value);
			});
		});
	});
	socket.on('error', function (error) {

		console.log('connection failed:', error.stack);
	});

	var modbusClient = new modbus.Client();
	modbusClient.writer().pipe(socket);
	socket.pipe(modbusClient.reader());
});
