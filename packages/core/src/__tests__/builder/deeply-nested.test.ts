import { componentToBuilder } from '@/generators/builder';
import { blockToMorpho, componentToMorpho } from '@/generators/morpho';
import { componentToReact } from '@/generators/react';
import { builderContentToMorphoComponent } from '@/parsers/builder';
import { parseJsx } from '@/parsers/jsx';
import { describe, test } from 'vitest';

describe('Deeply Nested Builder Components', () => {
  test('parse array with deeply nested elements', () => {
    const builderJson = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            component: {
              name: 'TestComponent',
              options: {
                prop: null,
                items: [
                  {
                    foo: [
                      {
                        '@type': '@builder.io/sdk:Element',
                        tagName: 'div',
                        children: [
                          {
                            '@type': '@builder.io/sdk:Element',
                            tagName: 'br',
                          },
                        ],
                      },
                      {
                        '@type': '@builder.io/sdk:Element',
                        tagName: 'br',
                      },
                    ],
                    bar: {
                      '@type': '@builder.io/sdk:Element',
                      tagName: 'br',
                    },
                    baz: [
                      {
                        a: {
                          '@type': '@builder.io/sdk:Element',
                          tagName: 'br',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    };
    const builderToMorpho = builderContentToMorphoComponent(builderJson, {
      enableBlocksSlots: true,
    });
    expect(builderToMorpho).toMatchInlineSnapshot(`
      {
        "@type": "@builder.io/morpho/component",
        "children": [
          {
            "@type": "@builder.io/morpho/node",
            "bindings": {
              "prop": {
                "bindingType": "expression",
                "code": "null",
                "type": "single",
              },
            },
            "blocksSlots": {
              "items": [
                {
                  "bar": {
                    "@type": "@builder.io/morpho/node",
                    "bindings": {},
                    "children": [],
                    "meta": {},
                    "name": "br",
                    "properties": {},
                    "scope": {},
                    "slots": {},
                  },
                  "baz": [
                    {
                      "a": {
                        "@type": "@builder.io/morpho/node",
                        "bindings": {},
                        "children": [],
                        "meta": {},
                        "name": "br",
                        "properties": {},
                        "scope": {},
                        "slots": {},
                      },
                    },
                  ],
                  "foo": [
                    {
                      "@type": "@builder.io/morpho/node",
                      "bindings": {},
                      "children": [
                        {
                          "@type": "@builder.io/morpho/node",
                          "bindings": {},
                          "children": [],
                          "meta": {},
                          "name": "br",
                          "properties": {},
                          "scope": {},
                          "slots": {},
                        },
                      ],
                      "meta": {},
                      "name": "div",
                      "properties": {},
                      "scope": {},
                      "slots": {},
                    },
                    {
                      "@type": "@builder.io/morpho/node",
                      "bindings": {},
                      "children": [],
                      "meta": {},
                      "name": "br",
                      "properties": {},
                      "scope": {},
                      "slots": {},
                    },
                  ],
                },
              ],
            },
            "children": [],
            "meta": {},
            "name": "TestComponent",
            "properties": {
              "$tagName": undefined,
            },
            "scope": {},
            "slots": {},
          },
        ],
        "context": {
          "get": {},
          "set": {},
        },
        "exports": {},
        "hooks": {
          "onEvent": [],
          "onMount": [],
        },
        "imports": [],
        "inputs": undefined,
        "meta": {
          "useMetadata": {
            "httpRequests": undefined,
          },
        },
        "name": "MyComponent",
        "refs": {},
        "state": {},
        "subComponents": [],
      }
    `);
    const morpho = componentToMorpho()({ component: builderToMorpho });
    expect(morpho).toMatchInlineSnapshot(`
      "import { TestComponent } from \\"@components\\";

      export default function MyComponent(props) {
        return (
          <TestComponent
            prop={null}
            items={[
              {
                foo: [
                  <div>
                    <br />
                  </div>,
                  <br />,
                ],
                bar: <br />,
                baz: [{ a: <br /> }],
              },
            ]}
          />
        );
      }
      "
    `);

    const backToMorpho = parseJsx(morpho, {
      enableBlocksSlots: true,
    });
    const backToBuilder = componentToBuilder()({ component: backToMorpho });
    expect(backToBuilder).toMatchInlineSnapshot(`
      {
        "data": {
          "blocks": [
            {
              "@type": "@builder.io/sdk:Element",
              "actions": {},
              "bindings": {},
              "children": [],
              "code": {
                "actions": {},
                "bindings": {},
              },
              "component": {
                "name": "TestComponent",
                "options": {
                  "items": [
                    {
                      "bar": {
                        "@type": "@builder.io/sdk:Element",
                        "actions": {},
                        "bindings": {},
                        "children": [],
                        "code": {
                          "actions": {},
                          "bindings": {},
                        },
                        "properties": {},
                        "tagName": "br",
                      },
                      "baz": [
                        {
                          "a": {
                            "@type": "@builder.io/sdk:Element",
                            "actions": {},
                            "bindings": {},
                            "children": [],
                            "code": {
                              "actions": {},
                              "bindings": {},
                            },
                            "properties": {},
                            "tagName": "br",
                          },
                        },
                      ],
                      "foo": [
                        {
                          "@type": "@builder.io/sdk:Element",
                          "actions": {},
                          "bindings": {},
                          "children": [
                            {
                              "@type": "@builder.io/sdk:Element",
                              "actions": {},
                              "bindings": {},
                              "children": [],
                              "code": {
                                "actions": {},
                                "bindings": {},
                              },
                              "properties": {},
                              "tagName": "br",
                            },
                          ],
                          "code": {
                            "actions": {},
                            "bindings": {},
                          },
                          "properties": {},
                          "tagName": "div",
                        },
                        {
                          "@type": "@builder.io/sdk:Element",
                          "actions": {},
                          "bindings": {},
                          "children": [],
                          "code": {
                            "actions": {},
                            "bindings": {},
                          },
                          "properties": {},
                          "tagName": "br",
                        },
                      ],
                    },
                  ],
                  "prop": null,
                },
              },
            },
          ],
          "jsCode": "",
          "tsCode": "",
        },
      }
    `);
  });
  test('parse object with deeply nested elements', () => {
    const builderJson = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            component: {
              name: 'TestComponent',
              options: {
                prop: null,
                items: {
                  foo: [
                    {
                      '@type': '@builder.io/sdk:Element',
                      tagName: 'div',
                      children: [
                        {
                          '@type': '@builder.io/sdk:Element',
                          tagName: 'br',
                        },
                      ],
                    },
                    {
                      '@type': '@builder.io/sdk:Element',
                      tagName: 'br',
                    },
                  ],
                  bar: {
                    '@type': '@builder.io/sdk:Element',
                    tagName: 'br',
                  },
                  baz: [
                    {
                      a: {
                        '@type': '@builder.io/sdk:Element',
                        tagName: 'br',
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    };
    const builderToMorpho = builderContentToMorphoComponent(builderJson, {
      enableBlocksSlots: true,
    });
    expect(builderToMorpho).toMatchInlineSnapshot(`
      {
        "@type": "@builder.io/morpho/component",
        "children": [
          {
            "@type": "@builder.io/morpho/node",
            "bindings": {
              "prop": {
                "bindingType": "expression",
                "code": "null",
                "type": "single",
              },
            },
            "blocksSlots": {
              "items": {
                "bar": {
                  "@type": "@builder.io/morpho/node",
                  "bindings": {},
                  "children": [],
                  "meta": {},
                  "name": "br",
                  "properties": {},
                  "scope": {},
                  "slots": {},
                },
                "baz": [
                  {
                    "a": {
                      "@type": "@builder.io/morpho/node",
                      "bindings": {},
                      "children": [],
                      "meta": {},
                      "name": "br",
                      "properties": {},
                      "scope": {},
                      "slots": {},
                    },
                  },
                ],
                "foo": [
                  {
                    "@type": "@builder.io/morpho/node",
                    "bindings": {},
                    "children": [
                      {
                        "@type": "@builder.io/morpho/node",
                        "bindings": {},
                        "children": [],
                        "meta": {},
                        "name": "br",
                        "properties": {},
                        "scope": {},
                        "slots": {},
                      },
                    ],
                    "meta": {},
                    "name": "div",
                    "properties": {},
                    "scope": {},
                    "slots": {},
                  },
                  {
                    "@type": "@builder.io/morpho/node",
                    "bindings": {},
                    "children": [],
                    "meta": {},
                    "name": "br",
                    "properties": {},
                    "scope": {},
                    "slots": {},
                  },
                ],
              },
            },
            "children": [],
            "meta": {},
            "name": "TestComponent",
            "properties": {
              "$tagName": undefined,
            },
            "scope": {},
            "slots": {},
          },
        ],
        "context": {
          "get": {},
          "set": {},
        },
        "exports": {},
        "hooks": {
          "onEvent": [],
          "onMount": [],
        },
        "imports": [],
        "inputs": undefined,
        "meta": {
          "useMetadata": {
            "httpRequests": undefined,
          },
        },
        "name": "MyComponent",
        "refs": {},
        "state": {},
        "subComponents": [],
      }
    `);
    const morpho = componentToMorpho()({ component: builderToMorpho });
    expect(morpho).toMatchInlineSnapshot(`
      "import { TestComponent } from \\"@components\\";

      export default function MyComponent(props) {
        return (
          <TestComponent
            prop={null}
            items={{
              foo: [
                <div>
                  <br />
                </div>,
                <br />,
              ],
              bar: <br />,
              baz: [{ a: <br /> }],
            }}
          />
        );
      }
      "
    `);

    const backToMorpho = parseJsx(morpho, {
      enableBlocksSlots: true,
    });
    const backToBuilder = componentToBuilder()({ component: backToMorpho });
    expect(backToBuilder).toMatchInlineSnapshot(`
      {
        "data": {
          "blocks": [
            {
              "@type": "@builder.io/sdk:Element",
              "actions": {},
              "bindings": {},
              "children": [],
              "code": {
                "actions": {},
                "bindings": {},
              },
              "component": {
                "name": "TestComponent",
                "options": {
                  "items": {
                    "bar": {
                      "@type": "@builder.io/sdk:Element",
                      "actions": {},
                      "bindings": {},
                      "children": [],
                      "code": {
                        "actions": {},
                        "bindings": {},
                      },
                      "properties": {},
                      "tagName": "br",
                    },
                    "baz": [
                      {
                        "a": {
                          "@type": "@builder.io/sdk:Element",
                          "actions": {},
                          "bindings": {},
                          "children": [],
                          "code": {
                            "actions": {},
                            "bindings": {},
                          },
                          "properties": {},
                          "tagName": "br",
                        },
                      },
                    ],
                    "foo": [
                      {
                        "@type": "@builder.io/sdk:Element",
                        "actions": {},
                        "bindings": {},
                        "children": [
                          {
                            "@type": "@builder.io/sdk:Element",
                            "actions": {},
                            "bindings": {},
                            "children": [],
                            "code": {
                              "actions": {},
                              "bindings": {},
                            },
                            "properties": {},
                            "tagName": "br",
                          },
                        ],
                        "code": {
                          "actions": {},
                          "bindings": {},
                        },
                        "properties": {},
                        "tagName": "div",
                      },
                      {
                        "@type": "@builder.io/sdk:Element",
                        "actions": {},
                        "bindings": {},
                        "children": [],
                        "code": {
                          "actions": {},
                          "bindings": {},
                        },
                        "properties": {},
                        "tagName": "br",
                      },
                    ],
                  },
                  "prop": null,
                },
              },
            },
          ],
          "jsCode": "",
          "tsCode": "",
        },
      }
    `);
  });
  test('do not parse components with mapper even if feature is enabled', () => {
    const builderJson = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            component: {
              name: 'Columns',
              options: {
                columns: [
                  {
                    blocks: [
                      {
                        '@type': '@builder.io/sdk:Element' as const,
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    };
    const builderToMorpho = builderContentToMorphoComponent(builderJson, {
      enableBlocksSlots: true,
    });
    const morpho = componentToMorpho()({ component: builderToMorpho });
    expect(morpho).toMatchInlineSnapshot(`
      "import { Columns, Column } from \\"@components\\";

      export default function MyComponent(props) {
        return (
          <Columns>
            <Column>
              <div />
            </Column>
          </Columns>
        );
      }
      "
    `);

    const backToMorpho = parseJsx(morpho, {
      enableBlocksSlots: true,
    });
    const backToBuilder = componentToBuilder()({ component: backToMorpho });
    expect(backToBuilder).toMatchInlineSnapshot(`
      {
        "data": {
          "blocks": [
            {
              "@type": "@builder.io/sdk:Element",
              "actions": {},
              "bindings": {},
              "children": [],
              "code": {
                "actions": {},
                "bindings": {},
              },
              "component": {
                "name": "Columns",
                "options": {
                  "columns": [
                    {
                      "blocks": [
                        {
                          "@type": "@builder.io/sdk:Element",
                          "actions": {},
                          "bindings": {},
                          "children": [],
                          "code": {
                            "actions": {},
                            "bindings": {},
                          },
                          "properties": {},
                          "tagName": "div",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          "jsCode": "",
          "tsCode": "",
        },
      }
    `);
  });
  test('do not transform deeply nested object when feature disabled', () => {
    const builderJson = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            component: {
              name: 'TestComponent',
              options: {
                prop: null,
                items: {
                  foo: [
                    {
                      '@type': '@builder.io/sdk:Element',
                      tagName: 'div',
                      children: [
                        {
                          '@type': '@builder.io/sdk:Element',
                          tagName: 'br',
                        },
                      ],
                    },
                    {
                      '@type': '@builder.io/sdk:Element',
                      tagName: 'br',
                    },
                  ],
                  bar: {
                    '@type': '@builder.io/sdk:Element',
                    tagName: 'br',
                  },
                },
              },
            },
          },
        ],
      },
    };
    const builderToMorpho = builderContentToMorphoComponent(builderJson);
    const morpho = componentToMorpho()({ component: builderToMorpho });
    expect(morpho).toMatchInlineSnapshot(`
      "import { TestComponent } from \\"@components\\";

      export default function MyComponent(props) {
        return (
          <TestComponent
            prop={null}
            items={{
              foo: [
                {
                  \\"@type\\": \\"@builder.io/sdk:Element\\",
                  tagName: \\"div\\",
                  children: [
                    {
                      \\"@type\\": \\"@builder.io/sdk:Element\\",
                      tagName: \\"br\\",
                    },
                  ],
                },
                {
                  \\"@type\\": \\"@builder.io/sdk:Element\\",
                  tagName: \\"br\\",
                },
              ],
              bar: {
                \\"@type\\": \\"@builder.io/sdk:Element\\",
                tagName: \\"br\\",
              },
            }}
          />
        );
      }
      "
    `);

    const backToMorpho = parseJsx(morpho);
    const backToBuilder = componentToBuilder()({ component: backToMorpho });
    expect(backToBuilder).toMatchInlineSnapshot(`
      {
        "data": {
          "blocks": [
            {
              "@type": "@builder.io/sdk:Element",
              "actions": {},
              "bindings": {},
              "children": [],
              "code": {
                "actions": {},
                "bindings": {},
              },
              "component": {
                "name": "TestComponent",
                "options": {
                  "items": {
                    "bar": {
                      "@type": "@builder.io/sdk:Element",
                      "tagName": "br",
                    },
                    "foo": [
                      {
                        "@type": "@builder.io/sdk:Element",
                        "children": [
                          {
                            "@type": "@builder.io/sdk:Element",
                            "tagName": "br",
                          },
                        ],
                        "tagName": "div",
                      },
                      {
                        "@type": "@builder.io/sdk:Element",
                        "tagName": "br",
                      },
                    ],
                  },
                  "prop": null,
                },
              },
            },
          ],
          "jsCode": "",
          "tsCode": "",
        },
      }
    `);
  });
  test('do not alter existing deeply nested behavior when disabled on other generators', () => {
    const morpho = parseJsx(`
    import { useState } from "@builder.io/morpho";
    
    export default function MyComponent(props) {
      const [name, setName] = useState("Steve");
    
      return (
        <MyCmp items={[ <br /> ]} />
      );
    }   
    `);
    const react = componentToReact()({ component: morpho });
    expect(react).toMatchInlineSnapshot(`
      "\\"use client\\";
      import * as React from \\"react\\";
      import { useState } from \\"react\\";

      function MyComponent(props) {
        const [name, setName] = useState(() => \\"Steve\\");

        return <MyCmp items={[<br />]} />;
      }

      export default MyComponent;
      "
    `);
  });
});

describe('generate code', () => {
  test('generate array props', () => {
    const el = {
      '@type': '@builder.io/morpho/node' as const,
      bindings: {},
      blocksSlots: {
        items: [
          {
            '@type': '@builder.io/morpho/node' as const,
            bindings: {},
            children: [],
            meta: {},
            name: 'br',
            properties: {},
            scope: {},
            slots: {},
          },
        ],
      },
      children: [],
      meta: {},
      name: 'TestComponent',
      properties: {},
      scope: {},
      slots: {},
    };
    const cmp = {
      '@type': '@builder.io/morpho/component' as const,
      children: [],
      context: {
        get: {},
        set: {},
      },
      exports: {},
      hooks: {
        onEvent: [],
        onMount: [],
      },
      imports: [],
      inputs: [],
      meta: {
        useMetadata: {
          httpRequests: undefined,
        },
      },
      name: 'MyComponent',
      refs: {},
      state: {},
      subComponents: [],
    };
    expect(blockToMorpho(el, {}, cmp, false)).toMatchInlineSnapshot(
      '"<TestComponent items={[<br  />]} />"',
    );
  });
  test('generate object props', () => {
    const el = {
      '@type': '@builder.io/morpho/node' as const,
      bindings: {},
      blocksSlots: {
        items: {
          foo: {
            '@type': '@builder.io/morpho/node' as const,
            bindings: {},
            children: [],
            meta: {},
            name: 'br',
            properties: {},
            scope: {},
            slots: {},
          },
        },
      },
      children: [],
      meta: {},
      name: 'TestComponent',
      properties: {},
      scope: {},
      slots: {},
    };
    const cmp = {
      '@type': '@builder.io/morpho/component' as const,
      children: [],
      context: {
        get: {},
        set: {},
      },
      exports: {},
      hooks: {
        onEvent: [],
        onMount: [],
      },
      imports: [],
      inputs: [],
      meta: {
        useMetadata: {
          httpRequests: undefined,
        },
      },
      name: 'MyComponent',
      refs: {},
      state: {},
      subComponents: [],
    };
    expect(blockToMorpho(el, {}, cmp, false)).toMatchInlineSnapshot(
      '"<TestComponent items={{foo: <br  />,}} />"',
    );
  });
});
