import { DefaultDatasetNames, GenerateObject, DatasetOptions, ValueOf } from './common/types';
import Store from './data-store';
import Dataset from './queue';

export default class Datasets<Names extends string[] = []> {
  items: GenerateObject<Names & DefaultDatasetNames, Store>;

  constructor() {
      this.add('default');
  }

  add(name: Extract<ValueOf<Names>, string> | DefaultDatasetNames, options: Omit<DatasetOptions, 'name'> = {}) {
      this.items[name as string] = new Dataset({ name, ...options });
  }
};
