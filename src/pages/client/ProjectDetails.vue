<template>
  <q-page padding>
    <div class="text-h5">Detalhes do Projeto</div>

    <div v-if="project">
      <p><strong>Nome:</strong> {{ project.projectName }}</p>
      <p><strong>Status:</strong> {{ project.status }}</p>
      <p><strong>Descrição:</strong> {{ project.projectDesc }}</p>
    </div>

    <q-spinner v-else color="primary" size="lg" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ProjectModel } from 'src/components/models';
import { useProjectStore } from 'src/stores/project-store';
import { useRoute } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'src/key/configKey';

const route = useRoute();
const projectStore = useProjectStore();
const project = ref<ProjectModel | null>(null);

onMounted(async () => {
  // If store already has the project, reuse it
  if (projectStore.currentProject && projectStore.currentProject.id === route.params.id) {
    project.value = projectStore.currentProject;
    console.log('Store had project stored already!');

    return;
  }
  console.log('Had to fetch from firestore!');

  // Otherwise fetch from Firestore
  const snap = await getDoc(doc(db, 'projects', route.params.id as string));
  if (snap.exists()) {
    project.value = { id: snap.id, ...(snap.data() as Omit<ProjectModel, 'id'>) };
    projectStore.currentProject = project.value; // keep store in sync
  }
});
</script>
