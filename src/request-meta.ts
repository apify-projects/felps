import Base from './base';
import { METADATA_KEY } from './common/consts';
import { RequestMetaData, RequestContext, RequestSource } from './common/types';

export default class RequestMeta extends Base {
  private _data: any;
  private _userData: any;

  constructor() {
      super({ key: 'request-meta', name: 'request-meta' });
  }

  from(requestOrCrawlingContext: RequestSource | RequestContext) {
      this._userData = ((requestOrCrawlingContext as RequestContext)?.request || (requestOrCrawlingContext as RequestSource))?.userData;
      this._data = this._userData?.[METADATA_KEY];
      return this;
  }

  addTo(request: RequestSource) {
      return {
          ...request,
          userData: {
              ...request.userData,
              [METADATA_KEY]: this._data,
          },
      };
  };

  get data(): RequestMetaData {
      return this._data;
  }

  set data(value: RequestMetaData) {
      this._data = value;
  }

  get userData(): any {
      return this._userData;
  }
};
