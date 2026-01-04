<template>
  <div>
    <q-form @submit.prevent>
      <q-input v-model="local.projectName" label="Project name" outlined dense />
      <q-input
        v-model="local.projectDesc"
        label="Project description"
        type="textarea"
        outlined
        dense
        class="q-mt-sm"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

/**
 * FormModel describes the shape of the entire multi-step form.
 * Each property is optional because step components only manage their portion.
 */
import type { FormModel } from 'components/models';

/**
 * ProjectInfo component collects project information (name and description).
 * It receives the full form state via `model` prop and emits partial updates.
 */
const props = defineProps<{ model?: FormModel }>();
const emit = defineEmits(['update:model']);

/**
 * Local reactive state mirrors the project fields from props.
 * This allows two-way binding on inputs without directly modifying props.
 */
const local = reactive<{ projectName: string; projectDesc: string }>({
  projectName: props.model?.projectName ?? '',
  projectDesc: props.model?.projectDesc ?? '',
});

/**
 * Watch for changes in local state and emit updates to parent.
 * The parent merges these updates into the full form object.
 * This keeps the form state centralized while allowing isolated input management.
 */
watch(local, () => emit('update:model', { ...(props.model || {}), ...local }), { deep: true });
</script>

<style scoped></style>
