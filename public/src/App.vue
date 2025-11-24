<template>
  <div>
  <HelloWorld v-if="!showLogin && !isLoggedIn" msg="Welcome to Your Vue.js App" @show-login="showLogin = true" />
  <AdminLogin v-if="showLogin && !isLoggedIn" @login-success="onLoginSuccess" />
  <InsertAccount v-if="isLoggedIn" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AdminLogin from './components/AdminLogin.vue'
import InsertAccount from './components/InsertAccount.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    AdminLogin,
    InsertAccount
  },
  data() {
    return {
      isLoggedIn: false,
      showLogin: false
    };
  },
  methods: {
    onLoginSuccess() {
      this.isLoggedIn = true;
      this.showLogin = false;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
