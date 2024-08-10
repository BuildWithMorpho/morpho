# no-var-name-same-as-state-property (no-var-name-same-as-state-property)

This rule warns about a Morpho limitation.

## Rule Details

This rule aims to warn you if you declare a variable with the same name as a state property.

Examples of **incorrect** code for this rule:

```js
import { useState } from '@builder.io/morpho';

export default function MyComponent(props) {
  const state = useState({
    foo: 'bar',
  });

  const foo = bar;

  return <div />;
}
```

Examples of **correct** code for this rule:

```js
import { useState } from '@builder.io/morpho';

export default function MyComponent(props) {
  const state = useState({
    foo: 'bar',
  });

  const foo_ = bar;

  return <div />;
}
```
