import { onUpdate } from '@builder.io/morpho';

export default function OnUpdateWithDeps() {
  let a, b;

  onUpdate(() => {
    console.log('Runs when a or b changes');
  }, [a, b]);

  return <div />;
}
