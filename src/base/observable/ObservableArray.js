
/**
 * An array which can be observed.
 * If new element is added or an element deleted,
 * sb.base.observable.ObservableArray notify binded other sb.ObservableObject.
 *
 * @typedef {function():Array.<*>}
 */
sb.base.observable.ObservableArray;

/**
 * @param {sb.Observer} observer
 * @param {Array.<*>} initArray
 */
sb.base.observable.newObservableArray = function(observer, initArray) {

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
    var observable = function() {
        return array.concat();
    };

    /**
     * Notify changing for observer.
     * @param {sb.Propagation} propagation propagation context
     */
    observable.notify = function(propagation, e) {

       if (propagation(observable, observable)) {
           observer.notify(propagation, observable);
        }  
    };

    /**
     * Get array size which wrapes the internal array length.
     * @return {numnber} array size
     */
    observable.length = function() {
        return array.length;
    };

    /**
     * Get value with index i.
     */
    observable.get = function(i) {
        return array[i];
    };

    /**
     * Set value with index i.
     * And it notify observer.
     */
    observable.set = function(i, v) {

        /**
         * Propagation context.
         * @type {sb.Propagation}
         */
        var propagation = observer.getPropagationGuardian().createPropagation();

        /**
         * @type {sb.base.binding.NotificationEvent}
         */
        var e = {
            modifiedElements : [{
                index: i,
                previousValue: array[i],
                newValue: v
            }]
        };
 
        array[i] = v;
      
        observable.notify(propagation, e);
    };

    // wrapper for functions which change the internal array
    [
        "pop", 
        "shift", 
        "unshift", 
        "splice", 
        "reverse",
        "sort"
    ].forEach(function(fn) {
        if (typeof array[fn] === "function") {
            observable[fn] = function() {
                var args = sb.util.argumentsToArray(arguments);
                var ret = array[fn].apply(array, args); 
                /**
                 * Propagation context.
                 * @type {sb.Propagation}
                 */
                var propagation = observer.getPropagationGuardian().createPropagation();
                observable.notify(propagation);

                return ret;
            };
        }
    });

    /**
     * A wrapper of Array.push.
     * @return length of the array after adding new elements.
     */
    observable.push = function() {

        var args = sb.util.argumentsToArray(arguments);
        var length;        

        /**
         * Propagation context.
         * @type {sb.Propagation}
         */
        var propagation = observer.getPropagationGuardian().createPropagation();

        /**
         * @type {sb.base.binding.NotificationEvent}
         */
        var e = {
            addedElements : []
        };

        var index = array.length + index;
        args.forEach(function(arg) {
            e.addedElements.push({
                index: index,
                value: arg
            });
            index++;
        });
        
        length = array.push.apply(array, args);

        observable.notify(propagation, e);

        return length;
    };


    // wrapper for functions which return array
    // without changing the internal array.
    [
        "concat",
        "map",
        "filter"
    ].forEach(function(fn) {
         if (typeof array[fn] === "function") {
            observable[fn] = function() {
                var args = sb.util.argumentsToArray(arguments);
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
            observable[fn] = function() {
                var args = sb.util.argumentsToArray(arguments);
                var ret = array[fn].apply(array, args);
                return ret;
            };
        }
    });

    return observable;
};
