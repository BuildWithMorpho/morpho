import { Slot } from '@builder.io/morpho';

type Props = { [key: string]: string };

export default function SlotCode(props: Props) {
  return (
    <div>
      <Slot>
        <div class="default-slot">Default content</div>
      </Slot>
    </div>
  );
}
