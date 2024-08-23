import { onInit, onMount } from '@builder.io/morpho';

export default function OnInit() {
  onInit(() => {
    console.log('onInit');
  });

  onMount(() => {
    console.log('onMount');
  });

  return <div />;
}
