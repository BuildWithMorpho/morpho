import * as babel from '@babel/core';
import { mapImportDeclarationToMorphoImport } from '../../helpers/morpho-imports';
import { Context, ParseMorphoOptions } from './types';

const { types } = babel;

export const handleImportDeclaration = ({
  options,
  path,
  context,
}: {
  options: Partial<ParseMorphoOptions>;
  path: babel.NodePath<babel.types.ImportDeclaration>;
  context: Context;
}) => {
  // @builder.io/morpho or React imports compile away
  const customPackages = options?.compileAwayPackages || [];
  if (
    ['react', '@builder.io/morpho', '@emotion/react', ...customPackages].includes(
      path.node.source.value,
    )
  ) {
    path.remove();
    return;
  }
  const importObject = mapImportDeclarationToMorphoImport(path.node);
  context.builder.component.imports.push(importObject);

  path.remove();
};
