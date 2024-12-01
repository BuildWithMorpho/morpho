import { Project, Symbol } from 'ts-morph';
import { MorphoComponent } from '../../types/morpho-component';

export type ParseMorphoOptions = {
  jsonHookNames?: string[];
  compileAwayPackages?: string[];
  typescript: boolean;
  tsProject?: {
    project: Project;
    signalSymbol: Symbol;
  };
  filePath?: string;
};

export type Context = {
  // Babel has other context
  builder: {
    component: MorphoComponent;
  };
};
