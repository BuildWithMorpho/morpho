import { tryFormat } from '@/generators/angular/helpers/format';
import { preprocessCssAsJson } from '@/generators/angular/helpers/index';
import { ToAngularOptions } from '@/generators/angular/types';
import { indent } from '@/helpers/indent';
import { collectCss } from '@/helpers/styles/collect-css';
import { MorphoComponent } from '@/types/morpho-component';

export const getAngularStyles = ({
  json,
  options,
}: {
  json: MorphoComponent;
  options: ToAngularOptions;
}): string => {
  preprocessCssAsJson(json);
  let css = collectCss(json);
  if (options.prettier !== false) {
    css = tryFormat(css, 'css');
  }

  const hostDisplayCss = options.visuallyIgnoreHostElement ? ':host { display: contents; }' : '';
  return indent(css.length ? [hostDisplayCss, css].join('\n') : hostDisplayCss, 8);
};
