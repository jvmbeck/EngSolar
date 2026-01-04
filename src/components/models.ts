/**
 * FormModel describes the shape of the entire multi-step New Project Form.
 * This is the single source of truth for all form data across all three steps.
 */
export interface FormModel {
  clientName?: string;
  clientEmail?: string;
  projectName?: string;
  projectDesc?: string;
  files?: File[];
}
