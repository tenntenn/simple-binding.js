define(
        'sb/base/factory/SimpleBinding',
        [],
        function() {

                /**
                 * It provides easy way to access to each functions.
                 * @class SimpleBinding
                 * @constructor
                 * @namespace sb.base.factory
                 */
                function SimpleBinding(binding, observable, observableArray) {

                        /**
                         * Get and set binding function.
                         * @property binding
                         * @public
                         */
                        this.binding = binding || function(){};

                        /**
                         * Get and set observable function.
                         */
                        this.observable = observable || function(){};

                        /**
                         * Get and set observableArray function.
                         */
                        this.observableArray = observableArray || function() {};
                }

                return SimpleBinding;
        }
);
