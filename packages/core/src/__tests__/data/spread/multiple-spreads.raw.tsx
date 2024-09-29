import { useState } from '@builder.io/morpho';

export default function MyBasicComponent(props: any) {
  const [attrs, setAttrs] = useState({ hello: 'world' });

  return <input {...attrs} {...props}></input>;
}
