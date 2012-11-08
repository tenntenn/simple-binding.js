define(
        "sb/DEFAULT_OBSERVER",
        [
                "sb/base/binding"
        ],
        function(binding) {
                /**
                 * default observer.
                 * @class DEFAULT_OBSERVER
                 * @private
                 * @namespace sb
                 * @type sb.base.binding.Observer 
                 */
                var DEFAULT_OBSERVER = new binding.Observer();
                return DEFAULT_OBSERVER;
        }
);
