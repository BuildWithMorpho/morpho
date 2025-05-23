import * as types from '@babel/types';
import { Rule } from 'eslint';
import { HOOKS } from '../constants/hooks';
import isMorphoPath from '../helpers/isMorphoPath';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

export const onlyDefaultFunctionAndImportsMessage =
  'Morpho component files should only contain import declarations, the component itself (in a default export), module-scope hooks, and type declarations';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow anything other than import declarations, the component itself (in a default export), module-scope hooks, and type declarations inside the component file.',
      recommended: true,
    },
  },

  create(context) {
    // variables should be defined here
    const filename = context.getFilename();

    if (!isMorphoPath(filename)) return {};

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------
    //
    const listener: Rule.RuleListener = {
      Program(node) {
        const { body } = node;

        for (const child of body) {
          if (
            !types.isImportDeclaration(child) &&
            !types.isExportDefaultDeclaration(child) &&
            !types.isTypeAlias(child) &&
            !types.isInterfaceDeclaration(child) &&
            !types.isTSInterfaceDeclaration(child) &&
            !types.isTSTypeAliasDeclaration(child) &&
            !(
              types.isExportNamedDeclaration(child) &&
              types.isTSInterfaceDeclaration(child.declaration)
            ) &&
            !(
              types.isExportNamedDeclaration(child) &&
              types.isTSTypeAliasDeclaration(child.declaration)
            ) &&
            (!types.isExpressionStatement(child) ||
              !types.isCallExpression(child.expression) ||
              !types.isIdentifier(child.expression.callee) ||
              (child.expression.callee.name !== HOOKS.META_DATA &&
                child.expression.callee.name !== HOOKS.DEFAULT_PROPS))
          ) {
            context.report({
              node: child as any,
              message: onlyDefaultFunctionAndImportsMessage,
            });
          }
        }
      },
    };
    return listener;
  },
};

export default rule;
