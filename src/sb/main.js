define(
        'sb/main',
        [
                // utility classes
                "sb/util/main",

                // base classes 
                "sb/base/main",

                // default value of observables
                "sb/binding",
                "sb/observable",
                "sb/observableArray",

                // default value of ko wrapper
                "sb/koObservable",
                "sb/koObservableArray"
        ],
        function(util, base,
                 binding, observable, observableArray,
                 koObservable, koObservableArray) {

                /**
                 * The root module of simple-binding.js.
                 * @class sb
                 */
                var sb = {
                        util: util,
                        base: base,

                        binding: binding,
                        observable: observable,
                        observableArray: observableArray,

                        /**
                         * It provides KockoutJS wrappers.
                         * @class ko
                         * @namespace sb
                         */
                        ko: {
                                observable: koObservable,
                                observableArray: koObservableArray
                        }
                };

                return sb;
        }
);
