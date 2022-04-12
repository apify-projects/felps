import { AnyStore, AnyStoreOptions, DefaultStoreNames, GenerateObject, ValueOf } from './common/types';
import Store from './data-store';
import FileStore from './file-store';

export default class Stores<Names extends string[] = []> {
  items: GenerateObject<Names & DefaultStoreNames, AnyStore>;

  constructor() {
      this.add('default');
      this.add('trails');
      this.add('incorrectDataset');
      this.add('files', { type: 'file' });
      this.add('responseBodies', { type: 'file' });
      this.add('browserTraces', { type: 'file' });
  }

  add(name: Extract<ValueOf<Names>, string> | DefaultStoreNames, options: Omit<AnyStoreOptions, 'name'> = {}) {
      const { type = 'data' } = options;
      const definition = { name, ...options };
      this.items[name as string] = type === 'file' ? new FileStore(definition) : new Store(definition);
  }

  async persist() {
      return Promise.allSettled(
          (Object.values(this.items) as AnyStore[])
              .map((item) => Promise.resolve(
                  'persist' in item
                      ? item.persist()
                      : undefined),
              ));
  }
};
