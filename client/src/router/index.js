import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Lobby from '@/components/Lobby'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'Game',
    //   component: Game
    // },
    // {
    //   path: '/g/:id',
    //   name: 'Game',
    //   component: Game
    // }
  ]
})
