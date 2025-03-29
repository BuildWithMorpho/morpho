import { useStore } from '@builder.io/morpho';

export default function StringLiteralStore() {
  /* prettier-ignore */
  const state = useStore({ "foo": 123 });

  return <div>{state.foo}</div>;
}
