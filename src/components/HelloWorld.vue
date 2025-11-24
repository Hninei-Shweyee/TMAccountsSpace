<template>
  <div class="capcut-home">
    <header>
      <h1>CapCut Premium Accounts</h1>
      <button class="login-btn" @click="$emit('show-login')">Admin Login</button>
    </header>
    <div class="account-list">
      <h2>Available Accounts</h2>
      <!-- Removed global type filter -->
      <div v-if="loading">Loading accounts...</div>
      <div v-else-if="accounts.length === 0">No accounts available.</div>
      <div v-else>
        <div v-for="acc in accounts" :key="acc.id" class="account-card">
          <div>
            <strong>Account Type:</strong>
            <select
              v-model="accountTypes[acc.id]"
              @change="updateAccountType(acc.id, accountTypes[acc.id])"
            >
              <option value="share">Share</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>Email: {{ acc.email }}</div>
          <div>Password: {{ acc.password }}</div>
          <button @click="copyAccount(acc)">Copy Account</button>
          <span v-if="copiedId === acc.id" class="used-text">Copied!</span>

          <div v-if="accountTypes[acc.id] === 'share'">
            <div>User count: {{ shareCounts[acc.id] !== undefined ? shareCounts[acc.id] : 0 }} / 3</div>
            <button @click="incrementShare(acc)">Count</button>
            <button
              @click="doneShare(acc)"
              :disabled="(shareCounts[acc.id] !== undefined ? shareCounts[acc.id] : 0) < 3"
            >
              Done
            </button>
          </div>
          <div v-else>
            <button @click="donePrivate(acc)">Done</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default {
  name: 'CapcutHome',
  data() {
    return {
      accounts: [],
      loading: true,
      copiedId: null,
      accountTypes: {},
      shareCounts: {},   // per-account counts (0–3)
      deleteTimers: {}
    };
  },
  mounted() {
    this.unsubscribe = onSnapshot(collection(db, 'capcut_accounts'), (querySnapshot) => {
      const docs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      this.accounts = docs;

      // initialize type + shareCounts from Firestore
      docs.forEach(acc => {
        if (!this.accountTypes[acc.id]) {
          this.accountTypes[acc.id] = acc.type || 'share';
        }
        this.shareCounts[acc.id] = acc.count || 0;
      });

      this.loading = false;
    });
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    async copyAccount(acc) {
      const text = `Email: ${acc.email}\nPassword: ${acc.password}`;
      await navigator.clipboard.writeText(text);
      this.copiedId = acc.id;
      setTimeout(() => { this.copiedId = null; }, 1500);
    },
    async updateAccountType(accId, value) {
      this.accountTypes[accId] = value;
      await updateDoc(doc(db, 'capcut_accounts', accId), { type: value });
    },
    async incrementShare(acc) {
      // use our local shareCounts map
      const current = this.shareCounts[acc.id] || 0;
      if (current < 3) {
        const newCount = current + 1;
        this.shareCounts[acc.id] = newCount;  // update UI immediately
        await updateDoc(doc(db, 'capcut_accounts', acc.id), { count: newCount }); // persist to Firestore
      }
    },
    async deleteAccountById(accId) {
      await deleteDoc(doc(db, 'capcut_accounts', accId));

      // cleanup local timers + counts
      delete this.deleteTimers[accId];
      delete this.shareCounts[accId];
      localStorage.setItem('shareCounts', JSON.stringify(this.shareCounts));

      const timers = JSON.parse(localStorage.getItem('deleteTimers') || '{}');
      delete timers[accId];
      localStorage.setItem('deleteTimers', JSON.stringify(timers));
      // no this.fetchAccounts(): onSnapshot will update accounts automatically
    },
    doneShare(acc) {
      if (this.deleteTimers[acc.id]) return;

      const deleteAt = Date.now() + 60000;
      this.deleteTimers[acc.id] = setTimeout(async () => {
        await this.deleteAccountById(acc.id);
      }, 60000); // 1 minute

      const timers = JSON.parse(localStorage.getItem('deleteTimers') || '{}');
      timers[acc.id] = deleteAt;
      localStorage.setItem('deleteTimers', JSON.stringify(timers));

      alert('Account will be deleted in 1 minute.');
    },
    donePrivate(acc) {
      if (this.deleteTimers[acc.id]) return;

      const deleteAt = Date.now() + 60000;
      this.deleteTimers[acc.id] = setTimeout(async () => {
        await this.deleteAccountById(acc.id);
      }, 60000); // 1 minute

      const timers = JSON.parse(localStorage.getItem('deleteTimers') || '{}');
      timers[acc.id] = deleteAt;
      localStorage.setItem('deleteTimers', JSON.stringify(timers));

      alert('Account will be deleted in 1 minute.');
    }
  }
};
</script>

<style scoped>
.capcut-home {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.login-btn {
  background: #42b983;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.account-list {
  margin-top: 20px;
}
.account-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px #eee;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.used-text {
  color: #42b983;
  margin-left: 10px;
}
</style>
