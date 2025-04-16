import { mapImportDeclarationToMorphoImport } from '@/helpers/morpho-imports';
import * as babel from '@babel/core';
import { Context, ParseMorphoOptions } from './types';

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
  const resolvedImport = context.builder.resolvedImports?.find(
    (rImport) => rImport.path === importObject.path,
  );
  if (resolvedImport) {
    delete importObject.imports[resolvedImport.value];
  }

  if (Object.keys(importObject.imports).length > 0) {
    context.builder.component.imports.push(importObject);
  }

  path.remove();
};
