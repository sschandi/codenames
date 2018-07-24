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
let turn = 'blue'
const nicknames = []

io.on('connection', function (socket) {
	// const connectedIDs = Object.keys(io.of('/').clients().connected)
	const names = []

	socket.join('game')
	//Get list of client ids connected
	// console.log(connectedIDs)

	io.sockets.emit('getBoard', board.words)
	io.sockets.emit('getAllUsers', nicknames)
	io.sockets.emit('getTeams', team)

	// console.log('a user connected')
	// console.log(io.sockets.adapter.rooms['game'].sockets)

	socket.on('disconnect', function() {
		// console.log('user disconnected');
		const index = nicknames.indexOf(socket.nickname)
		if (index !== -1) {
			nicknames.splice(nicknames.indexOf(socket.nickname), 1)
		}
		team.removeByID(socket.id)
		io.sockets.emit('getAllUsers', nicknames)
		io.sockets.emit('getTeams', team)
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
			// console.log(team)
			io.sockets.emit('getAllUsers', nicknames)
			io.sockets.emit('getTeams', team)
			io.sockets.emit('getTurn', turn)
			callback(true)
		}
	})

	socket.on('getTeams', function () {
		io.sockets.emit('getTeams', team)
	})

	socket.on('getTurn', function() {
		sockets.emit('getTurn', turn)
	})

	socket.on('endTurn', function () {
		if (turn === 'blue') {
			turn = 'red'
		} else {
			turn = 'blue'
		}
		io.sockets.emit('getTurn', turn)
	})
// coment for fun
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

	socket.on('getSelves', function () {
		io.sockets.emit('getSelves')
	})

	socket.on('newGame', function () {
		board.createNewBoard()
		team.incrementSpymaster()
		io.sockets.emit('gameOver', null)
		// console.log(team)
		turn = 'blue'
		io.sockets.emit('getBoard', board.words)
		io.sockets.emit('getAllUsers', nicknames)
		io.sockets.emit('getTeams', team)
		io.sockets.emit('getTurn', turn)
	})

	socket.on('randomTeams', function () {
		board.createNewBoard()
		team.createNewTeams()
		io.sockets.emit('gameOver', null)
		// console.log(team)
		turn = 'blue'
		io.sockets.emit('getBoard', board.words)
		io.sockets.emit('getAllUsers', nicknames)
		io.sockets.emit('getTeams', team)
		io.sockets.emit('getTurn', turn)
	})

	socket.on('setBoard', function (board, card) {
		board.words = board
		if (card.type === 'assassin') {
			io.sockets.emit('gameOver', `Game Over, ${team.getTeam(socket.id)} lost.`)
		} else if (didBlueWin(board) === 9) {
			io.sockets.emit('gameOver', `Blue winned.`)
		} else if (didRedWin(board) === 8) {
			io.sockets.emit('gameOver', `Red winned.`)
		}
		if (card.type !== team.getTeam(socket.id)) {
			if (turn === 'blue') {
				turn = 'red'
			} else {
				turn = 'blue'
			}
			io.sockets.emit('getTurn', turn)
		}
		io.sockets.emit('getBoard', board.words)
	})
})

function didBlueWin(board) {
	let blueWin = 0
	for (let i = 0; i < board.length; i++) {
		if (board[i].show && (board[i].type === 'blue')) {
			blueWin += 1
		}
	}
	return blueWin
}

function didRedWin(board) {
	let redWin = 0
	for (let i = 0; i < board.length; i++) {
		if (board[i].show && (board[i].type === 'red')) {
			redWin += 1
		}
	}
	return redWin
}