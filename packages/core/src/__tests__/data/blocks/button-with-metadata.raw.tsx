import { Show, useMetadata } from '@builder.io/morpho';

export interface ButtonProps {
  attributes?: any;
  text?: string;
  link?: string;
  openLinkInNewTab?: boolean;
}

useMetadata({
  foo: {
    bar: 'baz',
  },
});

useMetadata({
  fun: 'more metadata',
});

export default function Button(props: ButtonProps) {
  return (
    <>
      <Show when={props.link}>
        <a
          {...props.attributes}
          href={props.link}
          target={props.openLinkInNewTab ? '_blank' : undefined}
        >
          {props.text}
        </a>
      </Show>
      <Show when={!props.link}>
        <button {...props.attributes} type="button">
          {props.text}
        </button>
      </Show>
    </>
  );
}
