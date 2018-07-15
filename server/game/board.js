const Words = require('./words')

class Board {
	
	constructor() {
		this.words = this.createBoard()
	}

	createBoard() {
		const boardWords = this.shuffleWords(Words.original).slice(0,25)
		let redWords = this.setWordType(boardWords.splice(0,8), 'red')
		let blueWords = this.setWordType(boardWords.splice(0,9), 'blue')
		let innocentWords = this.setWordType(boardWords.splice(0,7), 'innocent')
		let assassin = this.setWordType(boardWords.splice(0,1), 'assassin')

		return this.shuffleWords(redWords.concat(blueWords, innocentWords, assassin))
	}

	createNewBoard() {
		this.words = this.createBoard()
	}

	shuffleWords(words) {
		let counter = words.length
		while (counter > 0) {
			let index = Math.floor(Math.random() * counter)
			counter --;
			let temp = words[counter]
			words[counter] = words[index]
			words[index] = temp
		}
		return words
	}

	setWordType(words, type) {
		let result = []
		for (let i = 0; i < words.length; i++) {
			result.push({
				name: words[i],
				type: type,
				show: false
			})
		}
		return result
	}
}

module.exports = Board
