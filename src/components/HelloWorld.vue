<template>
  <div class="capcut-home">
    <header>
      <h1 style="font-size:2.2rem;color:#2563eb;font-weight:bold;">CapCut Premium Accounts</h1>
      <button class="login-btn" @click="$emit('show-login')">Admin Login</button>
    </header>
    <div class="account-list">
      <h2 style="font-size:1.4rem;color:#2563eb;font-weight:bold;">Available Accounts</h2>
      <div v-if="loading">Loading accounts...</div>
      <div v-else-if="accounts.length === 0">No accounts available.</div>
      <div v-else>
        <div v-for="acc in accounts" :key="acc.id" class="account-card">
          <div class="account-info">
            <div>
              <strong>Account Type:</strong>
              <select class="account-type-select" v-model="accountTypes[acc.id]" @change="updateAccountType(acc.id, accountTypes[acc.id])">
                <option value="share">Share</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div style="margin-top:8px;">Email: <span style="font-weight:bold;">{{ acc.email }}</span></div>
            <div>Password: <span style="font-weight:bold;">{{ acc.password }}</span></div>
          </div>
          <div class="account-actions">
            <button class="big-btn copy-btn" @click="copyAccount(acc)">Copy Account</button>
            <span v-if="copiedId === acc.id" class="used-text">Copied!</span>
            <div v-if="accountTypes[acc.id] === 'share'">
              <div>User count: <span style="font-weight:bold;">{{ acc.count || 0 }} / 3</span></div>
              <div class="count-done-row">
                <button class="big-btn count-btn" @click="incrementShare(acc)">Count</button>
                <button class="big-btn done-btn" @click="doneShare(acc)" :disabled="(acc.count || 0) < 3">Done</button>
              </div>
            </div>
            <div v-else>
              <div class="count-done-row">
                <button class="big-btn done-btn" @click="donePrivate(acc)">Done</button>
              </div>
            </div>
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
      this.deleteAccountById(acc.id);
    },
    donePrivate(acc) {
      if (this.deleteTimers[acc.id]) return;
      this.deleteAccountById(acc.id);
    }
  }
};
</script>

<style scoped>
.capcut-home {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 16px;
  box-shadow: 0 4px 24px #dbeafe;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.login-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 16px 32px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 8px #dbeafe;
  transition: background 0.2s;
}
.login-btn:hover {
  background: #1d4ed8;
}
.account-list {
  margin-top: 20px;
}
.account-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 2px solid #2563eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px #dbeafe;
  gap: 24px;
  flex-wrap: wrap;
}
.account-info {
  flex: 2;
  min-width: 220px;
}
.account-actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
  min-width: 180px;
}
.account-type-select {
  font-size: 1.1rem;
  padding: 10px 18px;
  border-radius: 8px;
  border: 2px solid #2563eb;
  background: #eff6ff;
  color: #2563eb;
  font-weight: bold;
  width: 220px;
  max-width: 100%;
  margin-bottom: 10px;
}
.copy-btn {
  background: #f59e42;
  color: #fff;
  font-size: 1.3rem;
  padding: 18px 36px;
  border-radius: 10px;
  font-weight: bold;
  margin-bottom: 12px;
}
.copy-btn:hover {
  background: #ea580c;
}
.count-btn {
  background: #22c55e;
  color: #fff;
}
.count-btn:hover {
  background: #16a34a;
}
.done-btn {
  background: #2563eb;
  color: #fff;
}
.done-btn:hover {
  background: #1d4ed8;
}
.count-done-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: center;
  margin-top: 16px;
}
.big-btn {
  font-size: 1.3rem;
  padding: 18px 36px;
  border-radius: 10px;
  font-weight: bold;
}
@media (min-width: 601px) {
  .account-actions {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  .copy-btn {
    width: 100%;
    margin-bottom: 18px;
    margin-top: 12px;
    display: block;
  }
  .count-done-row {
    flex-direction: row;
    gap: 48px;
    justify-content: center;
    margin-top: 18px;
  }
}
@media (max-width: 1200px) {
  .capcut-home {
    max-width: 98vw;
    padding: 10px;
  }
  .account-card {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 16px;
  }
  .account-actions {
    align-items: stretch;
    min-width: unset;
  }
}
@media (max-width: 900px) {
  .capcut-home {
    max-width: 100vw;
    padding: 10px;
  }
  .account-card {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 16px;
  }
  .account-actions {
    align-items: stretch;
    min-width: unset;
  }
  .count-done-row {
    gap: 10px;
  }
}
@media (max-width: 800px) {
  .capcut-home {
    padding: 4px;
  }
  .account-card {
    padding: 10px;
    gap: 8px;
  }
  .big-btn, .login-btn {
    font-size: 1rem;
    padding: 10px 16px;
  }
}
@media (max-width: 600px) {
  .account-card {
    padding: 10px;
    gap: 8px;
  }
  .big-btn, .login-btn {
    font-size: 1rem;
    padding: 10px 16px;
  }
  .count-done-row {
    gap: 6px;
  }
  .account-type-select {
    font-size: 1.2rem;
    padding: 12px 0;
    width: 90vw;
    max-width: 320px;
    margin-bottom: 12px;
  }
}
@media (max-width: 500px) {
  .count-done-row {
    gap: 16px;
  }
  .big-btn {
    font-size: 1.15rem;
    padding: 16px 18px;
  }
}
</style>
