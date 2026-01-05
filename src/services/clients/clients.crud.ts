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
} from 'firebase/firestore';
import { db } from 'src/key/configKey';
import type { ClientModel } from 'src/components/models';

/**
 * Create a new client in Firestore
 * @param clientData - The client data to create
 * @returns The ID of the newly created client document
 */
export async function createClient(clientData: ClientModel): Promise<string> {
  const docRef = await addDoc(collection(db, 'clients'), clientData);
  return docRef.id;
}

/**
 * Get a client by ID
 * @param clientId - The ID of the client to fetch
 * @returns The client data or null if not found
 */
export async function getClientById(clientId: string): Promise<ClientModel | null> {
  const docRef = doc(db, 'clients', clientId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as ClientModel;
  } else {
    return null;
  }
}

/**
 * Update a client by ID
 * @param clientId - The ID of the client to update
 * @param updates - Partial client data to update
 */
export async function updateClient(clientId: string, updates: Partial<ClientModel>): Promise<void> {
  const docRef = doc(db, 'clients', clientId);
  await updateDoc(docRef, updates);
}

/**
 * Delete a client by ID
 * @param clientId - The ID of the client to delete
 */
export async function deleteClient(clientId: string): Promise<void> {
  const docRef = doc(db, 'clients', clientId);
  await deleteDoc(docRef);
}

/**
 * Get all clients for a specific user (email)
 * @param email - The email of the user to filter by
 * @returns Array of clients
 */
export async function getClientsByEmail(email: string): Promise<ClientModel[]> {
  const q = query(collection(db, 'clients'), where('clientEmail', '==', email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id }) as ClientModel & { id: string },
  );
}
