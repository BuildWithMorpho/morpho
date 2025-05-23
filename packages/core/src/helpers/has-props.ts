import traverse from 'neotraverse/legacy';
import { MorphoComponent } from '../types/morpho-component';

export const hasProps = (json: MorphoComponent) => {
  let has = false;
  traverse(json).forEach(function (item) {
    // TODO: use proper reference tracking
    if (typeof item === 'string' && item.match(/(^|\W)props\s*\./)) {
      has = true;
      this.stop();
    }
  });
  return has;
};
