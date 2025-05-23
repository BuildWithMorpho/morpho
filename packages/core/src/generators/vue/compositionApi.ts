import { dedent } from '@/helpers/dedent';
import { getStateObjectStringFromComponent } from '@/helpers/get-state-object-string';
import { getTypedFunction } from '@/helpers/get-typed-function';
import { BaseHook, MorphoComponent } from '@/types/morpho-component';
import json5 from 'json5';
import { pickBy } from 'lodash';
import { getContextKey, getContextValue, processBinding } from './helpers';
import { ToVueOptions } from './types';

const getCompositionPropDefinition = ({
  options,
  component,
  props,
}: {
  options: ToVueOptions;
  component: MorphoComponent;
  props: string[];
}) => {
  const isTs = options.typescript;
  let str = 'const props = ';

  if (component.defaultProps) {
    const generic = isTs && component.propsTypeRef !== 'any' ? `<${component.propsTypeRef}>` : '';
    const defalutPropsString = props
      .map((prop) => {
        const value = component.defaultProps!.hasOwnProperty(prop)
          ? component.defaultProps![prop]?.code
          : 'undefined';
        return `${prop}: ${value}`;
      })
      .join(',');
    str += `withDefaults(defineProps${generic}(), {${defalutPropsString}})`;
  } else if (isTs && component.propsTypeRef && component.propsTypeRef !== 'any') {
    str += `defineProps<${component.propsTypeRef}>()`;
  } else {
    str += `defineProps(${json5.stringify(props)})`;
  }
  return str;
};

export function generateCompositionApiScript(
  component: MorphoComponent,
  options: ToVueOptions,
  template: string,
  props: Array<string>,
  onUpdateWithDeps: BaseHook[],
  onUpdateWithoutDeps: BaseHook[],
) {
  const isTs = options.typescript;
  let refs = getStateObjectStringFromComponent(component, {
    data: true,
    functions: false,
    getters: false,
    format: 'variables',
    valueMapper: (code, _, typeParameter) => {
      return isTs && typeParameter ? `ref<${typeParameter}>(${code})` : `ref(${code})`;
    },
    keyPrefix: 'const',
  });

  let methods = getStateObjectStringFromComponent(component, {
    data: false,
    getters: false,
    functions: true,
    format: 'variables',
    valueMapper: (
      code: string,
      type: 'data' | 'function' | 'getter',
      typeParameter: string | undefined,
    ) => {
      if (type != 'data') {
        return getTypedFunction(code, isTs, typeParameter);
      }

      return code;
    },
  });

  if (template.includes('_classStringToObject')) {
    methods += ` function _classStringToObject(str${isTs ? ': string' : ''}) {
      const obj${isTs ? ': Record<string, boolean>' : ''} = {};
      if (typeof str !== 'string') { return obj }
      const classNames = str.trim().split(/\\s+/);
      for (const name of classNames) {
        obj[name] = true;
      }
      return obj;
    } `;
  }

  const getterKeys = Object.keys(pickBy(component.state, (i) => i?.type === 'getter'));

  let str = dedent`
    ${props.length ? getCompositionPropDefinition({ component, props, options }) : ''}
    ${refs}

    ${Object.entries(component.context.get)
      ?.map(([key, context]) => {
        return `const ${key} = inject(${getContextKey(context)})`;
      })
      .join('\n')}

    ${Object.values(component.context.set)
      ?.map((contextSet) => {
        const contextValue = getContextValue(contextSet);
        const key = getContextKey(contextSet);

        return `provide(${key}, ${contextValue})`;
      })
      .join('\n')}

    ${Object.keys(component.refs)
      ?.map((key) => {
        if (isTs) {
          const type = component.refs[key].typeParameter ?? 'any';
          return `const ${key} = ref<${type}>(null)`;
        } else {
          return `const ${key} = ref(null)`;
        }
      })
      .join('\n')}
    ${component.hooks.onInit?.code ?? ''}
    ${component.hooks.onMount.map((hook) => `onMounted(() => { ${hook.code} })`).join('\n')}
    ${
      !component.hooks.onUnMount?.code
        ? ''
        : `onUnmounted(() => { ${component.hooks.onUnMount.code}})`
    }
    ${
      getterKeys
        ?.map((key) => {
          const code = component.state[key]?.code?.toString();

          if (!code) {
            return '';
          }

          // transform `foo() { return this.bar }` to `() => { return bar.value }`
          const getterAsFunction = code.replace(key, '').trim().replace(/^\(\)/, '() =>');

          const computedCode = `const ${key} = computed(${getterAsFunction})`;

          return computedCode;
        })
        .join('\n') || ''
    }

    ${onUpdateWithoutDeps?.map((hook) => `onUpdated(() => {${hook.code}})`).join('\n') || ''}

    ${
      onUpdateWithDeps
        ?.map((hook) => {
          return `watch(() => ${processBinding({
            code: hook.deps || '',
            options,
            json: component,
          })}, () => { ${hook.code} }, {immediate: true})`;
        })
        .join('\n') || ''
    }
    ${methods ?? ''}
  `;

  return str;
}
