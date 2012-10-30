(function(){
    /**
     * @constructor
     * @param {sb.Observer} observer
     * @param {Array.<*>} initArray
     */
    sb.ObservableArray = function(observer, initArray) {

        /**
         * @type {sb.ObservableArray} own
         */
        var that = this;

        /**
         * @type {Array.<*>} internal array
         */
        var array = initArray;
        if (!(array instanceof Array)) {
            array = [];
        }

        /**
         * Get internal array.
         * @return {Array.<*>} internal array
         */
        that.property = function() {
            return array.concat();
        };
    
        /**
         * Notify changing for observer.
         * @param {Array.<sb.ObservableProperty>} callStack
         */
        that.property.notify = function(callStack) {
            if (callStack.lastIndexOf(that.property) < 0) {
               observer.notify(callStack.concat(that.property), that.property);
            }  
        };

        /**
         * Get array size which wrapes the internal array length.
         * @return {numnber} array size
         */
        that.property.length = function() {
            return array.length;
        };

        /**
         * Get value with index i.
         */
        that.property.get = function(i) {
            return array[i];
        };

        /**
         * Set value with index i.
         * And it notify observer.
         */
        that.property.set = function(i, v) {
            array[i] = v;
            that.property.notify([]);
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
                that.property[fn] = function() {
                    var args = sb.argumentsToArray(arguments);
                    var ret = array[fn].apply(array, args); 
                    that.property.notify([]);

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
                that.property[fn] = function() {
                    var args = sb.argumentsToArray(arguments);
                    var ret = array[fn].apply(array, args); 

                    // wrap with ObservableArray
                    var oa = new sb.ObservableArray(observer, ret);
                    
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
                that.property[fn] = function() {
                    var args = sb.argumentsToArray(arguments);
                    var ret = array[fn].apply(array, args);
                    return ret;
                };
            }
        });
   
    };
})();
