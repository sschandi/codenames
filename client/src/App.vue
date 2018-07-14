<template>
  <div id="app">
    <h1>App</h1>
    <p v-if="isConnected">We are connected {{ users }}</p>
    <p>{{ error }}</p>
    <p v-if="users.length < 4">Don't try to play this without 4 people ok. Waiting for 4 players...</p>
    <button @click="getTeamData()">getteamdata</button>
    <button @click="newGame()">newGame</button>
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
    <template v-if="showGame">
      <Game :gameBoard="gameBoard" :spymaster="isSpyMaster"/>
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
      id: '',
      error: '',
      showGame: false,
      gameBoard: [],
      teams: null,
      isSpyMaster: false,
      team: null,
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
      console.log('socket-users', val)
      this.users = val
    },
    chat: function (val) {
      console.log('socket-chat', val)
    },
    getBoard: function (val) {
      this.gameBoard = val
      console.log(val)
    },
    getTeams: function (val) {
      this.teams = val
      console.log('getteams', this.teams)
    },
    getSelf: function (val) {
      this.id = val.id
      this.isSpyMaster = val.isSpyMaster
      this.team = val.team
      this.nickname = val.nickname
      console.log('self', val)
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
    getTeamData: function () {
      this.teams.red.forEach((player) => {
        console.log('player', player)
      })
    },
    newGame: function () {
      this.$socket.emit('newGame')
    },
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
