import { Show } from '@builder.io/morpho';

interface Props {
  conditionA: boolean;
  conditionB: boolean;
}
export default function NestedShow(props: Props) {
  return (
    <Show when={props.conditionA} else={<div>else-condition-A</div>}>
      <Show when={!props.conditionB} else={<div>else-condition-B</div>}>
        <div>if condition A and condition B</div>
      </Show>
    </Show>
  );
}
