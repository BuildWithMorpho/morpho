import { useStore } from '@dummy/custom-morpho';

export default function MyBasicComponent() {
  const state = useStore({
    name: 'PatrickJS',
  });

  return <div>Hello {state.name}! I can run in React, Qwik, Vue, Solid, or Liquid!</div>;
}
