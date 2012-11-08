define(
    "sb/defaultObserver",
    [
        "sb/base/binding"
    ],
    function(binding) {
        /**
         * @const {sb.base.binding.Observer} default observer.
         */
        var defaultObserver = new binding.Observer();
        return defaultObserver;
    }
);
