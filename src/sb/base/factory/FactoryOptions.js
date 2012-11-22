define(
        'sb/base/factory/main',
        [
                'sb/base/binding/Observer'
        ],
        function(Observer) {

                /**
                 * Options for factory.
                 * @class FactoryOptions
                 * @constructor
                 * @namespace sb.base.factory
                 *
                 * @param {sb.base.binding.Observer} observer observer
                 */
                function FactoryOptions(observer) {

                        /**
                         * Get and set observer.
                         * @property observer
                         * @public
                         */
                        this.observer = observer || new Observer();
                }

                return FactoryOptions;
        }
);
