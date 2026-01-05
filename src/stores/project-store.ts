import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ClientModel, ProjectModel, ProjectFilesModel } from 'src/components/models';
import { getClientById, createClient } from 'src/services/clients/index';

export const useProjectStore = defineStore('project', () => {
  // Project form data (current form being edited)
  const currentClient = ref<Partial<ClientModel> | null>(null);
  const currentProject = ref<Partial<ProjectModel> | null>(null);
  const currentFiles = ref<Partial<ProjectFilesModel> | null>(null);

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
    () => !!currentClient.value || !!currentProject.value || !!currentFiles.value,
  );

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
    currentClient.value = client;
    currentProject.value = project;
    currentFiles.value = files;
  }

  /**
   * Clear the current form data
   */
  function clearFormData() {
    currentClient.value = null;
    currentProject.value = null;
    currentFiles.value = null;
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
   * Submit client form data to Firestore
   * @param clientData - The client data to submit
   * @returns The ID of the created client document
   * @throws Error if submission fails
   */
  async function submitClientForm(clientData: ClientModel): Promise<string> {
    submitting.value = true;
    submitError.value = null;

    try {
      const clientId = await createClient(clientData);
      lastSubmittedClientId.value = clientId;

      // Cache the newly created client
      loadedClients.value.set(clientId, clientData);

      return clientId;
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Failed to submit client form';
      throw err;
    } finally {
      submitting.value = false;
    }
  }

  return {
    // Current form state
    currentClient,
    currentProject,
    currentFiles,
    hasFormData,

    // Lazy-loaded clients
    loadedClients: computed(() => new Map(loadedClients.value)),
    clientLoading,
    clientError,

    // Submission state
    submitting,
    submitError,
    lastSubmittedClientId,

    // Actions
    loadClientById,
    getCachedClient,
    setFormData,
    clearFormData,
    clearClientCache,
    getOrLoadClient,
    submitClientForm,
  };
});
