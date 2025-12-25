import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, registerUser, logoutUser, type AppUser } from 'src/services/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { getUserById } from 'src/services/users/users.crud';

export const useUserStore = defineStore('user', () => {
  const authUser = ref<FirebaseUser | null>(null);
  const user = ref<AppUser | null>(null);
  const loading = ref(false);
  const authReady = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    authReady.value = false;

    try {
      await loginUser(email, password);

      // Wait for authReady to be set to true (when user profile is fetched)
      while (!authReady.value) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    } catch (err) {
      error.value = 'Invalid email or password';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string, name: string, role: AppUser['role']) {
    loading.value = true;
    error.value = null;

    try {
      user.value = await registerUser(email, password, name, role);
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await logoutUser();
    user.value = null;
  }

  async function setAuthUser(firebaseUser: FirebaseUser | null): Promise<void> {
    loading.value = true;

    try {
      authUser.value = firebaseUser;
    } finally {
      console.log('Auth User loaded: ', authUser.value);
      await fetchUserProfile();
      console.log('isAuth: ', isAuthenticated.value);
      loading.value = false;
      authReady.value = true;
    }

    if (!firebaseUser) {
      user.value = null;
    }
  }

  async function fetchUserProfile() {
    if (authUser.value) {
      loading.value = true;
      try {
        user.value = await getUserById(authUser.value.uid);
        console.log('Fetched user profile: ', user.value);
      } catch (err) {
        error.value = 'Failed to fetch user profile';
        throw err;
      } finally {
        loading.value = false;
      }
    } else {
      user.value = null;
    }
  }

  return {
    user,
    loading,
    authReady,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    setAuthUser,
  };
});
