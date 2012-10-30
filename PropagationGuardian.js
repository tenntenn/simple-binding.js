/**
 * 
 * @constructor
 */
sb.PropagationGuardian = function(stopCondition, timeout) {

    if (typeof stopCondition !== "function") {
        stopCondition = function() {
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
         * @type {Array.<sb.ObservableProperty>}
         */
        var callStack = [];

        /**
         * Test propagation is success with given stopCondition and timeout.
         * @type {sb.Propagation}
         * @param {sb.ObservableProperty} source adjacent source of notify propagation
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

            if (!stopCondition(source, e)) {
                return false;
            }

            callStack.push(source);

            return true;
        };


        return propagation;
    };     
};

/**
 * Default sb.PropagationGuardian.
 * @const {sb.PropagationGuardian}
 */
sb.defaultPropagationGuardian = new sb.PropagationGuardian(null, 1);

