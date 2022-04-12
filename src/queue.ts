import Apify from 'apify';
import { QueueOptions, RequestOptionalOptions, RequestSource } from './common/types';
import { craftUIDKey } from './common/utils';
import Base from './base';
import RequestMeta from './request-meta';

export default class Queue extends Base {
  requestQueue: Apify.RequestQueue;

  constructor(options?: QueueOptions) {
    const { name = 'default' } = options || {};
    super({ key: 'queue', name });
    this.requestQueue = undefined;
  }

  async init() {
    if (!this.requestQueue) {
      this.requestQueue = await Apify.openRequestQueue(this.name !== 'default' ? this.name : undefined);
    }
  }

  async addRequest(request: RequestSource, options?: RequestOptionalOptions): Promise<Apify.QueueOperationInfo> {
    const meta = new RequestMeta().from(request);
    this.log.info(`Queueing ${request.url} request for: ${meta.data.step}.`);
    return this.requestQueue.addRequest({ uniqueKey: craftUIDKey('req', 6), ...request }, options);
  }
};
