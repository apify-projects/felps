import Base from './base';
import { GenerateObject, GenerateStepOnMethods, GenerateStepSetMethods, MakeStepBaseApiContext, StepsOptions, ValueOf } from './common/types';
import Step from './step';

export default class Steps<Names = '', InitialMethods = MakeStepBaseApiContext, MethodsByStep extends Record<string, unknown> = Record<string, unknown>> extends Base {
  names: Extract<ValueOf<Names>, string>;
  items: GenerateObject<Names, Step>;

  constructor(options: StepsOptions<Names>) {
    const { names = [] } = options;
    super({ key: 'steps', name: 'steps' });
    this.names = names as Extract<ValueOf<Names>, string>;
  }

  init() {
    for (const name of this.names) {
      this.items[name] = new Step<InitialMethods>({ name });
    }
  }

  get set(): GenerateStepSetMethods<Names, InitialMethods, MethodsByStep> {
    return new Proxy(this, {
      get(target, name) {

      }
    }) as unknown as GenerateStepSetMethods<Names, InitialMethods, MethodsByStep>;
  }

  get on(): GenerateStepOnMethods<Names, InitialMethods, MethodsByStep> {
    return new Proxy(this, {
      get(target, name) {

      }
    }) as unknown as GenerateStepOnMethods<Names, InitialMethods, MethodsByStep>;
  }
};
