<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Meus Projetos</div>

    <!-- Loading state -->
    <q-spinner v-if="projectStore.loading" color="primary" size="lg" />

    <!-- Error state -->
    <div v-else-if="projectStore.error" class="text-negative">
      {{ projectStore.error }}
    </div>

    <!-- Projects list -->
    <div v-else>
      <ProjectCard
        v-for="project in projectStore.projects"
        :key="project.id"
        :project="project"
        @view="goToProject"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useProjectStore } from 'src/stores/project-store';
import ProjectCard from 'src/components/ProjectCard.vue';
import type { ProjectModel } from 'src/components/models/FormModels';

const router = useRouter();
const projectStore = useProjectStore();

function goToProject(project: ProjectModel) {
  void router.push({ name: 'project-details', params: { id: project.id } });
}
</script>
