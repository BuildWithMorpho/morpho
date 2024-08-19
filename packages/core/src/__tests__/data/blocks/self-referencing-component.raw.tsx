import { Show } from '@builder.io/morpho';

export default function MyComponent(props: any) {
  return (
    <div>
      {props.name}
      <Show when={props.name === 'Batman'}>
        <MyComponent name={'Bruce Wayne'} />
      </Show>
    </div>
  );
}
