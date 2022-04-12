import Base from './base';
import { StepCustomApiExtend, StepOptions, StepOptionsHandler } from './common/types';

export default class Step<InitialMethods = unknown, Methods = unknown> extends Base {
  handler: StepOptionsHandler<InitialMethods & Methods>;
  controlHandler?: StepOptionsHandler<InitialMethods & Methods>;
  failHandler?: StepOptionsHandler<InitialMethods & Methods>;
  requestErrorHandler?: StepOptionsHandler<InitialMethods & Methods>;
  extendStepApi: StepCustomApiExtend<InitialMethods, Methods>;

  constructor(options: StepOptions<InitialMethods, Methods>) {
      const { name } = options;
      super({ key: 'step', name });

      this.extend(options);
  }

  extend(options: Partial<StepOptions<InitialMethods, Methods>>) {
      const {
          handler = async () => undefined,
          controlHandler = async () => undefined,
          failHandler = async () => undefined,
          requestErrorHandler = async () => undefined,
          extendStepApi = () => ({} as Methods),
      } = options;

      this.handler = handler || this.handler;
      this.controlHandler = controlHandler || this.controlHandler;
      this.failHandler = failHandler || this.failHandler;
      this.requestErrorHandler = requestErrorHandler || this.requestErrorHandler;
      this.extendStepApi = extendStepApi || this.extendStepApi;
  }
}
