import { useStore } from '@builder.io/morpho';

export default function MyComponent(props) {
  const state = useStore({
    val: props.value,
  });
  return <Comp val={{ ...state.val }}>{state.val}</Comp>;
}
