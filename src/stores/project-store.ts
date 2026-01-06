import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  ClientModel,
  ProjectModel,
  NewProjectModel,
  ProjectFilesModel,
  FileMetadataModel,
} from 'src/components/models';
import { getClientById, createClient } from 'src/services/clients/index';
import {
  createProject,
  listProjectsByUser,
  subscribeProjectsByUser,
} from 'src/services/projects/index';
import { createFileMetadata } from 'src/services/files/index';
import { storage, auth } from 'src/key/configKey';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { serverTimestamp } from 'firebase/firestore';

export const useProjectStore = defineStore('project', () => {
  // Project form data (current form being edited)
  const currentFormClient = ref<Partial<ClientModel> | null>(null);
  const currentFormProject = ref<Partial<NewProjectModel> | null>(null);
  const currentFormFiles = ref<Partial<ProjectFilesModel> | null>(null);

  // Projects list and current selected project
  const loading = ref(false);
  const error = ref<string | null>(null);
  const projects = ref<ProjectModel[]>([]);
  const currentProject = ref<ProjectModel | null>(null);

  // Lazy-loaded clients (only fetched when needed)
  const loadedClients = ref<Map<string, ClientModel>>(new Map());
  const clientLoading = ref<string | null>(null);
  const clientError = ref<string | null>(null);

  // Form submission state
  const submitting = ref(false);
  const submitError = ref<string | null>(null);
  const lastSubmittedClientId = ref<string | null>(null);

  // Computed properties
  const hasFormData = computed(
    () => !!currentFormClient.value || !!currentFormProject.value || !!currentFormFiles.value,
  );

  async function fetchProjects(): Promise<void> {
    // Avoid re-fetching if already loaded
    if (projects.value.length > 0) return;
    loading.value = true;
    error.value = null;
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('No user logged in');
      projects.value = await listProjectsByUser(uid);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load projects';
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lazy-load a client by ID. Only fetches from Firestore if not already cached.
   * @param clientId - The ID of the client to load
   * @returns The client data or null if not found
   */
  async function loadClientById(clientId: string): Promise<ClientModel | null> {
    // Return cached client if already loaded
    if (loadedClients.value.has(clientId)) {
      return loadedClients.value.get(clientId) || null;
    }

    clientLoading.value = clientId;
    clientError.value = null;

    try {
      const client = await getClientById(clientId);
      if (client) {
        loadedClients.value.set(clientId, client);
      }
      return client;
    } catch (err) {
      clientError.value = err instanceof Error ? err.message : 'Failed to load client';
      return null;
    } finally {
      clientLoading.value = null;
    }
  }

  /**
   * Get a cached client without fetching
   * @param clientId - The ID of the client
   * @returns The cached client or null if not cached
   */
  function getCachedClient(clientId: string): ClientModel | null {
    return loadedClients.value.get(clientId) || null;
  }

  /**
   * Set the current form data
   */
  function setFormData(
    client: Partial<ClientModel>,
    project: Partial<ProjectModel>,
    files: Partial<ProjectFilesModel>,
  ) {
    currentFormClient.value = client;
    currentFormProject.value = project;
    currentFormFiles.value = files;
  }

  /**
   * Clear the current form data
   */
  function clearFormData() {
    currentFormClient.value = null;
    currentFormProject.value = null;
    currentFormFiles.value = null;
  }

  /**
   * Clear all cached clients (useful when navigating away or refreshing)
   */
  function clearClientCache() {
    loadedClients.value.clear();
  }

  /**
   * Get a client from cache or lazy-load it
   * @param clientId - The ID of the client
   * @returns The client data or null if not found
   */
  async function getOrLoadClient(clientId: string): Promise<ClientModel | null> {
    const cached = getCachedClient(clientId);
    if (cached) return cached;
    return loadClientById(clientId);
  }

  /**
   * Submit a project and its files: create project doc, upload files to Storage,
   * and create file metadata records in Firestore.
   * @param projectData - Full ProjectModel (must include clientId)
   * @param files - ProjectFilesModel with File objects
   * @param uploaderId - optional user id of uploader (falls back to current auth user)
   * @returns projectId
   */
  async function submitProjectForm(
    clientData: ClientModel,
    projectData: NewProjectModel,
    files: Partial<ProjectFilesModel>,
    uploaderId?: string,
  ): Promise<ProjectModel> {
    submitting.value = true;
    submitError.value = null;

    try {
      // uploader id
      const userId = uploaderId || auth.currentUser?.uid || 'unknown';
      projectData.userId = userId;

      // create client document
      const clientId = await createClient(clientData);
      projectData.clientId = clientId;
      lastSubmittedClientId.value = clientId;
      console.log('SUBMIT FLOW\nCreated Client.');

      // Cache the newly created client
      loadedClients.value.set(clientId, clientData);
      // create project document
      const project = await createProject(projectData);
      console.log('SUBMIT FLOW\nCreated Project.');

      // helper to upload a single file and create metadata
      async function handleFileUpload(type: FileMetadataModel['type'], file: File) {
        const nameSafe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `projects/${project.id}/${type}_${Date.now()}_${nameSafe}`;
        const sRef = storageRef(storage, path);
        await uploadBytes(sRef, file);
        const url = await getDownloadURL(sRef);

        const meta: FileMetadataModel = {
          projectId: project.id || '',
          type,
          name: file.name,
          storagePath: path,
          downloadUrl: url,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          uploadedBy: userId,
          uploadedAt: serverTimestamp(),
          version: 1,
        };

        await createFileMetadata(meta);
      }

      // iterate known slots
      const slots: Array<keyof ProjectFilesModel> = ['sitePlan', 'permit', 'contract', 'other'];
      for (const s of slots) {
        const f = files[s];
        if (f instanceof File) {
          // type must match our enum mapping
          const type = s as FileMetadataModel['type'];
          await handleFileUpload(type, f);
        }
      }
      console.log('SUBMIT FLOW\nCreated files.');

      currentProject.value = project;

      return project;
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Failed to submit project';
      return {} as ProjectModel;
    } finally {
      submitting.value = false;
    }
  }

  let unsubscribeProjects: (() => void) | null = null;

  function startProjectsListener() {
    if (unsubscribeProjects) return; // already listening
    const uid = auth.currentUser?.uid;
    if (!uid) {
      error.value = 'No user logged in';
      return;
    }

    loading.value = true;
    unsubscribeProjects = subscribeProjectsByUser(uid, (newProjects) => {
      projects.value = newProjects;
      loading.value = false;
    });
  }

  function stopProjectsListener() {
    if (unsubscribeProjects) {
      unsubscribeProjects();
      unsubscribeProjects = null;
    }
  }

  return {
    // Current form state
    currentFormClient,
    currentFormProject,
    currentFormFiles,
    hasFormData,

    // Projects
    loading,
    error,
    projects,
    currentProject,

    // Lazy-loaded clients
    loadedClients: computed(() => new Map(loadedClients.value)),
    clientLoading,
    clientError,

    // Submission state
    submitting,
    submitError,
    lastSubmittedClientId,

    // Actions
    fetchProjects,
    loadClientById,
    getCachedClient,
    setFormData,
    clearFormData,
    clearClientCache,
    getOrLoadClient,
    submitProjectForm,

    // Real-time listeners
    startProjectsListener,
    stopProjectsListener,
  };
});
