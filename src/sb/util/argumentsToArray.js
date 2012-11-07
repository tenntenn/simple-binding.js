define(
    "sb/util/argumentsToArray",
    [],
    function() {

        function argumentsToArray(args) {
            var arry = [];
                Object.keys(args).forEach(function(i) {
                    arry.push(args[i]);
                });
                return arry;
        }

        return argumentsToArray;
    }
);
