import { pipe } from 'fp-ts/lib/function';
import { extractGetterCodeBlock, prefixWithFunction } from '../../../helpers/patterns';
import { MorphoComponent, MorphoState, StateValue } from '../../../types/morpho-component';
import { ToSolidOptions } from '../types';
import { getStateSetterName, updateStateCode } from './helpers';

const processSignalStateValue = ({
  options,
  component,
}: {
  options: ToSolidOptions;
  component: MorphoComponent;
}) => {
  const mapValue = updateStateCode({ options, component });

  return ([key, stateVal]: [key: string, stateVal: StateValue | undefined]) => {
    if (!stateVal) {
      return '';
    }

    const getDefaultCase = () =>
      pipe(
        value,
        mapValue,
        (x) => `const [${key}, ${getStateSetterName(key)}] = createSignal(${x})`,
      );

    const value = stateVal.code;
    const type = stateVal.type;
    if (typeof value === 'string') {
      switch (type) {
        case 'getter':
          return pipe(
            value,
            mapValue,
            extractGetterCodeBlock,
            (x) => `const ${key} = createMemo(() => {${x}})`,
          );
        case 'function':
          return mapValue(value);
        case 'method':
          return pipe(value, prefixWithFunction, mapValue);
        default:
          return getDefaultCase();
      }
    } else {
      return getDefaultCase();
    }
  };
};

const LINE_ITEM_DELIMITER = '\n\n\n';
export const getSignalsCode = ({
  json,
  options,
  state,
}: {
  json: MorphoComponent;
  options: ToSolidOptions;
  state: MorphoState;
}) =>
  Object.entries(state)
    .map(processSignalStateValue({ options, component: json }))
    /**
     * We need to sort state so that signals are at the top.
     */
    .sort((a, b) => {
      const aHasSignal = a.includes('createSignal(');
      const bHasSignal = b.includes('createSignal(');
      if (aHasSignal && !bHasSignal) {
        return -1;
      } else if (!aHasSignal && bHasSignal) {
        return 1;
      } else {
        return 0;
      }
    })
    .join(LINE_ITEM_DELIMITER);
