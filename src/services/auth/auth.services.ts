import { auth, db } from 'src/key/configKey';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
}

/**
 * Register user in Firebase Auth
 * and create user profile in Firestore
 */
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: AppUser['role'],
): Promise<AppUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  const user: AppUser = {
    uid: credential.user.uid,
    name,
    email,
    role,
  };

  console.log('User created:', user);
  try {
    await setDoc(doc(db, 'users', user.uid), user);
  } catch (error) {
    console.error('Failed to create user document:', error);
    throw error;
  }

  return user;
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Logout
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
