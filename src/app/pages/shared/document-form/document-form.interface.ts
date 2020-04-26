import { DocumentModel } from '@core/api';

export interface DocumentFormEventMessage {
  type: 'info' | 'success' | 'warning' | 'error';
  content: string;
}

export interface DocumentFormEvent {
  action: 'created' | 'updated' | 'deleted' | 'canceled';
  message: DocumentFormEventMessage;
  doc: DocumentModel | DocumentModel[];
}
