<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Meus Projetos</div>
    <div class="row">
      <div class="col-12 col-md-6" v-for="p in projects" :key="p.id">
        <ProjectCard :project="p" @view="goToProject" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProjectCard from 'src/components/ProjectCard.vue';
import type { ProjectModel } from 'src/components/models';
import { db, auth } from 'src/key/configKey';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();

interface ProjectDoc extends ProjectModel {
  id: string;
}

const projects = ref<ProjectDoc[]>([]);

const goToProject = async (project: ProjectDoc) => {
  console.log('View project', project.id);
  await router.push({ name: 'project-details', params: { id: project.id } });
};

onMounted(async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const q = query(collection(db, 'projects'), where('userId', '==', uid));
  const snapshot = await getDocs(q);

  projects.value = snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProjectModel, 'id'>),
  }));
});
</script>
