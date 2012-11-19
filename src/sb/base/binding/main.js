define(
        "sb/base/binding/main",
        [
                "sb/base/binding/Observer",
                "sb/base/binding/Binding",
                "sb/base/binding/BindingChain",
                "sb/base/binding/PropagationGuardian",
                "sb/base/binding/DEFAULT_PROPAGATION_GURDIAN"
        ],
        function(Observer, Binding, BindingChain, PropagationGuardian, DEFAULT_PROPAGATION_GURDIAN) {

                /**
                 * It provides objects which are related to binding.
                 */
                var binding = {
                        Observer : Observer,
                        Binding : Binding,
                        BindingChain : BindingChain,
                        PropagationGuardian : PropagationGuardian,
                        DEFAULT_PROPAGATION_GURDIAN: DEFAULT_PROPAGATION_GURDIAN
                };

                return binding;
        }
);
