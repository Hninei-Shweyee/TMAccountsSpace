<template>
  <div class="insert-container">
    <h2 style="font-size:2rem;color:#2563eb;font-weight:bold;">Insert CapCut Account</h2>
    <form @submit.prevent="insertAccount">
      <input v-model="email" type="email" placeholder="CapCut Email" required class="admin-input" />
      <input v-model="password" type="text" placeholder="CapCut Password" required class="admin-input" />
      <button type="submit" class="admin-btn">Insert Account</button>
      <p v-if="success" class="success">Account inserted!</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default {
  name: 'InsertAccount',
  data() {
    return {
      email: '',
      password: '',
      success: false,
      error: ''
    };
  },
  methods: {
    async insertAccount() {
      this.success = false;
      this.error = '';
      try {
        await addDoc(collection(db, 'capcut_accounts'), {
          email: this.email,
          password: this.password
        });
        this.success = true;
        this.email = '';
        this.password = '';
      } catch (e) {
  this.error = 'Failed to insert account.';
      }
    }
  }
};
</script>

<style scoped>
.insert-container {
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
.success {
  color: #22c55e;
  margin-top: 10px;
  font-weight: bold;
}
.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
@media (max-width: 800px) {
  .insert-container {
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
  .insert-container {
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
