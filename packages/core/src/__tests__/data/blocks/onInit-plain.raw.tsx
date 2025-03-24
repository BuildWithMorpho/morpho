import { onInit } from '@builder.io/morpho';

export default function OnInitPlain() {
  onInit(() => {
    console.log('onInit');
  });

  return <div />;
}
