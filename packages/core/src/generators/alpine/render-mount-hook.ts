import { curry } from 'lodash';
import { MorphoComponent } from '../../types/morpho-component';
import { hasWatchHooks, renderWatchHooks } from './render-update-hooks';

function shouldRenderMountHook(json: MorphoComponent): boolean {
  return json.hooks.onMount !== undefined || hasWatchHooks(json);
}

export const renderMountHook = curry((json: MorphoComponent, objectString: string) => {
  return shouldRenderMountHook(json)
    ? objectString.replace(
        /(?:,)?(\s*)(}\s*)$/,
        `, init() {
      ${renderWatchHooks(json)}
      ${json.hooks.onMount?.code ?? ''}
    }$1$2`,
      )
    : objectString;
});
