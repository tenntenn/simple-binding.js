/**
 * @constructor
 */
sb.Observer = function() {

    /**
     * @type {Array.<sb.Binding>}
     */
    var bindings = [];

    /**
     * @param {sb.Binding} binding
     * @return void
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
     * @param {Array<sb.Observable>} callStack
     * @param {Array<sb.Observable>} input
     * @return void
     */
    this.notify = function(callStack, input) {

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
            binding.notify(callStack);
        });
   };

    /**
     * @param {sb.Binding} target
     * @return void
     */
    this.remove = function(target) {
        var index = bindings.lastIndexOf(target);
        if (index >= 0) {
            bindings.splice(index, 1);
        }
    };
};
