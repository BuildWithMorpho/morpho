import { MorphoComponent } from './morpho-component';

export type Plugin = (options?: any) => {
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
