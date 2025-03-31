import { For, Fragment } from '@builder.io/morpho';

export default function BasicForFragment() {
  return (
    <div>
      <For each={['a', 'b', 'c']}>
        {(option) => (
          <Fragment key={`key-${option}`}>
            <div>{option}</div>
          </Fragment>
        )}
      </For>
    </div>
  );
}
