import { mapImportDeclarationToMorphoImport } from '@/helpers/morpho-imports';
import {
  babelDefaultTransform,
  babelStripTypes,
  isTypescriptFile,
  parseCodeJson,
} from '@/parsers/jsx/helpers';
import { Context, ParseMorphoOptions, ResolvedImport } from '@/parsers/jsx/types';
import { MorphoImport } from '@/types/morpho-component';
import * as babel from '@babel/core';
import { NodePath } from '@babel/core';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

type ResolveData = {
  nodePath: NodePath<babel.types.Program>;
  currentFilePath?: string;
  resolvedImports?: ResolvedImport[];
};

const getCodeFromImport = (
  importObject: MorphoImport,
  currentFile?: string,
): { code?: string; typescript?: boolean; importFilePath?: string } => {
  if (currentFile) {
    // resolve path of import
    const originFile = path.basename(currentFile);
    const typescript = isTypescriptFile(originFile);
    const importFile =
      isTypescriptFile(importObject.path) || importObject.path.endsWith('.js')
        ? importObject.path
        : `${importObject.path}.${typescript ? 'ts' : 'js'}`;
    const importFilePath = path.resolve(path.dirname(currentFile), importFile);
    if (existsSync(importFilePath)) {
      return { code: readFileSync(importFilePath).toString(), typescript, importFilePath };
    }
    return { typescript };
  }

  return {};
};

const fillDeclarations = ({
  declaration,
  valueToResolve,
  currentFilePath,
  nodePath,
}: {
  declaration: babel.types.VariableDeclaration;
  valueToResolve: string;
} & ResolveData): Record<string, any> => {
  let result = {};
  for (const variable of declaration.declarations) {
    if (babel.types.isIdentifier(variable.id)) {
      if (variable.id.name === valueToResolve && variable.init) {
        const filled = resolveObjectsRecursive({
          node: variable.init,
          nodePath,
          currentFilePath,
        });

        result = {
          ...result,
          ...filled,
        };
      }
    }
  }
  return result;
};

const resolve = ({
  nodePath,
  currentFilePath,
  valueToResolve,
  resolvedImports,
}: ResolveData & { valueToResolve: string }): Record<string, any> => {
  let result = {};
  const programNodes = nodePath.node.body;
  for (const statement of programNodes) {
    if (babel.types.isImportDeclaration(statement)) {
      const importObject = mapImportDeclarationToMorphoImport(statement);

      if (Object.keys(importObject.imports).includes(valueToResolve)) {
        if (resolvedImports) {
          // We add this statement, to remove it from imports of generated file
          resolvedImports.push({ path: importObject.path, value: valueToResolve });
        }

        // In this case the variable was imported
        const { code, typescript, importFilePath } = getCodeFromImport(
          importObject,
          currentFilePath,
        );
        if (code) {
          const jsxToUse = babelStripTypes(code, typescript);

          babelDefaultTransform(jsxToUse, {
            Program(path) {
              const statements: babel.types.Statement[] = path.node.body;
              for (const pStatement of statements) {
                if (babel.types.isExportNamedDeclaration(pStatement)) {
                  const declaration = pStatement.declaration;
                  if (babel.types.isVariableDeclaration(declaration)) {
                    const filledDeclaration = fillDeclarations({
                      declaration,
                      valueToResolve,
                      currentFilePath: importFilePath,
                      nodePath: path,
                    });
                    result = {
                      ...result,
                      ...filledDeclaration,
                    };
                  }
                }
              }
            },
          });
        }
      }
    } else if (babel.types.isVariableDeclaration(statement)) {
      // In this case the variable is inside the same file
      const filledDeclaration = fillDeclarations({
        declaration: statement,
        valueToResolve,
        currentFilePath,
        nodePath,
      });
      result = {
        ...result,
        ...filledDeclaration,
      };
    }
  }

  return result;
};

const resolveObjectsRecursive = ({
  node,
  nodePath,
  currentFilePath,
  resolvedImports,
}: {
  node: babel.types.Node;
} & ResolveData): Record<string, any> => {
  let result = {};

  if (babel.types.isObjectExpression(node)) {
    for (const prop of node.properties) {
      if (babel.types.isObjectProperty(prop)) {
        if (babel.types.isIdentifier(prop.key)) {
          const objectKey = prop.key.name;
          if (babel.types.isIdentifier(prop.value)) {
            const valueToResolve = prop.value.name;
            // In this case we have some variable defined in the same or another file
            const resolved = resolve({
              nodePath,
              currentFilePath,
              valueToResolve,
              resolvedImports,
            });
            result = {
              ...result,
              [objectKey]: { ...resolved },
            };
          } else {
            // In this case we have a primitive value
            const json = parseCodeJson(prop.value);
            result = {
              ...result,
              [objectKey]: json,
            };
          }
        }
      } else if (babel.types.isSpreadElement(prop)) {
        if (babel.types.isIdentifier(prop.argument)) {
          const valueToResolve = prop.argument.name;

          result = {
            ...result,
            ...resolve({ nodePath, currentFilePath, valueToResolve }),
          };
        }
      } else {
        // In this case we have a primitive value
        result = {
          ...result,
          ...parseCodeJson(prop),
        };
      }
    }
  }

  return result;
};

export const resolveMetadata = ({
  context,
  node,
  nodePath,
  options,
}: {
  context: Context;
  node: babel.types.Node;
  nodePath: NodePath<babel.types.Program>;
  options: ParseMorphoOptions;
}): Record<string, any> => {
  if (context.cwd && options?.filePath) {
    const resolvedImports: ResolvedImport[] = [];
    const currentFilePath = `${context.cwd}/${options.filePath}`;
    const metadata = resolveObjectsRecursive({ node, nodePath, currentFilePath, resolvedImports });
    context.builder.resolvedImports = resolvedImports;
    return metadata;
  }

  return {};
};
