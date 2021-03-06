define(
        "sb/base/main",
        [
                "sb/base/observable/main",
                "sb/base/binding/main",
                "sb/base/factory/main"
        ],
        function(observable, binding) {

                /**
                 * It provides base of structures.
                 */
                var base = {
                        observable: observable,
                        binding: binding
                };

                return base;
        }
);
