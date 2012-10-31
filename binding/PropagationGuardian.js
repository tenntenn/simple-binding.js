/**
 * 
 * @constructor
 */
sb.binding.PropagationGuardian = function(continueCondition, timeout) {

    if (typeof continueCondition !== "function") {
        continueCondition = function() {
            return true;
        };
    }

    if (typeof timeout !== "number"
            || timeout <= 0) {
        timeout = 1;
    }

    this.createPropagation = function() {

        /**
         * Call Stack of observable.
         * @type {Array.<sb.binding.ObservableProperty>}
         */
        var callStack = [];

        /**
         * Test propagation is success with given continueCondition and timeout.
         * @type {sb.binding.Propagation}
         * @param {sb.binding.ObservableProperty} source adjacent source of notify propagation
         * @param {Object} e event object.
         */
        var propagation =  function(source, e) {

            // getter of callStack
            propagation.callStack = function() {
                return callStack.concat();
            };

            /**
             * Counter for number of appearance
             * of same observable in callstack.
             * @type {number}
             */
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

/**
 * Default sb.binding.PropagationGuardian.
 * @const {sb.binding.PropagationGuardian}
 */
sb.binding.defaultPropagationGuardian = new sb.binding.PropagationGuardian(null, 1);

