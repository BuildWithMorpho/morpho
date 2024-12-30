import { omit } from 'lodash';
import preprocessor from 'svelte-preprocess';
import { parse, preprocess } from 'svelte/compiler';

import { parseCss } from './css';
import { postProcess } from './helpers/post-process';
import { parseHtml } from './html';
import { parseInstance } from './instance';
import { parseModule } from './module';
import { collectTypes, isTypeScriptComponent } from './typescript';

import type { Ast } from 'svelte/types/compiler/interfaces';
import type { MorphoComponent } from '../../types/morpho-component';
import type { SveltosisComponent } from './types';

function mapAstToMorphoJson(
  ast: Ast,
  name: string,
  string_ = '',
  usesTypescript = false,
): MorphoComponent {
  const json: SveltosisComponent = {
    '@type': '@builder.io/morpho/component',
    inputs: [],
    state: {},
    props: {},
    refs: {},
    hooks: {
      onMount: [],
    },
    imports: [],
    children: [],
    context: { get: {}, set: {} },
    subComponents: [],
    meta: {},
    name,
    style: undefined,
  };

  parseModule(ast, json);
  parseInstance(ast, json);
  parseHtml(ast, json);
  parseCss(ast, json);

  postProcess(json);

  if (usesTypescript) {
    collectTypes(string_, json);
  }

  return omit(json, ['props']);
}

export const parseSvelte = async function (
  string_: string,
  path = 'MyComponent.svelte',
): Promise<MorphoComponent> {
  const usesTypescript = isTypeScriptComponent(string_);

  const processedString = await preprocess(
    string_,
    [
      preprocessor({
        typescript: usesTypescript ? { tsconfigFile: false } : false,
      }),
    ],
    {
      filename: path.split('/').pop(),
    },
  );

  const ast = parse(processedString.code);
  const componentName = path.split('/').pop()?.split('.')[0] ?? 'MyComponent';
  return mapAstToMorphoJson(ast, componentName, string_, usesTypescript);
};
