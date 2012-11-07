define(
        'sb',
        [
                "sb/util",
                "sb/base"
        ],
        function(util, base) {

                /**
                 * The root module of simple-binding.js.
                 */
                var sb = {
                        util: util,
                        base: base
                };

                return sb;
        }
);
