import { DocumentModel } from '@core/api';

export interface DocumentFormEvent {
  action: 'Created' | 'Updated' | 'Deleted' | 'Canceled';
  messageType: 'info' | 'success' | 'warning' | 'error';
  messageContent: string;
  doc: DocumentModel | DocumentModel[];
}
