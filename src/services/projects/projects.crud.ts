import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from 'src/key/configKey';
import type { ProjectModel } from 'src/components/models';

/**
 * Create a new project document
 */
export async function createProject(projectData: ProjectModel): Promise<string> {
  const docRef = await addDoc(collection(db, 'projects'), projectData);
  return docRef.id;
}

/**
 * Get a project by ID
 */
export async function getProjectById(projectId: string): Promise<ProjectModel | null> {
  const docRef = doc(db, 'projects', projectId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data() as ProjectModel;
  return null;
}

/**
 * Update a project by ID
 */
export async function updateProject(projectId: string, updates: Partial<ProjectModel>): Promise<void> {
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
export async function getProjectsByClientId(clientId: string): Promise<(ProjectModel & { id: string })[]> {
  const q = query(collection(db, 'projects'), where('clientId', '==', clientId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as ProjectModel), id: d.id }));
}
