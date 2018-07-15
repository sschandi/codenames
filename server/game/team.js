class Team {
	constructor() {
		this.blue = []
		this.red = []
	}

	addPlayer(name, id) {
		if (this.blue.length > this.red.length) {
			if (this.red.length === 0) {
				this.red.push(new Player(name, id, true))
			} else {
				this.red.push(new Player(name, id, false))
			}
		} else {
			if (this.blue.length === 0) {
				this.blue.push(new Player(name, id, true))
			} else {
				this.blue.push(new Player(name, id, false))
			}
		}
	}

	getBlue() {
		return this.blue
	}

	getRed() {
		return this.red
	}

	incrementSpymaster() {
		const newRed = []
		const newBlue = []
		for (let i = this.red.length - 1; i >= 0; i--) {
			this.red[i].isSpyMaster = false
			newRed.push(this.red[i])
		}
		for (let i = this.blue.length - 1; i >= 0; i--) {
			this.blue[i].isSpyMaster = false
			newBlue.push(this.blue[i])
		}
		if (newRed.length > 0) {
			newRed[0].isSpyMaster = true
		}
		if (newBlue.length > 0) {
			newBlue[0].isSpyMaster = true
		}
		this.red = newRed
		this.blue = newBlue
	}

	createNewTeams() {
		let playerPool = this.shufflePlayers(this.red.concat(this.blue))
		this.blue = []
		this.red = []
		for (let i = 0; i < playerPool.length; i++) {
			this.addPlayer(playerPool[i].name, playerPool[i].id)
		}
	}

	shufflePlayers(player) {
		let counter = player.length
		while (counter > 0) {
			let index = Math.floor(Math.random() * counter)
			counter --;
			let temp = player[counter]
			player[counter] = player[index]
			player[index] = temp
		}
		return player
	}

	removeByID(id) {
		for (let i = 0; i < this.red.length; i++) {
			if (this.red[i].id === id) {
				this.red.splice(i, 1)
			}
		}
		for (let i = 0; i < this.blue.length; i++) {
			if (this.blue[i].id === id) {
				this.blue.splice(i, 1)
			}
		}
	}

	getTeam(id) {
		for (let i = 0; i < this.red.length; i++) {
			if (this.red[i].id === id) {
				return 'red'
			}
		}
		return 'blue'
	}

	getIsSpy(id) {
		for (let i = 0; i < this.red.length; i++) {
			if (this.red[i].isSpyMaster === true && this.red[i].id === id) {
				return true
			}
		}
		for (let i = 0; i < this.blue.length; i++) {
			if (this.blue[i].isSpyMaster === true && this.blue[i].id === id) {
				return true
			}
		}
		return false
	}
}

class Player {
	constructor(name, id, isSpyMaster) {
		this.name = name
		this.id = id
		this.isSpyMaster = isSpyMaster
	}
}

module.exports = Team