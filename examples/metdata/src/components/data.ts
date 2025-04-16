import { ComponentMetadata } from '@builder.io/morpho';
import { customMetaData } from '../shared/data';

export const metadata: ComponentMetadata = {
  regularKey: 'abc',
  'some-key': customMetaData,
  react: {
    forwardRef: 'xxx',
  },
  vue: {
    customKey: 'yyy',
  },
};
