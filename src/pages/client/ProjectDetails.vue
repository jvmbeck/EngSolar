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
  const id = route.params.id as string;

  // try to find in store first
  const cached = projectStore.projects.find((p) => p.id === id);
  if (cached) {
    console.log('value was cached. retrieving from store.');
    project.value = cached;
    projectStore.currentProject = cached;
    return;
  }
  console.log('value not cached. fetching from Firestore.');
  // fallback: fetch from Firestore if not cached
  const snap = await getDoc(doc(db, 'projects', id));
  if (snap.exists()) {
    project.value = { id: snap.id, ...(snap.data() as Omit<ProjectModel, 'id'>) };
    projectStore.currentProject = project.value;
    projectStore.projects.push(project.value); // keep cache updated
  }
});
</script>
