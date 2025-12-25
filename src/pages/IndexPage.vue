<template>
  <q-page v-if="!userStore.loading" class="row items-center justify-evenly">
    <!-- Your content here, user is guaranteed to be loaded -->
    <div v-if="userStore.user">
      Welcome, {{ userStore.user.name }}! You are a {{ userStore.user.role }}
    </div>
    <q-btn label="logout" @click="logout"></q-btn>
  </q-page>
  <q-page v-else class="row items-center justify-center">
    <q-spinner />
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/user-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();

async function logout() {
  try {
    await userStore.logout();
    await router.push('/login');
    $q.notify({
      progress: true,
      type: 'positive',
      message: 'Logout bem sucedido!',
    });
  } catch (error) {
    console.error('Logout failed:', error);
    $q.notify({
      progress: true,
      type: 'negative',
      message: 'Erro ao fazer logout.',
    });
  }
}
</script>
