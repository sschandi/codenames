<template>
  <div id="app">
    <h1>Codenames</h1>
    <!-- <p v-if="isConnected">We are connected {{ users }}</p> -->
    <p>{{ error }}</p>
    <div v-if="showGame == false">
      <input v-model="nickname" type="text" placeholder="enter nick name"/>
      <button @click="setName()">Set</button>
    </div>
    <div v-else>
      <h2>Hello {{ nickname }}</h2>
      <div class="container">
        <div class="team-blue">
          <h2>Blue Team</h2>
          <p v-if="teams" v-for="blue in blueTeam" :key="blue.id">
            <span v-if="blue.isSpyMaster">Spymaster</span>
            <span v-else>Player</span>:
            {{ blue.name }}
            <span v-if="blue.id === id">(YOU)</span>
          </p>
        </div>
        <div class="team-red">
          <h2>Red Team</h2>
          <p v-if="teams" v-for="red in redTeam" :key="red.id">
            <span v-if="red.isSpyMaster">Spymaster</span>
            <span v-else>Player</span>:
            {{ red.name }}
            <span v-if="red.id === id">(YOU)</span>
          </p>
        </div>
      </div>
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
      >
        <template slot="actions">
          <div class="container actions">
            <button @click="newGame()">New Game</button>
            <button @click="randomTeams()">New Game New Teams</button>
            <button v-if="isTurn && !isSpyMaster" class="turn-button" @click="endTurn()">End Turn</button>
          </div>
        </template>
      </Game>
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
    getSelves: function () {
      this.$socket.emit('getSelf')
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
      this.$socket.emit('getSelves')
    },
    randomTeams: function () {
      this.$socket.emit('randomTeams')
      this.$socket.emit('getSelves')
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
$white: #ffffff;

body {
  font-family: $font;
}
#app {
  text-align: center;
  color: $assasin;
  padding-bottom: 2em;
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
.team-red {
  width: 40%;
  padding: 0 2.5% 2.5% 2.5%;
  margin: 2.5%;
  background-color: $red;
  color: $white;
}
.team-blue {
  width: 40%;
  padding: 0 2.5% 2.5% 2.5%;
  margin: 2.5%;
  background-color: $blue;
  color: $white;
}
.row {

}
.actions {
  justify-content: flex-start;
}
button {
  color: $default;
  background-color: $innocent;
  border: none;
  padding: 1em;
  margin: .5em .5em .5em 0;
}
.turn-button {
  background-color: $assasin;
}
input {
  padding: 1em;
}
</style>
