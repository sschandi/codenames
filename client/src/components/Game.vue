<template>
	<div id="game">
		<h1>Game</h1>
		<p v-if="turn">Your turn</p>
		<p v-else>Enemy's Turn</p>
		<div class="container">
			<p>You are <span v-if="spymaster">the spymaster</span><span v-else>a player</span></p>
		</div>
		<div class="container">
			<div 
				v-for="card in board" 
				:key="card.name" class="card" 
				:class="getCardClass(card)"
				@click="setShowCard(card)"
			>
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
		turn: Boolean,
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
		getCardClass: function (card) {
			if (card.show) {
				return card.type
			} else if (this.spymaster) {
				return `spy-${card.type}`
			} else {
				return ''
			}
		},
		setShowCard: function (card) {
			if (this.spymaster || !this.turn) {
				console.log('wtf')
				return
			}
			this.$emit('show-card', card)
		}
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
	color: $default;
	background-color: $innocent;
	font-weight: 700;
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
