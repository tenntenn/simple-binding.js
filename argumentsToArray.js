sb.argumentsToArray = function(args) {
    var arry = [];
    Object.keys(args).forEach(function(i) {
        arry.push(args[i]);
    });

    return arry;
};
