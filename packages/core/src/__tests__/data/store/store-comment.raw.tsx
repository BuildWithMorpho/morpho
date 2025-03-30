import { useStore } from '@builder.io/morpho';

export default function StringLiteralStore() {
  const state = useStore({
    foo: true, // Comment
    bar() {},
  });

  return <>{state.foo}</>;
}
