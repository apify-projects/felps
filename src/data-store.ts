import Apify from 'apify';
import cloneDeep from 'lodash.clonedeep';
import getByKey from 'lodash.get';
import hasByPath from 'lodash.has';
import mergeWith from 'lodash.mergewith';
import setByKey from 'lodash.set';
import Base from './base';
import { DataStoreOptions } from './common/types';
import { craftUIDKey } from './common/utils';

export default class DataStore extends Base {
  kvKey: string;
  pathPrefix: string;

  initialized: boolean;
  store: Record<string, any>;
  constructor(options: DataStoreOptions) {
      const { name, kvKey, key = 'data-store', pathPrefix = '' } = options || {};
      super({ key, name });

      this.id = `${key}-${name}${kvKey ? `-${kvKey}` : ''}`;
      this.kvKey = kvKey || `${key}-${name}`;
      this.pathPrefix = pathPrefix;

      this.initialized = false;
      this.store = {};
  }

  getPath(key: string) {
      return [this.pathPrefix, key].filter(Boolean).join('.');
  }

  get(path?: string): any {
      return cloneDeep(path ? getByKey(this.store, this.getPath(path)) : this.store) as any;
  }

  set(path: string, data: any) {
      setByKey(this.store, this.getPath(path), data);
  }

  has(path: string) {
      return hasByPath(this.store, this.getPath(path));
  }

  add(path: string, nb: number) {
      this.set(this.getPath(path), +(this.get(this.getPath(path)) || 0) + nb);
  }

  subtract(path: string, nb: number) {
      this.set(this.getPath(path), +(this.get(this.getPath(path)) || 0) - nb);
  }

  pop(path: string) {
      const items = this.get(this.getPath(path)) || [];
      const item = items.pop();
      this.set(this.getPath(path), items);
      return item;
  }

  shift(path: string) {
      const items = this.get(this.getPath(path)) || [];
      const item = items.shift();
      this.set(this.getPath(path), items);
      return item;
  }

  push(path: string, data: any) {
      this.set(this.getPath(path), [...(this.get(this.getPath(path)) || []), data]);
  }

  setAndGetKey(data: any) {
      const path = craftUIDKey();
      this.set(this.getPath(path), data);
      return path;
  }

  update(path: string, data: any, merger: (oldData: any, newData: any) => any = () => undefined) {
      this.set(this.getPath(path),
          mergeWith(
              this.get(this.getPath(path)) || {},
              data || {},
              merger,
          ),
      );
  }

  async init() {
      if (!this.initialized) {
          this.log.info('Initializing...');
          this.initialized = true;
          const data = await Apify.getValue(this.kvKey) || {} as any;
          this.store = data;
      }
  }

  async persist() {
      this.log.info('Persisting...');
      await Apify.setValue(this.kvKey, this.store);
  }
}
