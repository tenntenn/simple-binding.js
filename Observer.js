/**
 * @constructor
 */
sb.Observer = function(propagationGuardian) {

    if (!propagationGuardian
            || !propagationGuardian instanceof sb.PropagationGuardian) {
        console.log("hoge");
        propagationGuardian = sb.defaultPropagationGuardian;
    }

    /**
     * @type {Array.<sb.Binding>}
     */
    var bindings = [];

    /**
     * Get sb.PropagationGuardian.
     * @return {sb.PropagationGuardian}
     */
    this.getPropagationGuardian = function() {
        return propagationGuardian;
    }

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
     * @param {sb.Propagation} propagation 
     * @param {Array<sb.Observable>} input
     * @return void
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
