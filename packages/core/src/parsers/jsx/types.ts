import { MorphoComponent } from '../../types/morpho-component';

export type ParseMorphoOptions = {
  jsonHookNames?: string[];
  compileAwayPackages?: string[];
  typescript: boolean;
};

export type Context = {
  // Babel has other context
  builder: {
    component: MorphoComponent;
  };
};
