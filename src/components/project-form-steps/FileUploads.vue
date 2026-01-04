<template>
  <div>
    <q-file v-model="filesLocal" label="Upload files" multiple use-chips class="q-mb-sm" />

    <div v-if="filesLocal && filesLocal.length">
      <div v-for="(f, i) in filesLocal" :key="i" class="row items-center q-py-xs">
        <div class="col">{{ f.name }}</div>
        <q-btn dense flat icon="close" @click="remove(i)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

/**
 * FormModel describes the shape of the entire multi-step form.
 * Each property is optional because step components only manage their portion.
 */
import type { FormModel } from 'components/models';

/**
 * FileUploads component manages file selection and removal.
 * It receives the full form state via `model` prop and emits partial updates.
 */
const props = defineProps<{ model?: FormModel }>();
const emit = defineEmits(['update:model']);

/**
 * Local ref holds the list of uploaded files.
 * We clone the array from props to ensure reactivity on changes.
 */
const filesLocal = ref<File[]>(props.model?.files ? [...props.model.files] : []);

/**
 * Watch for changes in filesLocal and emit updates to parent.
 * The parent merges these updates into the full form object.
 * This keeps the form state centralized while allowing isolated file management.
 */
watch(filesLocal, () => {
  emit('update:model', { ...(props.model || {}), files: filesLocal.value });
});

/**
 * Remove a file from the list by index.
 * This is called when the user clicks the close button next to a file.
 * @param i - The index of the file to remove
 */
function remove(i: number) {
  filesLocal.value.splice(i, 1);
}
</script>

<style scoped></style>
