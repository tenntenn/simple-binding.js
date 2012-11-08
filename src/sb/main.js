define(
        'sb/main',
        [
                "sb/util/main",
                "sb/base/main"
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
