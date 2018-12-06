import { DirectoryEntry } from './nuxeo.directory-entry';
import { Document } from './nuxeo.document';
import { User } from './nuxeo.user';

const unmarshallers: any = {};

export const Unmarshallers = {
  registerUnmarshaller: (entityType: string, unmarshaller: any) => {
    unmarshallers[entityType] = unmarshaller;
  },

  unmarshall: (json: any = {}, options: any = {}) => {
    const entityType = json['entity-type'];
    const unmarshaller = unmarshallers[entityType];
    return (unmarshaller && unmarshaller(json, options)) || json;
  },
};

export const DocumentUnmarshaller = (json: any = {}, options: any = {}) => new Document(json, options);

export const DocumentsUnmarshaller = (json: any = {}, options: any = {}) => {
  const { entries } = json;
  const docs = entries.map((doc: any) => new Document(doc, options));
  json.entries = docs;
  return json;
};

export const UserUnmarshaller = (json: any = {}, options: any = {}) => new User(json, options);

export const DirectoryEntryUnmarshaller = (json: any = {}, options: any = {}) => new DirectoryEntry(json, options);

export const DirectoryEntriesUnmarshaller = (json: any = {}, options: any = {}) => {
  const { entries } = json;
  const directoryEntries = entries.map((directoryEntry) => new DirectoryEntry(directoryEntry, options));
  json.entries = directoryEntries;
  return json;
};
