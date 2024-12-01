import * as babel from '@babel/core';
import { MorphoImport } from '../../types/morpho-component';
import { Context, ParseMorphoOptions } from './types';

const { types } = babel;

export const mapImportDeclarationToMorphoImport = (
  node: babel.types.ImportDeclaration,
): MorphoImport => {
  const importObject: MorphoImport = {
    imports: {},
    path: node.source.value,
    importKind: node.importKind,
  };
  for (const specifier of node.specifiers) {
    if (types.isImportSpecifier(specifier)) {
      importObject.imports[specifier.local.name] = (
        specifier.imported as babel.types.Identifier
      ).name;
    } else if (types.isImportDefaultSpecifier(specifier)) {
      importObject.imports[specifier.local.name] = 'default';
    } else if (types.isImportNamespaceSpecifier(specifier)) {
      importObject.imports[specifier.local.name] = '*';
    }
  }
  return importObject;
};

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
