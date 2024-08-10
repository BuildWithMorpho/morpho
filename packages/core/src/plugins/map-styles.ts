import { getStyles, setStyles } from '../helpers/get-styles';
import { MorphoComponent } from '../types/morpho-component';
import { TraverseContext } from 'traverse';
import { MorphoStyles } from '../types/morpho-styles';
import { tarverseNodes } from '../helpers/traverse-nodes';

type MapStylesOptions = {
  map: (styles: MorphoStyles, context: TraverseContext) => MorphoStyles;
};

export const mapStyles =
  (pluginOptions: MapStylesOptions) => (options: any) => ({
    json: {
      pre: (json: MorphoComponent) => {
        tarverseNodes(json, (node, context) => {
          const styles = getStyles(node);
          setStyles(node, pluginOptions.map(styles || {}, context));
        });
      },
    },
  });
