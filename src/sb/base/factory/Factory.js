define(
        'sb/base/factory/Factory',
        [
                'sb/util/main',
                'sb/base/observable/newObservable',
                'sb/base/observable/newObservableArray',
                'sb/base/observable/isObservableObject',
                'sb/base/binding/BindingChain',

                'sb/base/factory/SimpleBinding'
        ],
        function(util, newObservable, newObservableArray, isObservableObject, BindingChain, SimpleBinding) {

                /**
                 * Factory of SimpleBinding object.
                 * @class Factory
                 * @constructor
                 * @namespace sb.base.factory
                 *
                 * @param {sb.base.factory.FactoryOptions} options Options of this factory
                 */
                function Factory(options) {

                        /**
                         * Create SimpleBinding object with given options.
                         * @method create
                         * @public
                         */
                        this.create = function() {

                                var observable = function(initValue) {
                                        var o = newObservable(options.observer, initValue);
                                        return o;
                                };

                                var observableArray = function(array) {
                                        var o = newObservableArray(options.observer, array);
                                        return o;
                                };

                                var binding = function() {
                                        var args = util.argumentsToArray(arguments);
                                        var observables = args.filter(function(arg) {
                                                return isObservableObject(arg);
                                        });

                                        var chain = new BindingChain(options.observer, observables);

                                        return chain;
                                };

                                var sb = new SimpleBinding(
                                        binding,
                                        observable,
                                        observableArray
                                );

                                return sb;
                        };
                }

                return Factory;
        }
);
