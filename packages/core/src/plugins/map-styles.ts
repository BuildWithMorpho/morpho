import { TraverseContext } from 'traverse';
import { getStyles, setStyles } from '../helpers/get-styles';
import { traverseNodes } from '../helpers/traverse-nodes';
import { MorphoComponent } from '../types/morpho-component';
import { MorphoStyles } from '../types/morpho-styles';

type MapStylesOptions = {
  map: (styles: MorphoStyles, context: TraverseContext) => MorphoStyles;
};

export const mapStyles = (pluginOptions: MapStylesOptions) => (options: any) => ({
  json: {
    pre: (json: MorphoComponent) => {
      traverseNodes(json, (node, context) => {
        const styles = getStyles(node);
        setStyles(node, pluginOptions.map(styles || {}, context));
      });
    },
  },
});
