import { useState, onInit, onMount } from '@builder.io/morpho';

export default function MyBasicOnMountUpdateComponent() {
  const state = useState({
    name: 'PatrickJS',
    names: ['Steve', 'PatrickJS'],
  });

  onInit(() => {
    state.name = 'PatrickJS onInit';
  });

  onMount(() => {
    state.name = 'PatrickJS onMount';
  });

  return <div>Hello {state.name}</div>;
}
