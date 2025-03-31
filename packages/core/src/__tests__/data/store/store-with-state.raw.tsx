import { useState, useStore } from '@builder.io/morpho';

export default function MyComponent() {
  const [foo, _] = useState(false);
  const state = useStore({
    bar() {
      return foo;
    },
  });

  return <>{state.bar()}</>;
}
