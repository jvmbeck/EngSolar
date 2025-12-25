import { db } from 'src/key/configKey';
import { doc, getDoc } from 'firebase/firestore';
import { type AppUser } from 'src/services/auth';

export async function getUserById(uid: string): Promise<AppUser | null> {
  return await getDoc(doc(db, 'users', uid)).then((snap) => {
    if (snap.exists()) {
      return snap.data() as AppUser;
    }
    return null;
  });
}
