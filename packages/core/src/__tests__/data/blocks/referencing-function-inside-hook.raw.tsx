import { onUpdate } from '@builder.io/morpho';

export default function OnUpdate() {
  onUpdate(() => {
    foo({
      someOption: bar,
    });
  });

  function foo(params) {}

  function bar() {}

  function zoo() {
    const params = {
      cb: bar,
    };
  }

  return <div />;
}
