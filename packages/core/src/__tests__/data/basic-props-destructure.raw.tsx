import { useState } from '@builder.io/morpho';

// @ts-ignore
export default function MyBasicComponent(props) {
  const state = useState({
    name: 'Decadef20',
  });

  return (
    <div>
      {props.children} {props.type}
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>
  );
}
