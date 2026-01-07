<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4">{{ project?.projectName }}</div>
        <div class="text-subtitle2 text-grey">Cliente: {{ client?.clientName }}</div>
      </div>
      <div>
        <q-btn color="primary" icon="edit" label="Edit" class="q-mr-sm" />
        <q-btn color="negative" icon="delete" label="Delete" />
      </div>
    </div>

    <!-- Overview Card -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Visão Geral do Projeto</div>
        <p>{{ project?.projectDesc }}</p>
        <div class="text-caption text-grey">Created: {{ project?.createdAt }}</div>
      </q-card-section>
    </q-card>

    <!-- Client Card -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Informações do Cliente</div>

        <div v-if="projectStore.clientLoading === clientId">Loading client…</div>
        <div v-else-if="projectStore.clientError">{{ projectStore.clientError }}</div>
        <div v-else-if="client">
          <div>{{ client.clientName }}</div>
          <div>{{ client.clientEmail }}</div>
          <div>{{ client.phone }}</div>
          <div>{{ client.CPF }}</div>
        </div>
        <div v-else>No client found</div>
      </q-card-section>
    </q-card>

    <!-- Files Card -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Files</div>

        <div v-if="projectStore.fileLoading === project?.id">Loading files…</div>
        <div v-else-if="projectStore.fileError">{{ projectStore.fileError }}</div>
        <q-list v-else>
          <q-item v-for="file in files" :key="file.id">
            <q-item-section avatar>
              <q-icon name="attach_file" />
            </q-item-section>
            <q-item-section>
              <div class="text-h6">{{ file.type }}</div>
              <q-item-label>{{ file.name }}</q-item-label>
              <q-item-label caption>{{ (file.size / 1024).toFixed(1) }} KB</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat icon="download" @click="downloadFile(file)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { ProjectModel, FileModel } from 'src/components/models/FormModels';
import { useProjectStore } from 'src/stores/project-store';
import { useRoute } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'src/key/configKey';

const route = useRoute();
const projectStore = useProjectStore();

const project = ref<ProjectModel | null>(null);
const client = computed(() =>
  clientId.value ? projectStore.getCachedClient(clientId.value) : null,
);

// Computed: get cached files
const files = computed(() => projectStore.getCachedFiles(project.value?.id || ''));

const clientId = computed(() => project.value?.clientId || null);

onMounted(async () => {
  const id = route.params.id as string;

  // try to find in store first
  const cached = projectStore.projects.find((p) => p.id === id);
  if (cached) {
    console.log('value was cached. retrieving from store.');
    project.value = cached;
    if (clientId.value) {
      await projectStore.loadClientById(clientId.value);
    }
    await projectStore.loadFilesByProject(project?.value.id);

    return;
  }
  console.log('value not cached. fetching from Firestore.');
  // fallback: fetch from Firestore if not cached
  const snap = await getDoc(doc(db, 'projects', id));
  if (snap.exists()) {
    project.value = { id: snap.id, ...(snap.data() as Omit<ProjectModel, 'id'>) };
    projectStore.projects.push(project.value); // keep cache updated
  }
});

function downloadFile(file: FileModel) {
  // implement download logic (e.g. window.open(file.url))
  console.log('Download', file);
  window.open(file.downloadUrl);
}
</script>
