<template>
  <div>
    <q-form @submit.prevent>
      <q-input v-model="local.clientName" label="Client name" outlined dense />
      <q-input
        v-model="local.clientEmail"
        label="Client email"
        type="email"
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
 * ClientInfo component collects client information (name and email).
 * It receives the full form state via `model` prop and emits partial updates.
 */
const props = defineProps<{ model?: FormModel }>();
const emit = defineEmits(['update:model']);

/**
 * Local reactive state mirrors the client fields from props.
 * This allows two-way binding on inputs without directly modifying props.
 */
const local = reactive<{ clientName: string; clientEmail: string }>({
  clientName: props.model?.clientName ?? '',
  clientEmail: props.model?.clientEmail ?? '',
});

/**
 * Watch for changes in local state and emit updates to parent.
 * The parent merges these updates into the full form object.
 * This keeps the form state centralized while allowing isolated input management.
 */
watch(local, () => emit('update:model', { ...(props.model || {}), ...local }), { deep: true });
</script>

<style scoped></style>
