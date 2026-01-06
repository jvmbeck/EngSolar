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
 * Query projects by clientId
 */
export async function getProjectsByClientId(
  clientId: string,
): Promise<(NewProjectModel & { id: string })[]> {
  const q = query(collection(db, 'projects'), where('clientId', '==', clientId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as NewProjectModel), id: d.id }));
}
