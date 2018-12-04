import { Document } from './nuxeo.document';
import { User } from './nuxeo.user';

const unmarshallers = {};

export const Unmarshallers = {
  registerUnmarshaller: (entityType: string, unmarshaller: any) => {
    unmarshallers[entityType] = unmarshaller;
  },

  unmarshall: (json: any, options: any) => {
    const entityType = json['entity-type'];
    const unmarshaller = unmarshallers[entityType];
    return (unmarshaller && unmarshaller(json, options)) || json;
  },
};

export const documentUnmarshaller = (json: any, options: any) => new Document(json, options);

export const documentsUnmarshaller = (json: any, options: any) => {
  const { entries } = json;
  const docs = entries.map((doc: any) => new Document(doc, options));
  json.entries = docs;
  return json;
};

export const userUnmarshaller = (json: any, options: any) => new User(json, options);
