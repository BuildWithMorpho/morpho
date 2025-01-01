import { Project } from 'ts-morph';
import { MorphoComponent } from '../../types/morpho-component';

export type ParseMorphoOptions = {
  jsonHookNames?: string[];
  compileAwayPackages?: string[];
  typescript: boolean;
  tsProject?: {
    project: Project;
  };
  filePath?: string;
};

export type Context = {
  // Babel has other context
  builder: {
    component: MorphoComponent;
  };
};
