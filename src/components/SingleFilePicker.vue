<template>
  <div>
    <q-file v-model="localFile" :label="label" :multiple="false" dense use-chips class="q-mb-sm" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ label?: string; modelValue?: File | null | undefined }>();
const emit = defineEmits(['update:modelValue']);

const localFile = ref<File | null>(props.modelValue ?? null);

watch(
  () => props.modelValue,
  (v) => {
    localFile.value = v ?? null;
  },
);

watch(localFile, (v) => {
  emit('update:modelValue', v ?? null);
});
</script>

<style scoped></style>
