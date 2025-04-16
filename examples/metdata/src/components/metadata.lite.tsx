import { useMetadata } from '@builder.io/morpho';
import { metadata } from './data';

useMetadata({ ...metadata });

export default function MetadataExample() {
  return <div>Metadata</div>;
}
