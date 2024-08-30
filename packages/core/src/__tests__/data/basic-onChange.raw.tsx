import { useState } from '@builder.io/morpho';

export default function MyBasicComponent() {
  const state = useState({
    name: 'Steve',
  });

  return (
    <div
      class="test"
      css={{
        padding: '10px',
      }}
    >
      <input
        value={state.name}
        onChange={(myEvent) => {
          state.name = myEvent.target.value;
        }}
      />
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>
  );
}
