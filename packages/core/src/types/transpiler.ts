import { MorphoComponent } from './morpho-component';
import { Plugin } from './plugins';

export interface TranspilerArgs {
  path?: string;
  component: MorphoComponent;
}

export type Transpiler = (args: TranspilerArgs) => string;

export interface BaseTranspilerOptions {
  experimental?: { [key: string]: any };
  prettier?: boolean;
  plugins?: Plugin[];
}
