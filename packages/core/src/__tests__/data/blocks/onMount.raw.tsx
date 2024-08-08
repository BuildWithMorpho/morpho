import { onMount, onUnMount } from '@builder.io/morpho';

export default function Comp() {
  onMount(() => {
    console.log('Runs on mount');
  });

  onUnMount(() => {
    console.log('Runs on unMount');
  });

  return <div />;
}
