import { useMetadata } from '@builder.io/morpho';

useMetadata({
  angular: {
    changeDetection: 'OnPush',
  },
});

export default function MyComponent(props) {
  return <div>{props.count}</div>;
}
