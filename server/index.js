let express = require('express')
let socket = require('socket.io')
const Board = require('./game/board')
const Team = require('./game/team')

// App setup
let app = express()
let port = process.env.PORT || 4000
let server = app.listen(port, function() {
	console.log('listening to port 4000 requests')
})

// Socket setup
let io = socket(server)

let board = new Board()
let team = new Team()
const nicknames = []

io.on('connection', function (socket) {
	const connectedIDs = Object.keys(io.of('/').clients().connected)
	const names = []

	socket.join('game')
	// socket.nickname = socket.id
	// for (socketID in io.sockets.adapter.rooms['game'].sockets) {
	// 	const nickname = io.sockets.connected[socketID].nickname
	// 	names.push(nickname)
	// }
	//Get list of client ids connected
	console.log(connectedIDs)

	io.sockets.emit('getBoard', board.words)
	io.sockets.emit('getAllUsers', nicknames)
	io.sockets.emit('getTeams', team)

	console.log('a user connected')
	// console.log(io.sockets.adapter.rooms['game'].sockets)

	socket.on('disconnect', function(){
		console.log('user disconnected');
		const index = nicknames.indexOf(socket.nickname)
		if (index !== -1) {
			nicknames.splice(nicknames.indexOf(socket.nickname), 1)
		}
		io.sockets.emit('getAllUsers', nicknames)
	});
	
	socket.on('chat', function (data) {
		io.sockets.emit('chat', data)
	})

	socket.on('getAllUsers', function (data) {
		// console.log('all users', io.sockets.adapter.rooms['game'].sockets)
		io.sockets.emit('getAllUsers', nicknames)
	})

	socket.on('setName', function (data, callback) {
		if (nicknames.indexOf(data) != -1) {
			callback(false)
		} else {
			socket.nickname = data
			nicknames.push(socket.nickname)
			team.addPlayer(socket.nickname, socket.id)
			console.log(team)
			io.sockets.emit('getAllUsers', nicknames)
			io.sockets.emit('getTeams', team)
			callback(true)
		}
	})

	socket.on('getTeams', function () {
		io.sockets.emit('getTeams', team)
	})

	socket.on('getSelf', function () {
		const teamColor = team.getTeam(socket.id)
		const isSpy = team.getIsSpy(socket.id)
		let self = {
			nickname: socket.nickname,
			id: socket.id, 
			team: teamColor,
			isSpyMaster: isSpy
		}
		socket.emit('getSelf', self)
	})

	socket.on('newGame', function () {
		board.createNewBoard()
		io.sockets.emit('getBoard', board.words)
	})
})