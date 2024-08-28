import { useState, useRef } from '@builder.io/morpho';

export interface Props {
  showInput: boolean;
}

export default function MyMasicRefComponent(props: Props) {
  let inputRef = (useRef as any)('default value');

  function handlerClick(event: Event) {
    event.preventDefault();
    console.log('current value', inputRef);
    inputRef = 'lol';
  }

  return (
    <div>
      <button onClick={handlerClick}>Click</button>
    </div>
  );
}
