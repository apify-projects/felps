import Base from './base';
import { StepCustomApiExtend, StepOptions, StepOptionsHandler } from './common/types';

export default class Step<InitialMethods = unknown, Methods = unknown> extends Base {
  handler: StepOptionsHandler<InitialMethods & Methods>;
  controlHandler?: StepOptionsHandler<InitialMethods & Methods>;
  failHandler?: StepOptionsHandler<InitialMethods & Methods>;
  requestErrorHandler?: StepOptionsHandler<InitialMethods & Methods>;
  extendStepApi: StepCustomApiExtend<InitialMethods, Methods>;

  constructor(options: StepOptions<InitialMethods, Methods>) {
    const {
      name,
      handler = async () => undefined,
      controlHandler = async () => undefined,
      failHandler = async () => undefined,
      requestErrorHandler = async () => undefined,
      extendStepApi = () => ({} as Methods),
    } = options;

    super({ key: 'step', name });

    this.handler = handler;
    this.controlHandler = controlHandler;
    this.failHandler = failHandler;
    this.requestErrorHandler = requestErrorHandler;
    this.extendStepApi = extendStepApi;
  }

}
