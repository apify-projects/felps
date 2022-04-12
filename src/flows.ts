import { camelCase } from 'camel-case';
import Base from './base';
import { FlowOptions, FlowsOptions, GenerateFlowSetMethods, GenerateObject } from './common/types';
import Flow from './flow';

export default class Flows<Names = ''> extends Base {
  names: string[];
  items: GenerateObject<Names, Flow>;

  constructor(options?: FlowsOptions<Names>) {
      const { names = [] } = options;
      super({ key: 'flows', name: 'flows' });
      this.names = names.map((name) => camelCase(name));
  }

  init() {
      for (const name of this.names) {
      // TODO: Try passing on the MethodsByStep to the Step constructor
          this.items[name] = new Flow({ name });
      }
  }

  get set(): GenerateFlowSetMethods<Names> {
      return new Proxy(this, {
          get(target, name: string) {
              if (target.names.includes(name)) {
                  return (options: Partial<FlowOptions>) => target.items?.[name]?.extend?.(options);
              }
              return undefined;
          },
      }) as unknown as GenerateFlowSetMethods<Names>;
  }
};
