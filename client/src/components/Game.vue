<template>
	<div id="game">
		<p v-if="turn">Your turn</p>
		<p v-else>Enemy's Turn</p>
		<p>
			You are 
			<span v-if="spymaster">the {{ team }} spymaster</span>
			<span v-else>a {{ team }} player</span></p>
		<slot name="actions"/>
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
		team: String,
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
				return 'pointer'
			}
		},
		setShowCard: function (card) {
			if (this.spymaster || !this.turn) {
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
	width: 19%;
	margin: .5%;
	height: 100px;
	background-color: $default;
	display: flex;
	align-items: center;
	justify-content: center;
}
.pointer {
	cursor: pointer;
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
