<template>
  <div class="register-user">
    <h1>Registrar Conta</h1>
    <form @submit="registerUser">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <div>
      <q-option-group v-model="clientOrAdmin" :options="groupOptions"></q-option-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const $q = useQuasar();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const clientOrAdmin = ref<'client' | 'admin'>('client');

const groupOptions = [
  { label: 'Client', value: 'client' },
  { label: 'Admin', value: 'admin' },
];

async function registerUser(event: SubmitEvent) {
  event.preventDefault();

  try {
    await userStore.register(email.value, password.value, name.value, clientOrAdmin.value);
    $q.notify({
      progress: true,
      type: 'positive',
      message: 'Registro bem sucedido!',
    });
    await router.push('/');
  } catch (err) {
    console.log(err);
    $q.notify({
      progress: true,
      type: 'negative',
      message: 'Erro ao registrar usuário.',
    });
  }
}
</script>

<style scoped>
.register-user {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
}
.register-user h1 {
  text-align: center;
  margin-bottom: 24px;
}
.register-user form > div {
  margin-bottom: 16px;
}
.register-user label {
  display: block;
  margin-bottom: 4px;
}
.register-user input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.register-user button {
  width: 100%;
  padding: 10px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.register-user .error {
  color: #d32f2f;
  margin-top: 12px;
  text-align: center;
}
.register-user .success {
  color: #388e3c;
  margin-top: 12px;
  text-align: center;
}
</style>
