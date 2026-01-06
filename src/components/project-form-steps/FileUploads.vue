<template>
  <div>
    <div class="row q-gutter-sm">
      <div class="col-12 col-md-6">
        <SingleFilePicker v-model:modelValue="local.sitePlan" label="Site plan" />
      </div>
      <div class="col-12 col-md-6">
        <SingleFilePicker v-model:modelValue="local.permit" label="Permit" />
      </div>
      <div class="col-12 col-md-6">
        <SingleFilePicker v-model:modelValue="local.contract" label="Contract" />
      </div>
      <div class="col-12 col-md-6">
        <SingleFilePicker v-model:modelValue="local.other" label="Other" />
      </div>
    </div>

    <div class="q-mt-sm">
      <div v-for="s in slots" :key="s" class="row items-center q-py-xs">
        <div class="col">
          <strong>{{ slotLabels[s] }}:</strong>
          <span v-if="local[s]"> {{ (local[s] as File).name }} </span>
          <span v-else class="text-grey">No file selected</span>
        </div>
        <q-btn dense flat icon="close" @click="clearSlot(s)" v-if="local[s]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import SingleFilePicker from 'components/SingleFilePicker.vue';
import type { ProjectFilesModel } from 'components/models';

const props = defineProps<{ model?: Partial<ProjectFilesModel> }>();
const emit = defineEmits(['update:model']);

const slots = ['sitePlan', 'permit', 'contract', 'other'] as const;

type Slot = (typeof slots)[number];

const local = reactive<Record<Slot, File | null>>({
  sitePlan: props.model?.sitePlan ?? null,
  permit: props.model?.permit ?? null,
  contract: props.model?.contract ?? null,
  other: props.model?.other ?? null,
});

const slotLabels: Record<Slot, string> = {
  sitePlan: 'Site plan',
  permit: 'Permit',
  contract: 'Contract',
  other: 'Other',
};

watch(
  () => ({ ...local }),
  (v) => {
    emit('update:model', { ...(props.model || {}), ...v } as ProjectFilesModel);
  },
  { deep: true },
);

function clearSlot(k: Slot) {
  local[k] = null;
}
</script>

<style scoped></style>
