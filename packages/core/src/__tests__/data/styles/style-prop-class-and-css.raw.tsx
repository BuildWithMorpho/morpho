import { useTarget } from '@builder.io/morpho';

export default function StylePropClassAndCss(props) {
  return (
    <div
      style={props.attributes.style}
      class={useTarget({
        vue: props.attributes.className,
        svelte: props.attributes.classfdsa,
        default: props.attributes.class,
      })}
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    />
  );
}
