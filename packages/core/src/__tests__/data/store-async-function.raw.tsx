import { useStore } from '@builder.io/morpho';

export default function StringLiteralStore() {
  const state = useStore({
    arrowFunction: async () => {
      return Promise.resolve();
    },
    namedFunction: async function namedFunction() {
      return Promise.resolve();
    },
    async fetchUsers() {
      return Promise.resolve();
    },
  });

  return <div></div>;
}
