import { JSONObject } from '../types/json';

export type JSXLiteContext = {
  '@type': '@builder.io/morpho/context';
  name: string;
  value: JSONObject; // TODO: support non objects too
};
