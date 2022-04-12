import { GenerateObject, ModelOptions } from './common/types';
import Model from './model';

export default class Models<ModelDefinitions extends Record<string, any> = Record<string, unknown>> {
  items: GenerateObject<Extract<keyof ModelDefinitions, string>, Model>;

  add(name: Extract<keyof ModelDefinitions, string>, options: Partial<Omit<ModelOptions, 'name'>> = {}) {
    this.items[name] = new Model({ name, ...options });
  }
};
