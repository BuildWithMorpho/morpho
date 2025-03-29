import { useStore } from '@builder.io/morpho';

export default function MyComponent(props) {
  const state = useStore({
    name: 'steve',
    setName(value) {
      state.name = value;
    },
    updateNameWithArrowFn: (value) => {
      state.name = value;
    },
  });

  return <div>Hello {state.name}</div>;
}
