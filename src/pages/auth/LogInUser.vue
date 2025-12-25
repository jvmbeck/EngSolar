<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        filled
        v-model="email"
        label="Seu email *"
        type="email"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Email obrigatório']"
      />
      <q-input
        filled
        v-model="password"
        label="Sua senha *"
        type="password"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Senha obrigatória']"
      />
      <div>
        <q-btn label="Acessar" type="submit" color="primary" />
        <q-btn label="Registar nova conta" type="reset" color="secondary" to="/auth/register" />
      </div>
    </q-form>
  </div>

  <q-btn label="logout" @click="handleLogout"></q-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const $q = useQuasar();
const router = useRouter();
const email = ref('');
const password = ref('');

async function onSubmit() {
  try {
    await userStore.login(email.value, password.value);
    $q.notify({
      progress: true,
      type: 'positive',
      message: 'Login bem sucedido!',
    });

    // Redirect based on role
    const defaultPath = userStore.user?.role === 'admin' ? '/admin' : '/client';
    await router.push(defaultPath);
  } catch (err) {
    console.log(err);
    $q.notify({
      progress: true,
      type: 'negative',
      message: 'Erro ao fazer login. Verifique suas credenciais.',
    });
  }
}

async function handleLogout() {
  try {
    await userStore.logout();
  } catch (error) {
    console.error(error);
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
