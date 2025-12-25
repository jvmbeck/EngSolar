import { boot } from 'quasar/wrappers';
import { auth } from 'src/key/configKey';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from 'src/stores/user-store';

export default boot(() => {
  const userStore = useUserStore();

  onAuthStateChanged(auth, (user) => {
    void userStore.setAuthUser(user);
  });
});
