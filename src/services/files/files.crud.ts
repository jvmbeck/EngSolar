import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from 'src/key/configKey';
import type { FileMetadataModel } from 'src/components/models';

/**
 * Create a file metadata record
 */
export async function createFileMetadata(fileData: FileMetadataModel): Promise<string> {
  const docRef = await addDoc(collection(db, 'files'), fileData);
  return docRef.id;
}

/**
 * Get a file metadata record by ID
 */
export async function getFileById(fileId: string): Promise<FileMetadataModel | null> {
  const docRef = doc(db, 'files', fileId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data() as FileMetadataModel;
  return null;
}

/**
 * Update a file metadata record
 */
export async function updateFile(fileId: string, updates: Partial<FileMetadataModel>): Promise<void> {
  const docRef = doc(db, 'files', fileId);
  await updateDoc(docRef, updates);
}

/**
 * Delete a file metadata record
 */
export async function deleteFile(fileId: string): Promise<void> {
  const docRef = doc(db, 'files', fileId);
  await deleteDoc(docRef);
}

/**
 * Get all files for a project
 */
export async function getFilesByProjectId(projectId: string): Promise<(FileMetadataModel & { id: string })[]> {
  const q = query(collection(db, 'files'), where('projectId', '==', projectId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as FileMetadataModel), id: d.id }));
}

/**
 * Get files for a project filtered by type
 */
export async function getFilesByProjectIdAndType(projectId: string, type: FileMetadataModel['type']): Promise<(FileMetadataModel & { id: string })[]> {
  const q = query(collection(db, 'files'), where('projectId', '==', projectId), where('type', '==', type));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as FileMetadataModel), id: d.id }));
}
