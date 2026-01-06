<template>
  <div>
    <q-form @submit.prevent>
      <!-- Basic Project Info -->
      <q-input v-model="local.projectName" label="Nome do Projeto" outlined dense required />
      <q-input
        v-model="local.projectDesc"
        label="Descrição do Projeto"
        type="textarea"
        outlined
        dense
        class="q-mt-sm"
      />

      <!-- System Size -->
      <q-input
        v-model.number="local.systemSizeKW"
        label="Tamanho do Sistema (kW)"
        type="number"
        outlined
        dense
        class="q-mt-sm"
      />

      <!-- Inverter Information -->
      <div class="text-subtitle2 q-mt-md q-mb-sm">Informações do Inversor</div>
      <div class="row q-col-gutter-md">
        <q-input
          v-model="local.inverterBrand"
          label="Marca do Inversor"
          outlined
          dense
          class="col-4"
        />
        <q-input
          v-model="local.inverterPower"
          label="Potência do Inversor"
          type="number"
          outlined
          dense
          class="col-4"
        />
        <q-input
          v-model.number="local.numberOfInverters"
          label="Quantidade de Inversores"
          type="number"
          outlined
          dense
          class="col-4"
        />
      </div>

      <!-- Panel Information -->
      <div class="text-subtitle2 q-mt-md q-mb-sm">Informações dos Painéis</div>
      <div class="row q-col-gutter-md">
        <q-input
          v-model="local.panelBrand"
          label="Marca dos Painéis"
          outlined
          dense
          class="col-4"
        />
        <q-input
          v-model="local.panelPower"
          label="Potência dos Painéis"
          type="number"
          outlined
          dense
          class="col-4"
        />
        <q-input
          v-model.number="local.numberOfPanels"
          label="Quantidade de Painéis"
          type="number"
          outlined
          dense
          class="col-4"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { ProjectModel } from 'components/models';

const props = defineProps<{ model?: ProjectModel }>();
const emit = defineEmits(['update:model']);

const local = reactive<Partial<ProjectModel>>({
  projectName: props.model?.projectName ?? '',
  projectDesc: props.model?.projectDesc ?? '',
  systemSizeKW: props.model?.systemSizeKW ?? undefined,
  inverterBrand: props.model?.inverterBrand ?? '',
  inverterPower: props.model?.inverterPower ?? '',
  numberOfInverters: props.model?.numberOfInverters ?? undefined,
  panelBrand: props.model?.panelBrand ?? '',
  panelPower: props.model?.panelPower ?? '',
  numberOfPanels: props.model?.numberOfPanels ?? undefined,
});

watch(local, () => emit('update:model', { ...(props.model || {}), ...local }), { deep: true });
</script>

<style scoped></style>
