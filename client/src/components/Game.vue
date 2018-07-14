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

<style lang="scss">
$red: #f73859;
$blue: #0074e4;
$innocent: #404b69;
$assasin: #283149;
$default: #dbedf3;

.card {
	width: 20%;
	height: 100px;
	background-color: $default;
	display: flex;
	align-items: center;
	justify-content: center;
}
.innocent {
	background-color: $innocent;
	color: $default;
}
.assassin {
	background-color: $assasin;
	color: $default;
}
.red {
	background-color: $red;
	color: $default;
}
.blue {
	background-color: $blue;
	color: $default;
}
.spy-innocent {
	color: $innocent;
	background-color: $default;
}
.spy-assassin {
	color: $assasin;
	background-color: $default;
}
.spy-red {
	color: $red;
	background-color: $default;
}
.spy-blue {
	color: $blue;
	background-color: $default;
}
</style>
