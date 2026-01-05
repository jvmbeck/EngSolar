/**
 * FormModel describes the shape of the entire multi-step New Project Form.
 * This is the single source of truth for all form data across all three steps.
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

export interface FileRef {
  name: string;
  url: string;
  path?: string; // storage path
}

export interface ProjectModel {
  projectName: string;
  projectDesc?: string;
  clientId?: string; // set after client doc creation
  files?: FileRef[]; // store URLs/paths, not raw File objects
  inverterBrand?: string;
  inverterPower?: string;
  numberOfInverters?: number | undefined;
  panelBrand?: string;
  panelPower?: string;
  numberOfPanels?: number | undefined;
  systemSizeKW?: number | undefined;
  // ...other project fields
}

export interface ProjectFilesModel {
  sitePlan?: File | null;
  permit?: File | null;
  contract?: File | null;
  other?: File | null;
}
