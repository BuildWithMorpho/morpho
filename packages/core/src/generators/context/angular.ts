import { stringifyContextValue } from '@/helpers/get-state-object-string';
import { MorphoContext } from '@/types/morpho-context';
import { format } from 'prettier/standalone';

type ContextToAngularOptions = {
  format?: boolean;
  typescript?: boolean;
};

export const contextToAngular =
  (options: ContextToAngularOptions = { typescript: false }) =>
  ({ context }: { context: MorphoContext }): string => {
    let str = `
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export default class ${context.name}Context {
    ${stringifyContextValue(context.value)
      .replace(/^\{/, '')
      .replace(/\}$/, '')
      .replaceAll(',', ';\n')
      .replaceAll(':', ': any = ')}
    constructor() { }
}
  `;

    if (options.format !== false) {
      try {
        str = format(str, {
          parser: 'typescript',
          plugins: [
            require('prettier/parser-typescript'), // To support running in browsers
          ],
        });
      } catch (err) {
        if (process.env.NODE_ENV !== 'test') {
          console.error('Format error for file:', str);
        }
        throw err;
      }
    }

    return str;
  };
