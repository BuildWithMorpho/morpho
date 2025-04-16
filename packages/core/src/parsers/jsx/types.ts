import { MorphoComponent } from '@/types/morpho-component';
import { Project } from 'ts-morph';

export type ParseMorphoOptions = {
  jsonHookNames?: string[];
  compileAwayPackages?: string[];
  typescript: boolean;
  tsProject?: {
    project: Project;
  };
  filePath?: string;
};

export type ResolvedImport = {
  path: string;
  value: string;
};

export type Context = {
  // Babel has other context
  cwd?: string;
  builder: {
    component: MorphoComponent;
    resolvedImports?: ResolvedImport[];
  };
};
