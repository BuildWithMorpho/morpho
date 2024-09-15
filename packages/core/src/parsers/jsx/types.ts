import { MorphoComponent } from '../../types/morpho-component';

export type ParseMorphoOptions = {
  format: 'react' | 'simple';
  jsonHookNames?: string[];
  compileAwayPackages?: string[];
};

export type Context = {
  // Babel has other context
  builder: {
    component: MorphoComponent;
  };
};
