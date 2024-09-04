import { useState } from '@builder.io/morpho';

export default function MyBasicComponent() {
  const [classState, setClassState] = useState('testClassName');
  return (
    <div
      class={classState}
      css={{
        padding: '10px',
      }}
    >
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>
  );
}
