<template>
  <div class="insert-container">
    <h2>Insert CapCut Account</h2>
    <form @submit.prevent="insertAccount">
      <input v-model="email" type="email" placeholder="CapCut Email" required />
      <input v-model="password" type="text" placeholder="CapCut Password" required />
      <button type="submit">Insert Account</button>
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
.success {
  color: #42b983;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
