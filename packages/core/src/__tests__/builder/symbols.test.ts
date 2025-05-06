import { componentToBuilder } from '@/generators/builder';
import { componentToMorpho } from '@/generators/morpho';
import { builderContentToMorphoComponent } from '@/parsers/builder';
import { parseJsx } from '@/parsers/jsx';
import { describe, test } from 'vitest';

describe('Builder Symbols', () => {
  test('no data loss occurs when parsing and generating symbols', () => {
    const builderJson = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            id: 'builder-281c8c0da7be4f8a923f872d4825f14d',
            component: {
              name: 'Symbol',
              options: {
                symbol: {
                  data: {},
                  model: 'symbol',
                  entry: 'ce58d5d74c21469496725f27b8781498',
                  ownerId: 'YJIGb4i01jvw0SRdL5Bt',
                  global: false,
                },
              },
            },
          },
        ],
      },
    };
    const builderToMorpho = builderContentToMorphoComponent(builderJson);

    expect(builderToMorpho.children[0]).toMatchInlineSnapshot(`
      {
        "@type": "@builder.io/morpho/node",
        "bindings": {
          "symbol": {
            "bindingType": "expression",
            "code": "{\\"data\\":{},\\"model\\":\\"symbol\\",\\"entry\\":\\"ce58d5d74c21469496725f27b8781498\\",\\"ownerId\\":\\"YJIGb4i01jvw0SRdL5Bt\\",\\"global\\":false}",
            "type": "single",
          },
        },
        "children": [],
        "meta": {},
        "name": "Symbol",
        "properties": {},
        "scope": {},
      }
    `);

    const morpho = componentToMorpho({})({
      component: builderToMorpho,
    });
    expect(morpho).toMatchInlineSnapshot(`
      "import { Symbol } from \\"@components\\";

      export default function MyComponent(props) {
        return (
          <Symbol
            symbol={{
              data: {},
              model: \\"symbol\\",
              entry: \\"ce58d5d74c21469496725f27b8781498\\",
              ownerId: \\"YJIGb4i01jvw0SRdL5Bt\\",
              global: false,
            }}
          />
        );
      }
      "
    `);

    const backToMorpho = parseJsx(morpho);
    expect(backToMorpho.children[0]).toMatchInlineSnapshot(`
      {
        "@type": "@builder.io/morpho/node",
        "bindings": {
          "symbol": {
            "bindingType": "expression",
            "code": "{
        data: {},
        model: \\"symbol\\",
        entry: \\"ce58d5d74c21469496725f27b8781498\\",
        ownerId: \\"YJIGb4i01jvw0SRdL5Bt\\",
        global: false
      }",
            "type": "single",
          },
        },
        "children": [],
        "meta": {},
        "name": "Symbol",
        "properties": {},
        "scope": {},
      }
    `);

    const backToBuilder = componentToBuilder()({ component: backToMorpho });
    // no data loss means the component payloads are exactly the same
    expect(backToBuilder.data!.blocks![0].component).toEqual(builderJson.data.blocks[0].component);
  });
});
