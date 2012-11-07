define(
        "sb/base/binding/PropagationGuardian",
        [
        ],
        function() {

                /**
                 * @class PropagationGuardian
                 * @constructor
                 * @namespace sb.base.binding
                 * @param {function():boolean} continueCondition
                 * @param {number} timeout
                 */
                function PropagationGuardian(continueCondition, timeout) {

                        if (typeof continueCondition !== "function") {
                                continueCondition = function() {
                                        return true;
                                };
                        }

                        if (typeof timeout !== "number"
                            || timeout <= 0) {
                                    timeout = 1;
                            }

                            /**
                             * @method createPropagation
                             * @public
                             */
                            this.createPropagation = function() {

                                    /**
                                     * Call Stack of observable.
                                     * @property callStack
                                     * @private
                                     * @for Propagation
                                     * @type Array
                                     */
                                    var callStack = [];

                                    /**
                                     * Test propagation is success with given continueCondition and timeout.
                                     * @class Propagation
                                     * @namespace sb.base.binding
                                     * @param {sb.base.binding.ObservableObject} source adjacent source of notify propagation
                                     * @param {sb.base.binding.NotificationEvent} e event object.
                                     */
                                    var propagation =  function(source, e) {

                                            /**
                                             * Get callStack of this propagation.
                                             * @method callStack
                                             * @public
                                             * @return {Array}
                                             */
                                            propagation.callStack = function() {
                                                    return callStack.concat();
                                            };

                                            /**
                                             * Get source observable.
                                             * @method getSource
                                             * @public
                                             * @return {sb.base.binding.ObservableObject}
                                             */ 
                                            propagation.getSource = function() {
                                                    return source;
                                            };

                                            /**
                                             * Get event object.
                                             * @method getEventObject
                                             * @public
                                             * @return {sb.base.binding.NotificationEvent}
                                             */
                                            propagation.getEventObject = function() {
                                                    return e;
                                            };

                                            // Counter for number of appearance
                                            // of same observable in callstack.
                                            var loopCount = 0;
                                            callStack.forEach(function(o) {
                                                    if (o === source) {
                                                            loopCount++;
                                                    }
                                            });

                                            // either loopCounter over timeout
                                            if (timeout <= loopCount) {
                                                    return false;
                                            }

                                            if (!continueCondition(source, e)) {
                                                    return false;
                                            }

                                            callStack.push(source);

                                            return true;
                                    };


                                    return propagation;
                            };     
                };

                return PropagationGuardian;
        }
);
