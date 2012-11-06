/**
 * Create an expandable function 
 * which can expand with other function.
 * Forexample, let f is expandable function and g is normal function.
 * f.expand(g) expand f with g.
 * Calling expanded f do the original process of f and then do the g's process. 
 * 
 * @return {function(*):*} expandable function
 */
sb.util.expandable = function() {
    
    /**
     * Expandable function.
     * @type {function(*):*} 
     */
    var that = function() {
        var args = sb.util.argumentsToArray(arguments);
        that.funcs.forEach(function(f) {
            f.apply(that, args);
        });
    };

    /**
     * Arguments array of this function.
     * @type {Array.<*>}
     */
    var args = sb.util.argumentsToArray(arguments);

    /**
     * Sub functions.
     * @type {Array.<function(*):*>}
     */
    that.funcs = args.filter(function(arg) {
        return typeof arg === "function";
    });
 
    /**
     * Expand with given function.
     * @param {function(*):*} newFunc new sub function which is run at last.
     */
    that.expand = function(newFunc) {
        if (typeof newFunc === "function") {
            that.funcs.push(newFunc);
        }
        return that;
    };

    return that;
};
