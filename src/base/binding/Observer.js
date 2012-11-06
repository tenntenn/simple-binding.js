define(
    "sb.base.binding.Observer",
    [
    ],
    function() {
	
	
	/**
	 * @constructor
	 */
	function Observer(propagationGuardian) {
	    
	    if (!propagationGuardian
		|| !propagationGuardian instanceof sb.base.binding.PropagationGuardian) {
		propagationGuardian = sb.base.binding.defaultPropagationGuardian;
	    }

	    /**
	     * @type {Array.<sb.base.binding.Binding>}
	     */
	    var bindings = [];

	    /**
	     * Get sb.base.binding.PropagationGuardian.
	     * @return {sb.base.binding.PropagationGuardian}
	     */
	    this.getPropagationGuardian = function() {
		return propagationGuardian;
	    }

	    /**
	     * @param {sb.base.binding.Binding} binding
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
	     * @param {sb.base.binding.Propagation} propagation 
	     * @param {Array<sb.base.binding.Observable>} input
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
	     * @param {sb.base.binding.Binding} target
	     * @return void
	     */
	    this.remove = function(target) {
		var index = bindings.lastIndexOf(target);
		if (index >= 0) {
		    bindings.splice(index, 1);
		}
	    };
	};
	return 	Observer;
    }
);
