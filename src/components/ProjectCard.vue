<template>
  <q-card class="q-ma-md" bordered flat>
    <q-card-section>
      <div class="text-h6">{{ project.projectName }}</div>
      <div class="text-subtitle2 text-grey">
        Status:
        <q-badge :color="statusColor" align="middle">{{ project.status }}</q-badge>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div class="col-6">
          <q-icon name="event" size="sm" class="q-mr-xs" />
          Criado em: {{ formatDate(project.createdAt) }}
        </div>
        <div class="col-6">
          <q-icon name="description" size="sm" class="q-mr-xs" />
          {{ project.projectDesc || 'Sem descrição' }}
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat icon="visibility" label="Ver detalhes" @click="$emit('view', project)" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { date } from 'quasar';
import type { ProjectModel } from './models';

const props = defineProps<{
  project: ProjectModel;
}>();
/*
const emit = defineEmits<{
  (e: 'view', project: ProjectModel): void;
}>();
*/
const statusColor = computed(() => {
  switch (props.project.status) {
    case 'Em Planejamento':
      return 'orange';
    case 'Em Criação':
      return 'blue';
    case 'Finalizado':
      return 'green';
    case 'Aguardando':
      return 'grey';
    default:
      return 'grey';
  }
});

const formatDate = (ts: unknown) => {
  if (!ts) return '-';
  // Se for Firestore Timestamp, converta para Date
  // @ts-expect-error -- IGNORE --
  const dateObj = ts.toDate ? ts.toDate() : new Date(ts);
  return date.formatDate(dateObj, 'DD/MM/YYYY');
};
</script>
