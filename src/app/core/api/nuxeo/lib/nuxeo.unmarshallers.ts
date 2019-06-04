import { DirectoryEntry } from './nuxeo.directory-entry';
import { DocumentModel } from './nuxeo.document-model';
import { UserModel } from './nuxeo.user-model';
import { NuxeoPagination, NuxeoResponse } from './base.interface';

const unmarshallers: any = {};

export const Unmarshallers = {
  registerUnmarshaller: (entityType: string, unmarshaller: any): void => {
    unmarshallers[entityType] = unmarshaller;
  },

  unmarshall: (json: any = {}, options: any = {}): any => {
    if (!json) {
      return '';
    }
    const entityType = json['entity-type'];
    const unmarshaller = unmarshallers[entityType];
    return (unmarshaller && unmarshaller(json, options)) || json;
  },
};

export const DocumentUnmarshaller = (json: any = {}, options: any = {}): DocumentModel => new DocumentModel(json, options);

export const DocumentsUnmarshaller = (json: any = {}, options: any = {}): DocumentModel[] => {
  const { entries } = json;
  const docs = entries.map((doc: any) => new DocumentModel(doc, options));
  json.entries = docs;
  return json;
};

export const UserUnmarshaller = (json: any = {}, options: any = {}): UserModel => new UserModel(json, options);

export const DirectoryEntryUnmarshaller = (json: any = {}, options: any = {}): DirectoryEntry => new DirectoryEntry(json, options);

export const DirectoryEntriesUnmarshaller = (json: any = {}, options: any = {}): DirectoryEntry => {
  const { entries } = json;
  const directoryEntries = entries.map((directoryEntry) => new DirectoryEntry(directoryEntry, options));
  json.entries = directoryEntries;
  return json;
};

export const StringUnmarshaller = (json: any = {}, options: any = {}): any => {
  let response;
  try {
    const value = JSON.parse(json.value);
    if (value['entity_type']) {
      response = new NuxeoPagination({ 'entity-type': value.entity_type, entries: value.entities });
    }
  } catch (e) {
    response = new NuxeoResponse({ value: json.value });
  }
  return response;
};
