import { useMetadata } from '@builder.io/morpho';

useMetadata({
  angular: {
    sanitizeInnerHTML: true,
  },
});

export default function MyComponent(props) {
  return <div innerHTML={props.html}></div>;
}
