import type { MorphoComponent } from '@/types/morpho-component';

export const addCodeNgAfterViewInit = (json: MorphoComponent, code: string) => {
  if (!json.compileContext) {
    json.compileContext = {
      angular: {
        hooks: {
          ngAfterViewInit: {
            code: '',
          },
        },
      },
    };
  }

  json.compileContext!.angular!.hooks!.ngAfterViewInit.code += code;
};

/**
 * Adds code to the `onUpdate` hook of a MorphoComponent.
 *
 * @param {MorphoComponent} root - The root MorphoComponent.
 * @param {string} code - The code to be added to the `onUpdate` hook.
 */
export const addCodeToOnUpdate = (root: MorphoComponent, code: string) => {
  root.hooks.onUpdate = root.hooks.onUpdate || [];
  root.hooks.onUpdate.push({
    code,
  });
};

/**
 * Adds code to the `onInit` hook of a MorphoComponent.
 *
 * @param {MorphoComponent} root - The root MorphoComponent.
 * @param {string} code - The code to be added to the `onInit` hook.
 */
export const addCodeToOnInit = (root: MorphoComponent, code: string) => {
  if (!root.hooks.onInit?.code) {
    root.hooks.onInit = { code: '' };
  }
  root.hooks.onInit.code += `\n${code};`;
};

/**
 * Creates a reactive state in Angular.
 * Initializes the state with `null` because we cannot access `state.` or `props.` properties before the component is initialized.
 * Adds the code (init/re-init code) to the `onInit` and `onUpdate` hooks.
 * @param root The root MorphoComponent.
 * @param stateName The name of the reactive state.
 * @param code The code to be added to the onInit and onUpdate hooks.
 */
export const makeReactiveState = (root: MorphoComponent, stateName: string, code: string) => {
  root.state[stateName] = { code: 'null', type: 'property' };
  addCodeToOnInit(root, code);
  addCodeToOnUpdate(root, code);
};
