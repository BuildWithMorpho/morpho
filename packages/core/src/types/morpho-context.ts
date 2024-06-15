import { JSONObject } from './json';

export type MorphoContext = {
  '@type': '@builder.io/morpho/context';
  name: string;
  value: JSONObject; // TODO: support non objects too
};
