define(
        "sb/base/binding/Observer",
        [
                "sb/base/binding/PropagationGuardian",
                "sb/base/binding/DEFAULT_PROPAGATION_GURDIAN"
        ],
        function(PropagationGuardian, DEFAULT_PROPAGATION_GURDIAN) {

                /**
                 * This class observes ObservableObject.
                 * @class Observer
                 * @constructor
                 * @namespace sb.base.binding
                 * @uses sb.base.binding.ObservableObject
                 */
                function Observer(propagationGuardian) {

                        if (!propagationGuardian ||
                            !propagationGuardian instanceof PropagationGuardian) {
                                propagationGuardian = DEFAULT_PROPAGATION_GURDIAN;
                            }

                            /**
                             * @private
                             * @type Array.<sb.base.binding.Binding>
                             */
                            var bindings = [];

                            /**
                             * Get PropagationGuardian.
                             * @method getPropagationGuardian
                             * @return {sb.base.binding.PropagationGuardian} PropagationGuardian
                             */
                            this.getPropagationGuardian = function() {
                                    return propagationGuardian;
                            }

                            /**
                             * Add new binding.
                             * @method add
                             * @param {sb.base.binding.Binding} binding
                             */
                            this.add = function(binding) {

                                    if (binding === null
                                        || typeof binding === "undefined") {
                                                return;
                                        }

                                        if (bindings.indexOf(binding) < 0) {
                                                bindings.push(binding);
                                        }
                            };

                            /**
                             * Notify change to binded observables.
                             * @method nofity
                             * @param {sb.base.binding.Propagation} propagation 
                             * @param {Array<sb.base.binding.Observable>} input
                             */
                            this.notify = function(propagation, input) {

                                    // get bindings which has given input as argument
                                    var bs = bindings.filter(function(binding) {
                                            var found = false;
                                            Object.keys(binding.inputs).forEach(function(key) {
                                                    if (binding.inputs.hasOwnProperty(key)
                                                        && binding.inputs[key] === input) {
                                                                found = true;
                                                                return;
                                                        }
                                            });
                                            return found;
                                    });

                                    bs.forEach(function(binding) {
                                            binding.notify(propagation);
                                    });
                            };

                            /**
                             * Remove binding from this observer.
                             * @method remove
                             * @param {sb.base.binding.Binding} binding
                             */
                            this.remove = function(binding) {
                                    var index = bindings.lastIndexOf(binding);
                                    if (index >= 0) {
                                            bindings.splice(index, 1);
                                    }
                            };
                };

                return 	Observer;
        }
);
