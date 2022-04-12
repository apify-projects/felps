import { DefaultQueueNames, GenerateObject, QueueOptions, ValueOf } from './common/types';
import Store from './data-store';
import Queue from './queue';

export default class Queues<Names extends string[] = []> {
  items: GenerateObject<Names & DefaultQueueNames, Store>;

  constructor() {
      this.add('default');
  }

  add(name: Extract<ValueOf<Names>, string> | DefaultQueueNames, options: Omit<QueueOptions, 'name'> = {}) {
      this.items[name as string] = new Queue({ name, ...options });
  }
};
