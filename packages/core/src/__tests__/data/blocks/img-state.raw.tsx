import { For, useStore } from '@builder.io/morpho';

export default function ImgStateComponent() {
  const state = useStore({
    canShow: true,
    images: ['http://example.com/qwik.png'],
  });
  return (
    <div>
      <For each={state.images}>
        {(item, itemIndex) => (
          <>
            <img class={'custom-class'} src={item} key={itemIndex} />
          </>
        )}
      </For>
    </div>
  );
}
