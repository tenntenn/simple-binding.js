define(
        "sb/base",
        [
                "sb/base/observable",
                "sb/base/binding"
        ],
        function(observable, binding) {
                /**
                 * It provides base of structures.
                 * @namespace
                 */
                var base = {
                        observable: observable,
                        binding: binding
                };

                return base;
        }
);
