<template>
<div id="lobby">
	<h1>Codenames</h1>
	<p v-if="error.length > 0">{{ error }}</p>
	<p>New Game:</p>
	<input type="text" v-model="newGameName" placeholder="Enter Game Name">
	<input type="password" v-model="password" placeholder="Enter Room Password">
	<input type="text" v-model="newGameName" placeholder="Enter Player Name">
	<button>Go</button>
	<p>or</p>
	<p>Join Game:</p>
	<input type="text" v-model="gameName" placeholder="Enter Active Game">
	<button>Go</button>
</div>
</template>

<script>
export default {
	data () {
		return {
			newGameName: '',
			password: '',
			gameName: '',
			playerName: '',
			error: '',
		}
	},
	methods: {
	}
}
</script>

<style>

</style>
