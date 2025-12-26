<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> EngSolar </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <UserAvatar />
      <q-list>
        <q-item-label header> Projetos </q-item-label>
        <q-item clickable to="/client/clientProjects">
          <q-item-section avatar>
            <q-icon name="folder" />
          </q-item-section>
          <q-item-section> Meus Projetos </q-item-section>
        </q-item>
        <q-item clickable to="/client/newProject">
          <q-item-section avatar>
            <q-icon name="add_box" />
          </q-item-section>
          <q-item-section> Novo Projeto </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserAvatar from 'components/UserAvatar.vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
