define(
    "sb.base.binding",
    [
	"sb.base.binding.Observer",
	"sb.base.binding.Binding",
	"sb.base.binding.BindingCain",
	"sb.base.binding.PropagationGuardian",
	"sb.base.binding.DefaultPropagationGuardian"
    ],
    function(Observer, Binding, BindingCain, PropagationGuardian, DefaultPropagationGuardian) {

	/**
	 * It provides objects which are related to binding.
	 * @namespace
	 */
	var binding = {
	    Observer : Observer,
	    Binding : Binding,
	    BindingCain : BindingCain,
	    PropagationGuardian : PropagationGuardian,
	    DefaultPropagationGuardian : DefaultPropagationGuardian
	};
	return binding;
    }
);
