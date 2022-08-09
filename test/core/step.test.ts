import Actor from '@usefelps/actor';
import Step from '@usefelps/step';
import Hook from '@usefelps/hook';

describe('Step.create', () => {
    const actor = Actor.create({ name: 'actor' });

    beforeAll(async () => {
        await Hook.run(actor?.hooks?.preStartedHook, actor, {});
    });

    it('should fire mainHook()', async () => {
        let value = false;
        const step = Step.create({
            name: 'TEST',
            hooks: {
                mainHook: Hook.create({
                    handlers: [
                        async () => { value = true; },
                    ],
                }),
            },
        });

        await Step.run(step, actor, undefined);
        expect(value).toBeTruthy();
    });

    it('should fire preNavigationHook()', async () => {
        let value = 0;
        const step = Step.create({
            name: 'TEST',
            hooks: {
                preNavigationHook: Hook.create({
                    handlers: [
                        async () => { value = 2; },
                    ],
                }),
                mainHook: Hook.create({
                    handlers: [
                        async () => { value = 1; },
                    ],
                }),
            },
        });

        await Step.run(step, actor, undefined);
        expect(value).toBe(1);
    });

    it('should fire async afterHandler()', async () => {
        let value = 0;
        const step = Step.create({
            name: 'TEST',
            hooks: {
                mainHook: Hook.create({
                    handlers: [
                        async () => { value = 1; },
                    ],
                }),
                postNavigationHook: Hook.create({
                    handlers: [
                        async () => { value = 2; },
                    ],
                }),
            },
        });

        await Step.run(step, actor, undefined);
        expect(value).toBe(2);
    });

    it('should fire async errorHandler()', async () => {
        let value = false;
        const step = Step.create({
            name: 'TEST',
            hooks: {
                mainHook: Hook.create({
                    handlers: [
                        async () => { throw Error('failed'); },
                    ],
                }),
                onErrorHook: Hook.create({
                    handlers: [
                        async () => { value = true; },
                    ],
                }),
            },
        });

        await Step.run(step, actor, undefined).catch(() => null);
        expect(value).toBeTruthy();
    });

    // it('should fire async requestErrorHandler()', async () => {
    //     let value = false;
    //     const step = Step.create({
    //         name: 'TEST',
    //         async handler() { },
    //         async requestErrorHandler() { value = true; },
    //     });

    //     await Step.run(step, actor, undefined);
    //     expect(value).toBe(2);
    // });
});
