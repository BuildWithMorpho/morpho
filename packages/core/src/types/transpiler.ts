import { MorphoComponent } from './morpho-component';
import { MorphoPlugin } from './plugins';

export interface TranspilerArgs {
  path?: string;
  component: MorphoComponent;
}

export type Transpiler<R = string> = (args: TranspilerArgs) => R;

/**
 * This type guarantees that all code generators receive the same base options
 */
export type TranspilerGenerator<X extends BaseTranspilerOptions, Y = string> = (
  args?: X,
) => Transpiler<Y>;

export type AttributePassingType = {
  enabled: boolean;
  customRef?: string;
};

export interface BaseTranspilerOptions {
  experimental?: { [key: string]: any };
  /**
   * Runs `prettier` on generated components
   */
  prettier?: boolean;
  /**
   * Morpho Plugins to run during codegen.
   */
  plugins?: MorphoPlugin[];
  /**
   * Enable `typescript` output
   */
  typescript?: boolean;
  /** Enables/disables attribute passing for frameworks with custom elements like angular and stencil */
  attributePassing?: AttributePassingType;
  /**
   * Preserves explicit filename extensions in import statements.
   */
  explicitImportFileExtension?: boolean;
  /**
   * Can be used for cli builds. Preserves explicit filename extensions when regex matches, e.g.:
   * {
   *   explicitBuildFileExtension: {
   *     ".ts":/*.figma.lite.tsx/g,
   *     ".md":/*.docs.lite.tsx/g
   *   }
   * }
   */
  explicitBuildFileExtensions?: Record<string, RegExp>;
}
