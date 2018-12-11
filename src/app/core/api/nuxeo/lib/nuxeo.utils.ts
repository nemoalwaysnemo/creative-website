import { DocumentModel } from './nuxeo.document-model';
import { BatchUpload } from './nuxeo.batch-upload';
import { BatchBlob } from './nuxeo.batch-blob';

export function isDocument(obj: any): boolean {
  return (obj instanceof DocumentModel || (typeof obj === 'object' && obj['entity-type'] === 'document'));
}

export function isBatch(obj: any): boolean {
  return obj instanceof BatchUpload || obj instanceof BatchBlob;
}

export function isBatchUpload(obj: any): boolean {
  return obj instanceof BatchUpload;
}

export function isBatchBlob(obj: any): boolean {
  return obj instanceof BatchBlob;
}
