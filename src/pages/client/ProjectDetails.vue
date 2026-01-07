<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4">{{ project?.projectName }}</div>
        <div class="text-subtitle2 text-grey">Client: {{ project?.clientId }}</div>
      </div>
      <div>
        <q-btn color="primary" icon="edit" label="Edit" class="q-mr-sm" />
        <q-btn color="negative" icon="delete" label="Delete" />
      </div>
    </div>

    <!-- Overview Card -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Overview</div>
        <p>{{ project?.projectDesc }}</p>
        <div class="text-caption text-grey">Created: {{ project?.createdAt }}</div>
      </q-card-section>
    </q-card>

    <!-- Files Card
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Files</div>
        <q-list bordered>
          <q-item v-for="file in project?.files" :key="file.name">
            <q-item-section avatar>
              <q-icon name="attach_file" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ file.name }}</q-item-label>
              <q-item-label caption>{{ file.size }} KB</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat icon="download" @click="downloadFile(file)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  -->

    <!-- Floating Action Button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="addFile" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ProjectModel } from 'src/components/models/FormModels';
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

function addFile() {
  console.log('Add file clicked');
  // Implement actual file addition logic here
}
</script>
