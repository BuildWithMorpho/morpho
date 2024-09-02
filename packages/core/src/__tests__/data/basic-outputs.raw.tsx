import { useStore, onMount } from '@builder.io/morpho';

export default function MyBasicOutputsComponent(props: any) {
  const state = useStore({
    name: 'PatrickJS',
  });

  onMount(() => {
    props.onMessage(state.name);
    props.onEvent(props.message);
  });

  return <div></div>;
}
