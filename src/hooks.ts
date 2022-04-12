import { DefaultHookNames, GenerateObject, MakeStepBaseApiContext, StepOptions } from './common/types';

import Step from './step';

export default class Hooks<InitialMethods = MakeStepBaseApiContext> {
  items: GenerateObject<DefaultHookNames[], Step>;

  add(name: DefaultHookNames, options: Omit<StepOptions<InitialMethods>, 'name'> = { handler: async () => undefined }) {
      this.items[name as string] = new Step<InitialMethods>({ name, ...options });
  }
};
