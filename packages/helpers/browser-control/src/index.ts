import { ClickManagerOptions } from '@usefelps/types';

export const SCRIPTS = {
    blockWindowOpenMethod() {
        //@ts-ignore
        window.open = function () {
            console.log('Page attempted to open new window with window.open');
        };
    },

    // This is heavily inspired by the original work of mstephen19
    // https://github.com/mstephen19/apify-click-events

    clickManager({
        enableOnPagesIncluding = ['*'],
        blockGlobalEvents = true,
        blockElementEvents = true,
        mode = 'WHITELIST', // WHITELIST, BLACKLIST
        whitelist = [],
        blacklist = [],
        stopClickPropagation = true,
    }: ClickManagerOptions) {
        (() => {
            const CLICK_MANAGER_KEY = '__CM__';
            const typesToBlock = ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup'];

            const url = window.location.href;

            if (!enableOnPagesIncluding.includes('*')) {
                if (!enableOnPagesIncluding.some((str: string) => url.includes(str))) return;
            }

            // Add whitelist and blacklist lists to the window

            let clickManager = {
                whitelist,
                blacklist,
                mode,
                blockGlobalEvents,
                blockElementEvents,
                stopClickPropagation,
            }

            //@ts-ignore
            window[CLICK_MANAGER_KEY] = clickManager;

            if (window[CLICK_MANAGER_KEY].blockElementEvents) {
                // Block any targeted listeners from even being added
                const { addEventListener: _addEventListener } = Element.prototype;

                const _addListener = function (type, func, option) {
                    if (typesToBlock.some((a) => a === type)) return;

                    //@ts-ignore
                    _addEventListener.call(this, type, func, option);
                };

                window.addEventListener = _addListener;
            }

            if (window[CLICK_MANAGER_KEY].blockGlobalEvents) {
                // Prevent each from propogating unless the target matches a selector
                for (const type of typesToBlock) {
                    window.addEventListener(
                        type,
                        function (e) {
                            //@ts-ignore
                            if (window[CLICK_MANAGER_KEY].mode === 'WHITELIST') {
                                //@ts-ignore
                                if (window[CLICK_MANAGER_KEY].whitelist.some((s: string) => e.target.matches(s))) {
                                    return;
                                }
                                return e.stopImmediatePropagation();
                            }
                            //@ts-ignore
                            if (window[CLICK_MANAGER_KEY].mode === 'BLACKLIST') {
                                //@ts-ignore
                                if (window[CLICK_MANAGER_KEY].blacklist.some((s: string) => e.target.matches(s))) {
                                    e.stopImmediatePropagation();
                                }
                            }
                        },
                        true
                    );
                }
            }

            // For whitelist mode
            if (mode === 'WHITELIST') {
                window.addEventListener('DOMContentLoaded', () => {
                    setInterval(() => {
                        const elems = [...document.querySelectorAll('*')];

                        elems.forEach((elem) => {
                            //@ts-ignore
                            if (window[CLICK_MANAGER_KEY].whitelist.some((s: string) => elem.matches(s))) {
                                //@ts-ignore
                                elem.style.pointerEvents = 'auto';

                                // Prevent the possibility of the event propogating to other elements and firing other events
                                //@ts-ignore
                                if (!elem.listenerAdded && window[CLICK_MANAGER_KEY].stopClickPropogation) {
                                    elem.addEventListener('click', function (e) {
                                        e.stopPropagation();
                                    });

                                    elem.addEventListener('mousedown', function (e) {
                                        e.stopPropagation();
                                    });

                                    //@ts-ignore
                                    elem.listenerAdded = true;
                                }

                                return;
                            }
                            // Disable pointer events
                            //@ts-ignore
                            elem.style.pointerEvents = 'none';
                        });
                    }, 700);

                });
            }

            // For blacklist mode
            if (mode === 'BLACKLIST') {
                window.addEventListener('DOMContentLoaded', () => {
                    setInterval(() => {
                        const elems = [...document.querySelectorAll('*')];

                        elems.forEach((elem) => {
                            //@ts-ignore
                            if (window[CLICK_MANAGER_KEY].blacklist.some((s: string) => elem.matches(s))) {
                                //@ts-ignore
                                elem.style.pointerEvents = 'none';
                                return;
                            }
                            //@ts-ignore
                            elem.style.pointerEvents = 'auto';
                        });
                    }, 700);

                });
            }

        })()
    }
}


export default { SCRIPTS };
