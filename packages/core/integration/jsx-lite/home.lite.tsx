import { useStore } from '@builder.io/morpho';

export default function MyComponent(props) {
  const state = useStore({ name: 'Steve' });

  return (
    <div
      css={{
        textAlign: 'center',
        color: 'steelblue',
      }}
    >
      <h2>
        <div>Hello, </div>
      </h2>
      <input
        value={state.name}
        onChange={(event) => (state.name = event.target.value)}
      />
    </div>
  );
}
