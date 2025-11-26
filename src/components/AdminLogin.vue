<template>
  <div class="login-container">
    <h2 style="font-size:2rem;color:#2563eb;font-weight:bold;">Admin Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Admin Email" required class="admin-input" />
      <input v-model="password" type="password" placeholder="Password" required class="admin-input" />
      <button type="submit" class="admin-btn">Login</button>
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
  max-width: 350px;
  margin: 60px auto;
  padding: 32px;
  border: 2px solid #2563eb;
  border-radius: 16px;
  background: #f5f7fa;
  box-shadow: 0 4px 24px #dbeafe;
}
.admin-input {
  display: block;
  width: 100%;
  margin-bottom: 18px;
  padding: 12px;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 1px solid #2563eb;
  background: #eff6ff;
}
.admin-btn {
  width: 100%;
  padding: 14px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 2px 8px #dbeafe;
  cursor: pointer;
  transition: background 0.2s;
}
.admin-btn:hover {
  background: #1d4ed8;
}
.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
@media (max-width: 800px) {
  .login-container {
    padding: 16px;
    max-width: 98vw;
  }
  .admin-input {
    font-size: 1rem;
    padding: 8px;
  }
  .admin-btn {
    font-size: 1rem;
    padding: 10px;
  }
  h2 {
    font-size: 1.2rem !important;
  }
}
@media (max-width: 500px) {
  .login-container {
    padding: 8px;
    max-width: 100vw;
  }
  .admin-input {
    font-size: 0.95rem;
    padding: 6px;
  }
  .admin-btn {
    font-size: 0.95rem;
    padding: 8px;
  }
  h2 {
    font-size: 1rem !important;
  }
}
</style>
