define(
        "sb/base/observable/newObservableArray",
        [
                "sb/util/main"
        ],
        function(util) {

                /**
                 * Create observable array.
                 * @method sb.base.observable.newObservableArray
                 * @public
                 * @static
                 * @param {sb.base.binding.Observer} observer registed observer
                 * @param {Array.<*>} initArray initial value of array
                 * @return {sb.base.observable.ObservableArray} created observable array
                 */
                function newObservableArray(observer, initArray) {

                        // internal array
                        var array = initArray;
                        if (!(array instanceof Array)) {
                                array = [];
                        }

                        /**
                         * An array which can be observed.
                         * If new element is added or an element deleted,
                         * sb.base.observable.ObservableArray notify binded other 
                         * sb.base.observable.ObservableObject.
                         *
                         * @class ObservableArray
                         * @namespace sb.base.observable
                         * @extends sb.base.observable.ObservableObject 
                         * @type function():Array
                         * @return {Array} internal array
                         */
                        var observable = function() {
                                return array.concat();
                        };

                        /**
                         * Notify changing for observer.
                         * @method notify
                         * @public
                         * @param {sb.base.binding.Propagation} propagation propagation context
                         * @param {sb.base.binding.NotificationEvent} e event object
                         */
                        observable.notify = function(propagation, e) {
                                if (propagation(observable, observable)) {
                                        observer.notify(propagation, observable);
                                }  
                        };

                        /**
                         * Get array size which wrapes the internal array length.
                         * @method length
                         * @public
                         * @return {numnber} array size
                         */
                        observable.length = function() {
                                return array.length;
                        };

                        /**
                         * Get value with index i.
                         * @method get
                         * @public
                         * @param {numnber} i index
                         * @return {Object} value of given index.
                         */
                        observable.get = function(i) {
                                return array[i];
                        };

                        /**
                         * Set value with index i.
                         * And it notify observer.
                         * @method set
                         * @public
                         * @param {numnber} i index
                         * @param {Object} v value
                         */
                        observable.set = function(i, v) {

                                // Propagation context.
                                var propagation = observer.getPropagationGuardian().createPropagation();

                                array[i] = v;
                                observable.notify(propagation, array);

                        };

                        // wrapper for functions which change the internal array
                        [
                                /**
                                 * Wrapper of Array.push.
                                 * @method push
                                 * @public
                                 * @param {Object} [element*] The elements to add to the end of the array.
                                 * @return {number} The new length property of the object upon which the method was called.
                                 */
                                "push",

                                /**
                                 * Wrapper of Array.pop.
                                 * @method pop
                                 * @public
                                 */
                                "pop", 

                                /**
                                 * @method shift
                                 */
                                "shift", 

                                "unshift", 

                                "splice", 

                                "reverse",

                                "sort"
                        ].forEach(function(fn) {
                                if (typeof array[fn] === "function") {
                                        observable[fn] = function() {
                                                var args = util.argumentsToArray(arguments);
                                                var ret = array[fn].apply(array, args); 
                                                /**
                                                 * Propagation context.
                                                 * @type {sb.Propagation}
                                                 */
                                                var propagation = observer.getPropagationGuardian()
                                                .createPropagation();
                                                observable.notify(propagation);

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
                                        observable[fn] = function() {
                                                var args = util.argumentsToArray(arguments);
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
                                                var args = util.argumentsToArray(arguments);
                                                var ret = array[fn].apply(array, args);
                                                return ret;
                                        };
                                }
                        });

                        return observable;
                }

                return newObservableArray;
        }
);
