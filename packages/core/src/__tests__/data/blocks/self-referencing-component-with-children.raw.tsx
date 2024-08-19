import { Show } from '@builder.io/morpho';

export default function MyComponent(props: any) {
  return (
    <div>
      {props.name}
      {props.children}
      <Show when={props.name === 'Batman'}>
        <MyComponent name={'Bruce'}>
          <div>Wayne</div>
        </MyComponent>
      </Show>
    </div>
  );
}
