define(
        "sb/base/binding/Binding",
        [
                "sb/base/observable/isObservableObject"
        ],
        function(isObservableObject){

                /**
                 * A binding between observables.
                 * If an observer which contained of input observables
                 * notifies changing own value to the observer 
                 * observer will notifies values which converted by computed function
                 * to binded observables which contained of output observables. 
                 *
                 * @class Binding
                 * @constructor
                 * @namespace sb.base.binding
                 * @param {sb.base.binding.Observer} observer the observer
                 * @param {sb.base.binding.Parameters} inputs input observables
                 * @param {sb.base.binding.Parameters} outputs output observables
                 * @param {sb.base.binding.Computed} computed computed function
                 */
                function Binding(observer, inputs, outputs, computed) {

                        /**
                         * Own object.
                         * @property that
                         * @private
                         * @type {sb.base.binding.Binding} 
                         */
                        var that = this;

                        /**
                         * Input observables.
                         * @property inputs
                         * @public
                         * @type {sb.base.binding.Parameters} 
                         */
                        that.inputs = inputs;

                        /**
                         * Output observables.
                         * @property outputs
                         * @public
                         * @type {sb.base.binding.Parameters}
                         */
                        that.outputs = outputs;

                        /**
                         * Computed function.
                         * @property computed
                         * @public
                         * @type {sb.base.binding.Computed}
                         */
                        that.computed = computed;

                        /**
                         * Enable this binding.
                         * @method bind
                         * @public
                         * @chainable
                         * @return {sb.base.binding.Binding} own object
                         */
                        that.bind = function() {
                                observer.add(that);
                                return that;
                        };

                        /**
                         * Disable this binding.
                         * @method unbind
                         * @public
                         * @chainable
                         * @return {sb.base.binding.Binding} own object
                         */
                        that.unbind = function() {
                                observer.remove(that);
                                return that;
                        };

                        /**
                         * Notify changing to output observables.
                         * @method notify
                         * @public
                         * @chainable
                         * @param {sb.base.binding.Propagation} propagation propagation context
                         * @return {sb.base.binding.Binding} own object
                         */
                        that.notify = function(propagation) {

                                /**
                                 * @type {sb.base.observable.ObservableObject} source of notification
                                 */
                                var source = propagation.getSource();

                                /**
                                 * @type {sb.base.binding.NotificationEvent} event object
                                 */
                                var e = propagation.getEventObject();

                                /**
                                 * @type {sb.base.binding.Parameters} result of computed
                                 */
                                var result = computed(inputs, source, e);

                                /**
                                 * @type {Array.<sb.base.observable.ObservableObject>}
                                 */
                                var callStack = propagation.callStack();

                                /**
                                 * @type {sb.base.observable.ObservableObject} input observable
                                 */
                                var input = callStack[callStack.length - 1];

                                // notify to output observables
                                Object.keys(result).forEach(function(name){
                                        var observable = outputs[name];
                                        if (input !== observable
                                            && outputs.hasOwnProperty(name)
                                    && isObservableObject(observable)) {
                                            observable.notify(propagation, result[name]);
                                    }
                                });

                                return that;
                        };
                }
                return Binding;

        }
);
