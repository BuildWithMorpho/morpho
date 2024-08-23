import { onInit } from '@builder.io/morpho';

export default function OnInit() {
  onInit(() => {
    console.log('Runs once every update/rerender');
  });

  return <div />;
}
