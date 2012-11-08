define(
        "sb/DEFAULT_OBSERVER",
        [
                "sb/base/binding/main"
        ],
        function(binding) {
                /**
                 * default observer.
                 *
                 * @property DEFAULT_OBSERVER
                 * @for sb
                 * @private
                 * @type sb.base.binding.Observer 
                 */
                var DEFAULT_OBSERVER = new binding.Observer();

                return DEFAULT_OBSERVER;
        }
);
