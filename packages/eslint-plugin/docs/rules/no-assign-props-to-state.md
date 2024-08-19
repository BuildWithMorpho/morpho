# no-assign-props-to-state (no-assign-props-to-state)

This rule warns about a Morpho limitation.

## Rule Details

This rule aims to warn you if you declare a variable with the same name as a state property.

Examples of **incorrect** code for this rule:

```js
import { useState } from '@builder.io/morpho';

export default function MyComponent(props) {
  const state = useState({ text: props.text });
}
```

Examples of **correct** code for this rule:

```js
import { useState } from '@builder.io/morpho';

export default function MyComponent(props) {
  const state = useState({ text: null });

  onMount(() => {
    state.text = props.text;
  });
}

export default function MyComponent(props) {
  const state = useState({
    text: null,
    fn1() {
      return foo(props.text);
    },
    fn2() {
      return foo({ text: props.text });
    }
  });

  onMount(() => {
    state.text = props.text;
  });
}
```
