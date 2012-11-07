define(
        "sb/util",
        [
                "sb/util/argumentsToArray.js",
                "sb/util/expandable.js"
        ],
        function(argumentsToArray, expandable) {
                /**
                 * It provides utility functions and data structures.
                 * @namespace
                 */
                var util = {
                        argumentsToArray: argumentsToArray,
                        expandable: expandable
                };

                return util;
        }
);
