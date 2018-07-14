<template>
	<div id="game">
		<h1>Game</h1>
		<div class="container">
		</div>
		<div class="container">
			<div v-for="card in board" :key="card.name" class="card" :class="getCardClass(card.type)">
				<p>{{ card.name }}</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		gameBoard: Array,
		spymaster: Boolean,
	},
	data () {
		return {
			board: [],
		}
	},
	watch: {
		gameBoard: function () {
			this.board = this.gameBoard
		}
	},
	created () {
		this.board = this.gameBoard
	},
	methods: {
		shuffleWords: function (words) {
			let counter = words.length
			while (counter > 0) {
				let index = Math.floor(Math.random() * counter)
				counter --;
				let temp = words[counter]
				words[counter] = words[index]
				words[index] = temp
			}
			return words
		},
		setWordType: function(words, type) {
			let result = []
			for (let i = 0; i < words.length; i++) {
				result.push({
					name: words[i],
					type: type,
					show: false
				})
			}
			return result
		},
		getCardClass: function (type) {
			if (this.spymaster) {
				return type
			} else {
				return ''
			}
		},
	}
}
</script>

<style>
.card {
	width: 20%;
	height: 100px;
	background-color: var(--white);
	display: flex;
	align-items: center;
	justify-content: center;
}
.innocent {
	background-color: var(--grey);
	color: var(--white);
}
.assassin {
	background-color: var(--dark-grey);
	color: var(--white);
}
.red {
	background-color: var(--red);
	color: var(--white);
}
.blue {
	background-color: var(--blue);
	color: var(--white);
}
</style>
