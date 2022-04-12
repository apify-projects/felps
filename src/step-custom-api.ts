import Base from './base';
import { RequestContext, StepBaseApiMethods, StepCustomApiExtend, StepCustomApiOptions } from './common/types';

export default class StepCustomApi<Methods = unknown, InitialMethods = StepBaseApiMethods> extends Base {
  private _extend: StepCustomApiExtend<InitialMethods, Methods>;

  constructor(options: StepCustomApiOptions<InitialMethods, Methods>) {
    super({ key: 'step-api', name: 'step-api' });
    this._extend = options.extend;
  }

  make(crawlingContext: RequestContext, api: InitialMethods): Methods {
    return (this._extend?.(crawlingContext, api) ?? {}) as Methods;
  }
}