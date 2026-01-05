<template>
  <div>
    <q-form @submit.prevent>
      <!-- Required Fields -->
      <q-input v-model="local.clientName" label="Nome do Cliente" outlined dense required />
      <q-input
        v-model="local.clientEmail"
        label="Email do Cliente"
        type="email"
        outlined
        dense
        class="q-mt-sm"
        required
      />
      <q-input v-model="local.CPF" label="CPF" outlined dense class="q-mt-sm" required />

      <!-- Optional Fields -->
      <q-input v-model="local.phone" label="Telefone" outlined dense class="q-mt-sm" />

      <!-- Address Fields -->
      <div class="row q-col-gutter-md q-mt-xs">
        <q-input v-model="local.address" label="Endereço" outlined dense class="col-8" />
        <q-input v-model="local.addressNumber" label="Número" outlined dense class="col-4" />
      </div>

      <div class="row q-col-gutter-md q-mt-xs">
        <q-select
          v-model="local.state"
          :options="estados"
          label="Estado"
          outlined
          dense
          class="col-3"
          emit-value
          map-options
          @update:model-value="local.city = ''"
        />
        <q-select
          v-model="local.city"
          :options="availableCities"
          label="Cidade"
          outlined
          dense
          class="col-6"
          :disable="!local.state"
          emit-value
          map-options
        />
        <q-input v-model="local.zipCode" label="CEP" outlined dense class="col-3" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import type { ClientModel } from 'components/models';
import { brasileiraoEstados, cidades } from 'src/data/brazilianData';

const props = defineProps<{ model?: ClientModel }>();
const emit = defineEmits(['update:model']);

const local = reactive<Partial<ClientModel>>({
  clientName: props.model?.clientName ?? '',
  clientEmail: props.model?.clientEmail ?? '',
  phone: props.model?.phone ?? '',
  address: props.model?.address ?? '',
  addressNumber: props.model?.addressNumber ?? '',
  city: props.model?.city ?? '',
  state: props.model?.state ?? '',
  zipCode: props.model?.zipCode ?? '',
  CPF: props.model?.CPF ?? '',
});

// States list for the dropdown
const estados = brasileiraoEstados;

// Computed property that returns cities for the selected state
const availableCities = computed(() => {
  return local.state ? cidades[local.state] || [] : [];
});

watch(local, () => emit('update:model', { ...(props.model || {}), ...local }), { deep: true });
</script>

<style scoped></style>
