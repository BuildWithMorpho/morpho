import { useMetadata, useRef } from '@builder.io/morpho';

useMetadata({
  attributePassing: {
    enabled: true,
  },
});

export default function BasicRefAttributePassingComponent() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return <button ref={buttonRef}>Attribute Passing</button>;
}
