import { useDefaultProps, useStore } from '@builder.io/morpho';

useDefaultProps({ foo: 'abc', bar: 'foo' });

type DefaultPropsType = {
  foo?: string;
  bar?: string;
};

export default function DefaultProps(props: DefaultPropsType) {
  const state = useStore({
    getProps: () => {
      return JSON.stringify({ foo: props.foo, bar: props.bar });
    },
  });

  return <div data-testid="default-props">{state.getProps()}</div>;
}
