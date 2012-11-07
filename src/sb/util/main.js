define(
        "sb/util/main",
        [
                "sb/util/argumentsToArray",
                "sb/util/expandable"
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
