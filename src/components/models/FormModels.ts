/**
 * ClientModel describes the shape of the client document stored in Firestore 'clients' collection.
 */
export interface ClientModel {
  clientName: string;
  clientEmail: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  CPF?: string;
  // ...other client fields
}

/**
 * File metadata record stored in Firestore 'files' collection
 * This is a reference to a single file with metadata and foreign key to project
 */
export interface FileMetadataModel {
  projectId: string; // Foreign key to project
  type: 'sitePlan' | 'permit' | 'contract' | 'other'; // Enum-like categorization
  name: string; // Original filename (e.g., "contract.pdf")
  storagePath: string; // Path in Firebase Storage (e.g., "projects/project_abc123/contract.pdf")
  downloadUrl: string; // Public download URL from Firebase Storage
  mimeType: string; // MIME type (e.g., "application/pdf")
  size: number; // File size in bytes
  uploadedBy: string; // User ID who uploaded the file
  uploadedAt: unknown; // Firestore Timestamp
  version: number; // Version number for tracking updates
}

// Extended model that includes Firestore doc ID
export interface FileModel extends FileMetadataModel {
  id: string;
}

/** ProjectModel describes the shape of the project document stored in Firestore 'projects' collection.
 */
export interface ProjectModel {
  id: string; // Firestore document ID
  projectName: string;
  projectDesc?: string;
  clientId: string; // Foreign key to client document
  userId: string; // Key to user
  inverterBrand?: string;
  inverterPower?: string;
  numberOfInverters?: number | undefined;
  panelBrand?: string;
  panelPower?: string;
  numberOfPanels?: number | undefined;
  systemSizeKW?: number | undefined;
  createdAt: unknown; // Firestore Timestamp
  updatedAt: unknown; // Firestore Timestamp
  status: 'Em Planejamento' | 'Em Criação' | 'Finalizado' | 'Aguardando'; // Enum-like status
  // ...other project fields
}

// Before saving (form data)
export type NewProjectModel = Omit<ProjectModel, 'id'>;

/**
 * Form model for uploading files during project creation
 * This is temporary storage for File objects before uploading to Firebase Storage
 * and creating FileMetadataModel records in Firestore
 */
export interface ProjectFilesModel {
  sitePlan?: File | null;
  permit?: File | null;
  contract?: File | null;
  other?: File | null;
}
