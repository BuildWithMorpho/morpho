import { stripStateAndPropsRefs } from '@/helpers/strip-state-and-props-refs';
import { Target } from '@/types/config';
import { MorphoComponent } from '@/types/morpho-component';
import { getEventNameWithoutOn } from './event-handlers';

/**
 * We need to "emit" events those can be on multiple places, so we do it as post step
 */
const appendEmits = (
  str: string,
  { name }: MorphoComponent,
  { events, props, target, skipAppendEmit }: ProcessBindingOptions,
): string => {
  let code = str;
  if (events.length) {
    for (const event of events) {
      const eventWithoutOn = getEventNameWithoutOn(event);

      if (props.includes(eventWithoutOn)) {
        console.error(`
Component ${name} has an event ${event} that conflicts with prop ${eventWithoutOn} for target ${target}.
Please rename the prop or the event.
`);
      }

      if (!skipAppendEmit) {
        code = code.replaceAll(`props.${event}(`, `props.${eventWithoutOn}.emit(`);
      }

      code = code.replaceAll(`props.${event}`, `props.${eventWithoutOn}`);
    }
  }
  return code;
};

export type ProcessBindingOptions = {
  events: string[];
  props: string[];
  target: Target;
  replaceWith?: string;
  skipAppendEmit?: boolean;
};

/**
 * We use this for generators like stencil and angular
 */
export const processClassComponentBinding = (
  json: MorphoComponent,
  code: string,
  processBindingOptions: ProcessBindingOptions,
) => {
  const { replaceWith = 'this.' } = processBindingOptions;
  let resolvedCode = stripStateAndPropsRefs(appendEmits(code, json, processBindingOptions), {
    replaceWith,
  });
  if (json.exports) {
    // We need to use local exports with `this.` in stencil and angular
    Object.entries(json.exports)
      .filter(([, value]) => value.usedInLocal)
      .forEach(([key]) => {
        resolvedCode = resolvedCode.replaceAll(key, `${replaceWith}${key}`);
      });
  }
  if (json.context.get) {
    for (const key of Object.keys(json.context.get)) {
      resolvedCode = resolvedCode.replaceAll(key, `${replaceWith}${key}`);
    }
  }

  return resolvedCode;
};
