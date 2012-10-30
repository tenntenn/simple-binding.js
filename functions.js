// It provide functions which can be use easily.
(function() {

    /**
     * @const {sb.Observer} default observer.
     */
    var observer = new sb.Observer();

    /**
     * Create default setting binding chain.
     * @return {sb.BindingChain} default setting binding chain.
     */
    sb.binding = function() {

        /**
         * @type {Array.<*>} arguments array of this function.
         */
        var args = sb.argumentsToArray(arguments);

        /**
         * @type {Array.<sb.ObservableProperty>} 
         */
        var observables = args.filter(function(arg){
            return sb.isObservable(arg);
        });

        /**
         * @type {sb.BindingChain} default setting binding chain.
         */
        var chain = new sb.BindingChain(observer, observables);

        return chain;
    };

    /**
     * Create default setting property of sb.Observable.
     * @param {*} initValue initial value.
     * @return {sb.ObservableProperty} default setting property of sb.Observable.
     */
    sb.observable = function(initValue) {
        /**
         * @type {sb.ObservableProperty} default setting property of sb.Observable.
         */
        var observable = new sb.Observable(observer, initValue);
        return observable.property;
    };

     /**
      * Create default setting property of sb.ObservableArray.
      * @param {*} array initial value.
      * @return {sb.ObservableProperty} default setting property of sb.ObservableArray.
      */
    sb.observableArray = function(array) {
        /**
         * @type {sb.ObservableProperty} default setting property of sb.ObservableArray.
         */
        var observableArray = new sb.ObservableArray(observer, array);
        return observableArray.property;
    };
})();

