import { useStore } from '@builder.io/morpho';
import FormInputComponent from './input.raw';

export default function Stepper(props) {
  const state = useStore({
    handleChange(value: string) {
      console.log(value);
    },
  });

  return (
    <FormInputComponent
      name="kingzez"
      type="text"
      onChange={(value) => state.handleChange(value)}
    />
  );
}
