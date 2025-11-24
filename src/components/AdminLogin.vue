<template>
  <div class="login-container">
    <h2>Admin Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Admin Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'AdminLogin',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      this.error = '';
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$emit('login-success');
      } catch (e) {
        this.error = 'Invalid credentials';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
button {
  width: 100%;
  padding: 8px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
