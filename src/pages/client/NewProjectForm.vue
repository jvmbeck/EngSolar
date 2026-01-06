<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Novo Projeto</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-stepper v-model="step" flat animated>
          <q-step name="1" title="Cliente" icon="person">
            <client-info :model="client" @update:model="updateModel" />
          </q-step>

          <q-step name="2" title="Projeto" icon="folder">
            <project-info :model="project" @update:model="updateModel" />
          </q-step>

          <q-step name="3" title="Arquivos" icon="upload_file">
            <file-uploads :model="uploadFiles" @update:model="updateModel" />
          </q-step>
        </q-stepper>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          label="Back"
          :disabled="step === '1'"
          @click="step = String(Math.max(1, parseInt(step) - 1))"
        />
        <q-btn flat label="Next" v-if="parseInt(step) < 3" @click="nextStep" />
        <q-btn color="primary" label="Submit" v-if="step === '3'" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import ClientInfo from 'components/project-form-steps/ClientInfo.vue';
import ProjectInfo from 'components/project-form-steps/ProjectInfo.vue';
import FileUploads from 'components/project-form-steps/FileUploads.vue';
import type { ClientModel, ProjectModel, ProjectFilesModel } from 'components/models';
import { useProjectStore } from 'src/stores/project-store';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user-store';
import { serverTimestamp } from 'firebase/firestore';

const $q = useQuasar();

const projectStore = useProjectStore();
const userStore = useUserStore();

/** Track the current step in the wizard ('1', '2', or '3') as a string to match q-step names */
const step = ref<string>('1');

/**
 * The main form state object holds all data entered across all three steps.
 * This allows child components to access the full form state and submit everything at once.
 */
const client = reactive<ClientModel>({
  clientName: '',
  clientEmail: '',
  phone: '',
  address: '',
  addressNumber: '',
  city: '',
  state: '',
  zipCode: '',
  CPF: '',
});

const project = reactive<ProjectModel>({
  projectName: '',
  projectDesc: '',
  clientId: '',
  userId: userStore.user?.uid || '',
  inverterBrand: '',
  inverterPower: '',
  numberOfInverters: undefined,
  panelBrand: '',
  panelPower: '',
  numberOfPanels: undefined,
  systemSizeKW: undefined,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  status: 'Em Planejamento',
});

const uploadFiles: ProjectFilesModel = reactive({
  sitePlan: null,
  permit: null,
  contract: null,
  other: null,
});

/**
 * Update the form state when child components emit changes.
 * This merges partial updates from step components into the appropriate model.
 * @param updated - Partial form data to merge into the appropriate model
 */
function updateModel(updated: Record<string, unknown>) {
  if ('sitePlan' in updated || 'permit' in updated || 'contract' in updated || 'other' in updated) {
    Object.assign(uploadFiles, updated as Partial<ProjectFilesModel>);
    return;
  }
  if ('clientName' in updated || 'clientEmail' in updated) {
    Object.assign(client, updated as Partial<ClientModel>);
    return;
  }
  if ('projectName' in updated || 'projectDesc' in updated) {
    Object.assign(project, updated as Partial<ProjectModel>);
    return;
  }
}

/**
 * Validate that required fields are filled for a given step.
 * Step 1 (Client): requires clientName and clientEmail
 * Step 2 (Project): requires projectName
 * Step 3 (Files): no required validation (files are optional)
 * @param n - The step number to validate (as a number)
 * @returns true if the step is valid, false otherwise
 */
function validateStep(n: number) {
  if (n === 1) return !!client.clientName && !!client.clientEmail;
  if (n === 2) return !!project.projectName;
  return true;
}

/**
 * Move to the next step after validating the current step.
 * Shows an alert if validation fails.
 */
function nextStep() {
  if (!validateStep(parseInt(step.value))) {
    alert('Please fill required fields for this step');
    return;
  }
  step.value = String(Math.min(3, parseInt(step.value) + 1));
}

/**
 * Submit the full form data.
 */
async function submit() {
  // assemble same payload as before using the split models
  console.log('Submitting:', { client, project, files: uploadFiles });

  try {
    projectStore.submitting = true;
    // First, create the client and get its ID
    const clientId = await projectStore.submitClientForm(client);
    // Now, create a project linked to this clientId
    console.log('Client created:', clientId);
    project.clientId = clientId;
    const projectId = await projectStore.submitProjectForm(project, uploadFiles);
    console.log('Project created:', projectId);
    $q.notify({
      type: 'positive',
      message: 'Projeto enviado com sucesso!',
    });
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Falha ao enviar o projeto. Por favor, tente novamente.',
    });
    console.log(err);
    console.error('Submission failed:', projectStore.submitError);
  }
}
</script>

<style scoped></style>
