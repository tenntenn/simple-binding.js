// It provide functions which can be use easily.
(function() {

    /**
     * @const {sb.binding.Observer} default observer.
     */
    var observer = new sb.binding.Observer();

    /**
     * Create default setting binding chain.
     * @return {sb.binding.BindingChain} default setting binding chain.
     */
    sb.binding = function() {

        /**
         * @type {Array.<*>} arguments array of this function.
         */
        var args = sb.util.argumentsToArray(arguments);

        /**
         * @type {Array.<sb.observable.ObservableObject>} 
         */
        var observables = args.filter(function(arg){
            return sb.observable.isObservable(arg);
        });

        /**
         * @type {sb.binding.BindingChain} default setting binding chain.
         */
        var chain = new sb.binding.BindingChain(observer, observables);

        return chain;
    };

    /**
     * Create default setting property of sb.observable.Observable.
     * @param {*} initValue initial value.
     * @return {sb.observable.Observable} default setting of sb.observable.Observable.
     */
    sb.observable = function(initValue) {
        /**
         * @type {sb.observable.Observable} default setting of sb.observable.Observable.
         */
        var observable = new sb.observable.newObservable(observer, initValue);
        return observable;
    };

     /**
      * Create default setting property of sb.observable.ObservableArray.
      * @param {*} array initial value.
      * @return {sb.observable.ObservableArray} default setting sb.observable.ObservableArray.
      */
    sb.observableArray = function(array) {
        /**
         * @type {sb.observable.ObservableArray} default setting of sb.observable.ObservableArray.
         */
        var observableArray = new sb.observable.newObservableArray(observer, array);
        return observableArray;
    };
})();

