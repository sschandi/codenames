<template>
  <div id="app">
    <h1>Codenames</h1>
    <p v-if="isConnected">We are connected {{ users }}</p>
    <p>{{ error }}</p>
    <button @click="newGame()">newGame</button>
    <button @click="randomTeams()">newGame shuffle teams</button>
    <button v-if="isTurn && !isSpyMaster" @click="endTurn()">End Turn</button>
    <div v-if="showGame == false">
      <input v-model="nickname" type="text" placeholder="enter nick name"/>
      <button @click="setName()">Set</button>
    </div>
    <div v-else>
      <p>Hello: {{ nickname }}</p>
    </div>
    <div v-if="teams" v-for="red in redTeam" :key="red.id">
      <p>red: {{ red }}</p>
    </div>
    <div v-if="teams" v-for="blue in blueTeam" :key="blue.id">
      <p>blue: {{ blue }}</p>
    </div>
    <!-- <button @click="getBoard()">getBoard</button>
    <button @click="getAllUsers()">UsersGet</button> -->
    <h1 v-if="gameOver">{{ gameOver }}</h1>
    <template v-if="showGame">
      <Game 
        :gameBoard="gameBoard" 
        :spymaster="isSpyMaster"
        :turn="isTurn"
        :team="team"
        @show-card="showCard"
      />
    </template>
    <router-view/>
  </div>
</template>

<script>
import Game from '@/components/Game'

export default {
  components: {
    Game
  },
  name: 'App',
  data () {
    return {
      isConnected: false,
      users: [],
      nickname: '',
      id: null,
      error: '',
      showGame: false,
      gameBoard: [],
      teams: null,
      isSpyMaster: false,
      team: null,
      turn: 'blue',
      gameOver: null,
    }
  },
  sockets: {
    connect: function () {
      this.isConnected = true
    },
    disconnect()  {
      this.isConnected = false
    },
    getAllUsers: function (val) {
      this.users = val
    },
    chat: function (val) {
      console.log('socket-chat', val)
    },
    getBoard: function (val) {
      this.gameBoard = val
    },
    getTeams: function (val) {
      this.teams = val
    },
    getSelf: function (val) {
      this.id = val.id
      this.isSpyMaster = val.isSpyMaster
      this.team = val.team
      this.nickname = val.nickname
    },
    getTurn: function (val) {
      this.turn = val
    },
    gameOver: function (val) {
      this.gameOver = val
    }
  },
  created () {
  },
  computed: {
    redTeam() {
      if (!this.teams) {
        return ''
      }
      return this.teams.red
    },
    blueTeam() {
      if (!this.teams) {
        return ''
      }
      return this.teams.blue
    },
    isTurn() {
      if (this.turn === this.team) {
        return true
      }
      return false
    }
  },
  methods: {
    setName: function () {
      let vuedata = this
      this.$socket.emit('setName', this.nickname, function(data) {
        vuedata.showGame = data
        if (data) {
          vuedata.error = ''
          vuedata.$socket.emit('getSelf')
        } else {
          vuedata.error = 'Be original... that name is already taken'
          vuedata.nickname = ''
        }
      })
    },
    getBoard: function () {
      this.$socket.emit('getBoard', 'get')
    },
    getAllUsers: function () {
      this.$socket.emit('getAllUsers', 'no')
    },
    getTeams: function () {
      this.$socket.emit('getTeams')
    },
    newGame: function () {
      this.$socket.emit('newGame')
      this.$socket.emit('getSelf')
    },
    randomTeams: function () {
      this.$socket.emit('randomTeams')
      this.$socket.emit('getSelf')
    },
    endTurn: function () {
      this.$socket.emit('endTurn')
    },
    showCard: function (card) {
      for (let i = 0; i < this.gameBoard.length; i++) {
        if (this.gameBoard[i] === card) {
          this.gameBoard[i].show = true
        }
      }
      this.$socket.emit('setBoard', this.gameBoard, card)
    }
  }
}
</script>

<style lang="scss">
$font: 'Roboto Slab', serif;
$red: #f73859;
$blue: #0074e4;
$innocent: #404b69;
$assasin: #283149;
$default: #dbedf3;

body {
  font-family: $font;
}
#app {
  text-align: center;
  color: $assasin;
}
.container {
  min-width: 500px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.row {

}
</style>
