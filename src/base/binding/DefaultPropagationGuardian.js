define(
    "sb.base.binding.DefaultPropagationGuardian",
    [
	"sb.base.binding.PropagationGuardian"
    ],
    function() {
	
	/** 
	 * Default sb.base.binding.PropagationGuardian
	 * @const {sb.base.binding.PropagationGuardian} 
	 **/
	var defaultPropagationGuardian = new sb.base.binding.PropagationGuardian(null, 1);
	
	return defaultPropagationGuardian;
    }
);
