import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from 'src/key/configKey';
import type { NewProjectModel, ProjectModel } from 'src/components/models';

/**
 * Create a new project document
 */
export async function createProject(projectData: NewProjectModel): Promise<ProjectModel> {
  const docRef = await addDoc(collection(db, 'projects'), {
    ...projectData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...projectData };
}

/**
 * Get a project by ID
 */
export async function getProjectById(projectId: string): Promise<NewProjectModel | null> {
  const docRef = doc(db, 'projects', projectId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data() as NewProjectModel;
  return null;
}

/**
 * Update a project by ID
 */
export async function updateProject(
  projectId: string,
  updates: Partial<NewProjectModel>,
): Promise<void> {
  const docRef = doc(db, 'projects', projectId);
  await updateDoc(docRef, updates);
}

/**
 * Delete a project by ID
 */
export async function deleteProject(projectId: string): Promise<void> {
  const docRef = doc(db, 'projects', projectId);
  await deleteDoc(docRef);
}

/**
 * Fetch all projects belonging to a specific user.
 * @param userId The UID of the user
 * @returns Promise<ProjectModel[]>
 */
export async function listProjectsByUser(userId: string): Promise<ProjectModel[]> {
  const q = query(collection(db, 'projects'), where('userId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id, // Firestore document ID
    ...(doc.data() as Omit<ProjectModel, 'id'>), // merge with document fields
  }));
}

/**
 * Subscribe to all projects for a given user.
 * Returns an unsubscribe function.
 */
export function subscribeProjectsByUser(
  userId: string,
  callback: (projects: ProjectModel[]) => void,
): () => void {
  const q = query(collection(db, 'projects'), where('userId', '==', userId));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ProjectModel, 'id'>),
    }));
    callback(projects);
  });

  return unsubscribe;
}
