import type { MorphoComponent } from '@builder.io/morpho';
import { server$ } from '@builder.io/qwik-city';

export type OutputFramework = 'react' | 'svelte' | 'vue' | 'qwik' | 'angular' | 'morpho' | 'json';
export const outputs: OutputFramework[] = [
  'react',
  'svelte',
  'vue',
  'qwik',
  'angular',
  'morpho',
  'json',
];

export type InputSyntax = 'jsx' | 'svelte';
export const inputs: InputSyntax[] = ['jsx', 'svelte'];

export const languageByFramework: Record<OutputFramework, string> = {
  react: 'typescript',
  svelte: 'html',
  vue: 'html',
  qwik: 'typescript',
  angular: 'typescript',
  morpho: 'typescript',
  json: 'json',
};

const getOutputGenerator = async ({ output }: { output: OutputFramework }) => {
  const {
    componentToSvelte,
    componentToVue,
    componentToReact,
    componentToQwik,
    componentToAngular,
    componentToMorpho,
  } = await import('@builder.io/morpho');

  const options = {};

  switch (output) {
    case 'qwik':
      return componentToQwik(options);
    case 'react':
      return componentToReact(options);
    case 'angular':
      return componentToAngular(options);
    case 'svelte':
      return componentToSvelte(options);
    case 'morpho':
      return componentToMorpho();
    case 'json':
      return ({ component }: { component: MorphoComponent }) => JSON.stringify(component, null, 2);
    case 'vue':
      return componentToVue({ api: 'composition' });
    default:
      throw new Error('unexpected Output ' + output);
  }
};

export const compile = server$(
  async (code: string, output: OutputFramework, inputSyntax: InputSyntax) => {
    const { parseJsx, parseSvelte } = await import('@builder.io/morpho');
    const parsed = inputSyntax === 'svelte' ? await parseSvelte(code) : parseJsx(code);

    const outputGenerator = await getOutputGenerator({ output });

    const outputCode = outputGenerator({ component: parsed });

    return outputCode;
  },
);

export const defaultCode = `
import { useState } from "@builder.io/morpho";

export default function MyComponent(props) {
  const [name, setName] = useState("Steve");

  return (
    <div>
      <input
        css={{
          color: "red",
        }}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      Hello! I can run natively in React, Vue, Svelte, Qwik, and many more frameworks!
    </div>
  );
}
`.trim();
