import { useState } from '@builder.io/morpho';

export default function MyComponent(props) {
  const [refToUse] = useState(
    !(props.componentRef instanceof Function) ? props.componentRef : null,
  );

  return <div>{refToUse}</div>;
}
