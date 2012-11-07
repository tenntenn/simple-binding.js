define(
        "sb/base/binding/DEFAULT_PROPAGATION_GURDIAN",
        [
                "sb/base/binding/PropagationGuardian"
        ],
        function(PropagationGuardian) {

                /** 
                 * Default value of sb.base.binding.PropagationGuardian.
                 * @property DEFAULT_PROPAGATION_GURDIA 
                 * @namespace sb.base.binding
                 * @for PropagationGuardian
                 * @final
                 */
                var DEFAULT_PROPAGATION_GURDIAN = new PropagationGuardian(null, 1);

                return DEFAULT_PROPAGATION_GURDIAN;
        }
);
