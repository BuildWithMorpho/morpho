import { MorphoComponent } from '../types/morpho-component';

export type Plugin = (
  options?: any,
) => {
  json?: {
    // Happens before any modifiers
    pre?: (json: MorphoComponent) => MorphoComponent | void;
    // Happens after built in modifiers
    post?: (json: MorphoComponent) => MorphoComponent | void;
  };
  code?: {
    // Happens before formatting
    pre?: (code: string) => string;
    // Happens after formatting
    post?: (code: string) => string;
  };
};

export const runPreJsonPlugins = (
  json: MorphoComponent,
  plugins: Plugin[],
  options?: any,
) => {
  let useJson = json;
  for (const plugin of plugins) {
    const preFunction = plugin(options).json?.pre;
    if (preFunction) {
      useJson = preFunction(json) || json;
    }
  }
  return useJson;
};

export const runPostJsonPlugins = (
  json: MorphoComponent,
  plugins: Plugin[],
  options?: any,
) => {
  let useJson = json;
  for (const plugin of plugins) {
    const postFunction = plugin(options).json?.post;
    if (postFunction) {
      useJson = postFunction(json) || json;
    }
  }
  return useJson;
};

export const runPreCodePlugins = (
  code: string,
  plugins: Plugin[],
  options?: any,
) => {
  let string = code;
  for (const plugin of plugins) {
    const preFunction = plugin(options).code?.pre;
    if (preFunction) {
      string = preFunction(string);
    }
  }
  return string;
};

export const runPostCodePlugins = (
  code: string,
  plugins: Plugin[],
  options?: any,
) => {
  let string = code;
  for (const plugin of plugins) {
    const postFunction = plugin(options).code?.post;
    if (postFunction) {
      string = postFunction(string);
    }
  }
  return string;
};
