import { onUpdate } from '@builder.io/morpho';

export default function OnUpdate() {
  onUpdate(() => {
    console.log('Runs on every update/rerender');
  });

  return <div />;
}
