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