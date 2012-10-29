(function(){
    /**
     * @private
     * @constructor
     * @param {sb.BindingMaster} bindingMaster
     * @param {*} value
     */
    sb.ObservableArray = function(bindingMaster, array) {

        // init internal array
        if (!(array instanceof Array)) {
            array = [];
        }

        // return the internal array
        var property = function() {
            return array.concat();
        };
    
        /**
         * @param {Array.<sb.Observable>} callStack
         */
        property.notify = function(callStack) {
            if (callStack.lastIndexOf(property) < 0) {
               bindingMaster.notify(callStack.concat(property), property);
            }  
        };

        // size of the internal array length
        property.length = function() {
            return array.length;
        };

        property.get = function(i) {
            return array[i];
        };

        property.set = function(i, v) {
            array[i] = v;
            property.notify([]);
        };

        // wrapper for functions which change the internal array
        [
            "push", 
            "pop", 
            "shift", 
            "unshift", 
            "splice", 
            "reverse",
            "sort"
        ].forEach(function(fn) {
            if (typeof array[fn] === "function") {
                property[fn] = function() {
                    var args = sb.argumentsToArray(arguments);
                    var ret = array[fn].apply(array, args); 
                    property.notify([]);

                    return ret;
                };
            }
        });


        // wrapper for functions which return array
        // without changing the internal array.
        [
            "concat",
            "map",
            "filter"
        ].forEach(function(fn) {
             if (typeof array[fn] === "function") {
                property[fn] = function() {
                    var args = sb.argumentsToArray(arguments);
                    var ret = array[fn].apply(array, args); 

                    // wrap with ObservableArray
                    var oa = new ObservableArray(bindingMaster, ret);
                    
                    return oa;
                };
            }           
        });


        // wrapper for functions which return non array value
        // without changing the internal array.
        [
            "join",
            "toString",
            "toLocalString",
            "indexOf",
            "lastIndexOf",
            "forEach"
        ].forEach(function(fn) {
            if (typeof array[fn] === "function") {
                property[fn] = function() {
                    var args = sb.argumentsToArray(arguments);
                    var ret = array[fn].apply(array, args);
                    return ret;
                };
            }
        });
   
        property.observable = this;
        this.property = property;
    };
})();
