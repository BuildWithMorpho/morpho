import { componentToAngular as angular } from './generators/angular';
import { componentToBuilder as builder } from './generators/builder';
import {
  componentToCustomElement as customElement,
  componentToCustomElement as webcomponent,
  componentToHtml as html,
} from './generators/html';
import { componentToMorpho as morpho } from './generators/morpho';
import { componentToLiquid as liquid } from './generators/liquid';
import { componentToReact as react } from './generators/react';
import { componentToReactNative as reactNative } from './generators/react-native';
import { componentToSolid as solid } from './generators/solid';
import { componentToSvelte as svelte } from './generators/svelte';
import { componentToSwift as swift } from './generators/swift-ui';
import { componentToTemplate as template } from './generators/template';
import { componentToVue as vue } from './generators/vue';

export const targets = {
  angular,
  builder,
  customElement,
  html,
  morpho,
  liquid,
  react,
  reactNative,
  solid,
  svelte,
  swift,
  template,
  webcomponent,
  vue,
};
