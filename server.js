'use strict';

var net = require('net');
var modbus = require('modbus-tcp');

var server = net.createServer(function (socket) {

	console.log('client connected');

	var modbusServer = new modbus.Server();
	modbusServer.writer().pipe(socket);
	socket.pipe(modbusServer.reader());

	modbusServer.on("read-input-registers", function (from, to, reply) {

		console.log('reading:', from, to);

		var buffer = new Buffer(2);
		buffer.writeUInt16BE((from + to) * 2, 0);
		return reply(null, [buffer]);
	});
});

server.listen(502, function() {
	console.log('listening...');
});
